import mongoose from "mongoose";
import order_model from "../Model/OrdersModel.js";
import product_model from "../Model/ProductModel.js";
import loginmodel from "../Model/LoginModel.js";
import { io } from "../app.js";

import { generetnotification } from "../Model_API/notificationapi.js";
import {
  SendCancellationEmail,
  SendOrderEmail,
  SendOrderStatusEmail,
  SendLowStockEmail
} from "../Mail/MailAPI.js";

async function SendNotification(type, message, title) {
  try {
    await generetnotification(type, message, title);
  } catch (error) {
    console.log("Notification failed:", error.message);
  }
}

export async function createorder(data, userId) {
  const { id, quantity } = data;

  const session = await mongoose.startSession();

  const user = await loginmodel.findById(userId);

  if (!user) {
    throw new Error("user not found");
  }

  try {
    session.startTransaction();

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid quantity");
    }

    const product = await product_model.findById(id).session(session);

    // console.log("PRODUCT ID:", product._id);
    // console.log("PRODUCT NAME:", product.productName);
    // console.log("CURRENT STOCK:", product.stock);
    // console.log("ORDER QUANTITY:", quantity);

    if (!product) {
      throw new Error("Product not found");
    }

    const total_price = product.price * quantity;

    const updatedProduct = await product_model.findOneAndUpdate(
      {
        _id: id,
        stock: { $gte: quantity },
      },
      {
        $inc: { stock: -quantity },
      },
      {
        new: true,
        session,
      },
    );

    if (!updatedProduct) {
      throw new Error("Stock is not available");
    }

    const orderNumber = `ORD-${Date.now()}`;

    const orderData = {
      orderNumber,
      userId,

      products: [
        {
          productId: product._id,
          name: product.productName,
          price: product.price,
          image: product.productImage,
          quantity,
          total: total_price,
        },
      ],

      subtotal: total_price,
      taxAmount: 0,
      grandTotal: total_price,

      orderStatus: "Pending",

      statusHistory: [
        {
          status: "Pending",
          updatedBy: userId,
          note: "Order successfully placed",
        },
      ],
    };

    // console.log("Order Data:", orderData);

    const [result] = await order_model.create([orderData], { session });

    await session.commitTransaction();

    try {
      await SendOrderEmail(user.email, result, user);
      console.log("email sended");
    } catch (error) {
      console.log("Order Email Error:", error.message);
    }

    // New Order Notification
    await SendNotification(
      "order",
      `New order ${result.orderNumber} has been received`,
      "New Order",
    );
    // Stock Out Notification + Email
    if (updatedProduct.stock === 0 && product.stock > 0) {
      await SendNotification(
        "stockout",
        `${product.productName} is out of stock`,
        "Stock Out",
      );

      try {
        await SendLowStockEmail(updatedProduct);
        console.log("Stock Out Email sent to admin");
      } catch (error) {
        console.log("Stock Out Email Error:", error.message);
      }
    }

    // Low Stock Notification + Email
    else if (updatedProduct.stock <= 5 && product.stock > 5) {
      await SendNotification(
        "lowstock",
        `${product.productName} has only ${updatedProduct.stock} items left`,
        "Low Stock",
      );

      try {
        await SendLowStockEmail(updatedProduct);
        console.log("Low Stock Email sent to admin");
      } catch (error) {
        console.log("Low Stock Email Error:", error.message);
      }
    }
    return result;

    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function getmyorders() {
  const result = await order_model.find().sort({ createdAt: -1 });

  return result;
}

export async function GstSingleOrder(orderid, userid) {
  const result = await order_model.findOne({
    _id: orderid,
    userId: userid,
  });

  if (!result) {
    throw new Error("Order not found");
  }
  return result;
}

export async function updateorderstatus(orderid, status, adminId) {
  const oldOrder = await order_model.findById(orderid);

  if (!oldOrder) {
    throw new Error("Order not found");
  }

  const oldStatus = oldOrder.orderStatus;
  const user = await loginmodel.findById(oldOrder.userId);

  const result = await order_model.findByIdAndUpdate(
    orderid,
    {
      $set: {
        orderStatus: status,
      },
      $push: {
        statusHistory: {
          status: status,
          updatedBy: adminId,
          note: `Order status updated to ${status}`,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  // Notification only when status changes
  if (oldStatus !== status) {
    await SendNotification(
      "order",
      `Order ${result.orderNumber} status changed from ${oldStatus} to ${status}`,
      `Order ${status}`,
    );
  }

  try {
    await SendOrderStatusEmail(user.email, result, user, oldStatus);

    console.log("email sended");
  } catch (error) {
    console.log("Order Email Error:", error.message);
  }

  return result;
}

export async function GetAllOderByadmin() {
  const result = await order_model.find().sort({ createdAt: -1 });

  return result;
}

export async function CancelRequest(userid, orderid, reason) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await loginmodel.findById(userid);

    if (!user) {
      throw new Error("User not found");
    }

    // Step 1: Check order
    const order = await order_model
      .findOne({
        _id: orderid,
        userId: userid,
      })
      .session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    // Step 2: Check cancellation reason
    if (!reason || !reason.trim()) {
      throw new Error("Cancellation reason is required");
    }

    // Step 3: Check order status
    const notAllowedStatus = ["Out for Delivery", "Delivered"];

    if (notAllowedStatus.includes(order.orderStatus)) {
      throw new Error("This order cannot be cancelled");
    }

    // Step 4: Restore product stock
    for (const item of order.products) {
      const updatedProduct = await product_model.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
          returnDocument: "after",
        },
      );

      if (!updatedProduct) {
        throw new Error("Product not found during stock restoration");
      }
    }

    // Step 5: Update order status
    const result = await order_model.findByIdAndUpdate(
      orderid,
      {
        $set: {
          orderStatus: "Cancelled",
          cancellation: {
            requested: true,
            reason: reason.trim(),
            status: "Cancelled",
            requestedAt: new Date(),
          },
          stockRestored: true,
        },
        $push: {
          statusHistory: {
            status: "Cancelled",
            updatedBy: userid,
            note: "Order cancelled by customer",
          },
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    );

    // Step 6: Commit transaction
    await session.commitTransaction();

    // Step 7: Send cancellation email
    try {
      await SendCancellationEmail(user.email, result, user, reason);

      console.log("Cancellation Email Sent");
    } catch (error) {
      console.log("Order Email Error:", error.message);
    }

    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function Aproved_Request(orderid, adminid) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await order_model.findOneAndUpdate(
      {
        _id: orderid,
        "cancellation.status": "Pending",
        stockRestored: false,
        orderStatus: { $nin: ["Delivered", "Cancelled"] },
      },
      {
        $set: {
          orderStatus: "Cancelled",
          "cancellation.status": "Approved",
          "cancellation.reviewedAt": new Date(),
          "cancellation.reviewedBy": adminid,
          stockRestored: true,
        },
        $push: {
          statusHistory: {
            status: "Cancelled",
            updatedBy: adminid,
            note: "Cancellation request approved by admin",
          },
        },
      },
      {
        returnDocument: "after",
        session,
      },
    );

    if (!result) {
      throw new Error("Order not found or cancellation already processed");
    }

    const updatedproducts = [];
    // Step 2: Restore stock
    for (const item of result.products) {
      console.log("Order ID:", orderid);
      console.log("Admin ID:", adminid);
      console.log("Product Model:", product_model.modelName);
      const updatedProduct = await product_model.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        { session, new: true },
      );

      if (!updatedProduct) {
        throw new Error("Product not found during stock restoration");
      }

      updatedproducts.push({
        product_id: updatedProduct._id,
        stock: updatedProduct.stock,
      });
    }

    // Step 3: Commit transaction
    await session.commitTransaction();

    io.emit("stockupdated", {
      productId: updatedproducts._id,
      stock: updatedproducts.stock,
    });

    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function Rejectcancelrequest(orderid, adminid) {
  try {
    const order = await order_model.findById(orderid);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.cancellation.status !== "Pending") {
      throw new Error("No pending cancellation request");
    }

    const result = await order_model.findByIdAndUpdate(
      orderid,
      {
        $set: {
          "cancellation.status": "Rejected",
          "cancellation.reviewedAt": new Date(),
          "cancellation.reviewedBy": adminid,
        },
      },
      { new: true },
    );

    return result;
  } catch (error) {
    throw error;
  }
}
