import order_model from "../Model/OrdersModel.js";
import loginmodel from "../Model/LoginModel.js";
export async function GenretInvoice(orderid, userid) {
  try {
    const filter = userid
      ? {
          _id: orderid,
          userId: userid,
        }
      : { _id: orderid };

    // Step 1: Find Order
    const order = await order_model.findOne(filter);

    if (!order) {
      throw new Error("Order not found");
    }

    const user = await loginmodel.findById(order.userId);

    if (!user) {
      throw new Error("this order user not found");
    }

    // Step 2: Create Invoice Object
    const invoiceData = {
      company: {
        name: "Smart Order Management",
        address: "Bhavnagar, Gujarat, India",
        email: "kavahimanshi@gmail.com",
        phone: "+91 9601972547",
      },

      invoice: {
        invoiceNumber: `INV-${order.orderNumber}`,
        invoiceDate: new Date(),
      },

      customer: {
        name: user.username || "Customer",
        email: user.email || "",
      },

      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        orderStatus: order.orderStatus,

        products: order.products.map((item) => ({
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),

        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        grandTotal: order.grandTotal,
      },
    };

    return invoiceData;
  } catch (error) {
    throw error;
  }
}
