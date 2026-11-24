import mongoose from "mongoose";
import order_model from "../Model/OrdersModel.js";
import product_model from "../Model/ProductModel.js";
import { io } from "../app.js";
export async function createorder(data, userId) {
  const { id, quantity } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid quantity");
    }

    const product = await product_model.findById(id).session(session);

    console.log("PRODUCT ID:", product._id);
    console.log("PRODUCT NAME:", product.productName);
    console.log("CURRENT STOCK:", product.stock);
    console.log("ORDER QUANTITY:", quantity);

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

    console.log("Order Data:", orderData);

    const [result] = await order_model.create([orderData], { session });

    await session.commitTransaction();

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
  const result = await order_model.find();

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

  if (!result) {
    throw new Error("Order not found");
  }

  return result;
}

export async function GetAllOderByadmin() {
  const result = await order_model.find();

  return result;
}

export async function CancelRequest(userid, orderid, reason) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 1: Check order
    const order = await order_model.findOne({
      _id: orderid,
      userId: userid,
    }).session(session);

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
          new: true,
        }
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
        new: true,
        runValidators: true,
        session,
      }
    );

    // Step 6: Commit transaction
    await session.commitTransaction();

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
