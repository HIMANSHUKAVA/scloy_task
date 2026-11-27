import transport from "../config/Mailsend.js";

export async function SendOrderEmail(to, order, user) {
  const result = await transport.sendMail({
    from: `"Smart Order Management" <${process.env.APP_EMAIL}>`,
    to: to,
    subject: `Order Confirmed! #${order.orderNumber}`,

    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>

        <body style="margin:0; padding:0; background:#f4f6fa; font-family:Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0"
                style="padding:35px 10px; background:#f4f6fa;">

                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                            style="max-width:600px; width:100%; background:#ffffff;
                            border-radius:12px; overflow:hidden;">

                            <!-- Header -->
                            <tr>
                                <td style="background:#4f46e5; padding:28px;
                                text-align:center; color:white;">

                                    <h1 style="margin:0; font-size:25px;">
                                        Smart Order
                                    </h1>

                                    <p style="margin:8px 0 0; font-size:13px;">
                                        Order Management System
                                    </p>

                                </td>
                            </tr>

                            <!-- Success Message -->
                            <tr>
                                <td style="padding:35px 30px 15px; text-align:center;">

                                    <div style="font-size:48px; color:#16a34a;">
                                        ✓
                                    </div>

                                    <h2 style="color:#111827; margin:12px 0;">
                                        Order Placed Successfully!
                                    </h2>

                                    <p style="color:#6b7280; font-size:14px;
                                    line-height:1.6;">
                                        Hi ${user.name || "Customer"},
                                        thank you for shopping with us.
                                        Your order has been received successfully.
                                    </p>

                                </td>
                            </tr>

                            <!-- Order Details -->
                            <tr>
                                <td style="padding:15px 30px;">

                                    <table width="100%" cellpadding="12"
                                        style="background:#f9fafb; border-radius:8px;
                                        border:1px solid #e5e7eb;">

                                        <tr>
                                            <td style="color:#6b7280; font-size:13px;">
                                                Order Number
                                            </td>

                                            <td align="right"
                                                style="font-weight:bold; color:#111827;">
                                                #${order.orderNumber}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280; font-size:13px;">
                                                Order Date
                                            </td>

                                            <td align="right"
                                                style="color:#111827;">
                                                ${new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280; font-size:13px;">
                                                Payment Status
                                            </td>

                                            <td align="right"
                                                style="color:#16a34a; font-weight:bold;">
                                                ${order.paymentStatus || "Pending"}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280; font-size:13px;">
                                                Order Status
                                            </td>

                                            <td align="right"
                                                style="color:#4f46e5; font-weight:bold;">
                                                ${order.orderStatus || "Processing"}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td colspan="2"
                                                style="border-top:1px solid #e5e7eb;
                                                padding-top:18px;">

                                                <table width="100%">
                                                    <tr>
                                                        <td style="font-size:15px;
                                                        font-weight:bold; color:#111827;">
                                                            Total Amount
                                                        </td>

                                                        <td align="right"
                                                            style="font-size:20px;
                                                            font-weight:bold; color:#4f46e5;">
                                                            ₹${order.grandTotal}
                                                        </td>
                                                    </tr>
                                                </table>

                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>

                            <!-- Footer Message -->
                            <tr>
                                <td style="padding:20px 30px 30px; text-align:center;">

                                    <p style="font-size:14px; color:#374151;
                                    line-height:1.6;">
                                        We are preparing your order.
                                        You will receive updates when your
                                        order status changes.
                                    </p>

                                    <p style="font-size:13px; color:#9ca3af;
                                    margin-top:25px;">
                                        Thank you for choosing Smart Order!
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background:#f9fafb; padding:18px;
                                text-align:center; border-top:1px solid #e5e7eb;">

                                    <p style="margin:0; font-size:12px;
                                    color:#9ca3af;">
                                        © ${new Date().getFullYear()} Smart Order Management.
                                        All rights reserved.
                                    </p>

                                    <p style="margin:7px 0 0; font-size:11px;
                                    color:#9ca3af;">
                                        This is an automated email. Please do not reply.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `,
  });

  return result;
}
export async function SendOrderStatusEmail(to, order, user, oldStatus) {
  const statusColors = {
    Pending: "#f59e0b",
    Processing: "#2563eb",
    Shipped: "#7c3aed",
    Delivered: "#16a34a",
    Cancelled: "#dc2626",
  };

  const statusColor = statusColors[order.orderStatus] || "#4f46e5";

  const result = await transport.sendMail({
    from: `"Smart Order Management" <${process.env.APP_EMAIL}>`,
    to: to,
    subject: `Order Status Updated - #${order.orderNumber}`,

    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>

        <body style="margin:0; padding:0; background:#f4f6fa;
        font-family:Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0"
                style="padding:35px 10px; background:#f4f6fa;">

                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                            style="max-width:600px; width:100%;
                            background:#ffffff; border-radius:12px;
                            overflow:hidden;">

                            <!-- Header -->
                            <tr>
                                <td style="background:#4f46e5; padding:28px;
                                text-align:center; color:white;">

                                    <h1 style="margin:0; font-size:25px;">
                                        Smart Order
                                    </h1>

                                    <p style="margin:8px 0 0; font-size:13px;">
                                        Order Management System
                                    </p>

                                </td>
                            </tr>

                            <!-- Main Content -->
                            <tr>
                                <td style="padding:35px 30px 15px;
                                text-align:center;">

                                    <div style="font-size:45px; color:#4f46e5;">
                                        ↻
                                    </div>

                                    <h2 style="color:#111827; margin:12px 0;">
                                        Order Status Updated!
                                    </h2>

                                    <p style="color:#6b7280; font-size:14px;
                                    line-height:1.6;">
                                        Hi ${user.name || "Customer"},
                                        your order status has been updated.
                                        Here are your latest order details.
                                    </p>

                                </td>
                            </tr>

                            <!-- Order Number -->
                            <tr>
                                <td style="padding:15px 30px;">

                                    <div style="background:#f9fafb;
                                    border:1px solid #e5e7eb;
                                    border-radius:8px; padding:18px;
                                    text-align:center;">

                                        <p style="margin:0; color:#6b7280;
                                        font-size:12px;">
                                            ORDER NUMBER
                                        </p>

                                        <h2 style="margin:8px 0 0;
                                        color:#111827; font-size:21px;">
                                            #${order.orderNumber}
                                        </h2>

                                    </div>

                                </td>
                            </tr>

                            <!-- Status Change -->
                            <tr>
                                <td style="padding:15px 30px;">

                                    <h3 style="font-size:16px;
                                    color:#111827; margin-bottom:20px;">
                                        Current Order Status
                                    </h3>

                                    <table width="100%" cellpadding="10">
                                        <tr>

                                            <td width="42%" align="center"
                                                style="background:#f3f4f6;
                                                border-radius:8px;">

                                                <p style="margin:0;
                                                font-size:11px; color:#6b7280;">
                                                    Previous Status
                                                </p>

                                                <p style="margin:8px 0 0;
                                                color:#374151; font-weight:bold;">
                                                    ${oldStatus}
                                                </p>

                                            </td>

                                            <td width="16%" align="center"
                                                style="font-size:22px;
                                                color:#9ca3af;">
                                                →
                                            </td>

                                            <td width="42%" align="center"
                                                style="background:#f0fdf4;
                                                border-radius:8px;">

                                                <p style="margin:0;
                                                font-size:11px; color:#6b7280;">
                                                    New Status
                                                </p>

                                                <p style="margin:8px 0 0;
                                                color:${statusColor};
                                                font-weight:bold;">
                                                    ${order.orderStatus}
                                                </p>

                                            </td>

                                        </tr>
                                    </table>

                                </td>
                            </tr>

                            <!-- Order Details -->
                            <tr>
                                <td style="padding:15px 30px;">

                                    <table width="100%" cellpadding="12"
                                        style="background:#f9fafb;
                                        border-radius:8px;
                                        border:1px solid #e5e7eb;">

                                        <tr>
                                            <td style="color:#6b7280;
                                            font-size:13px;">
                                                Order Date
                                            </td>

                                            <td align="right"
                                                style="color:#111827;">
                                                ${new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280;
                                            font-size:13px;">
                                                Total Amount
                                            </td>

                                            <td align="right"
                                                style="font-size:17px;
                                                font-weight:bold;
                                                color:#4f46e5;">
                                                ₹${order.grandTotal}
                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>

                            <!-- Footer Message -->
                            <tr>
                                <td style="padding:20px 30px 30px;
                                text-align:center;">

                                    <p style="font-size:14px;
                                    color:#374151; line-height:1.6;">
                                        Thank you for shopping with us.
                                        We will keep you informed about
                                        your order journey.
                                    </p>

                                    <p style="font-size:13px;
                                    color:#9ca3af; margin-top:25px;">
                                        Thank you for choosing Smart Order!
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background:#f9fafb;
                                padding:18px; text-align:center;
                                border-top:1px solid #e5e7eb;">

                                    <p style="margin:0; font-size:12px;
                                    color:#9ca3af;">
                                        © ${new Date().getFullYear()}
                                        Smart Order Management.
                                        All rights reserved.
                                    </p>

                                    <p style="margin:7px 0 0;
                                    font-size:11px; color:#9ca3af;">
                                        This is an automated email.
                                        Please do not reply.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `,
  });

  return result;
}

export async function SendCancellationEmail(to, order, user, decision) {
  const isApproved = decision === "Approved";

  const decisionColor = isApproved ? "#16a34a" : "#dc2626";

  // const decisionMessage = isApproved
  //     ? "Your order cancellation request has been approved by our Admin."
  //     : "Your order cancellation request has been rejected by our Admin.";

  const updatedStatus = order.orderStatus;

  const result = await transport.sendMail({
    from: `"Smart Order Management" <${process.env.APP_EMAIL}>`,
    to: to,

    subject: `Cancellation ${decision} - Order #${order.orderNumber}`,

    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>

        <body style="margin:0; padding:0; background:#f4f6fa;
        font-family:Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0"
                style="padding:35px 10px; background:#f4f6fa;">

                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                            style="max-width:600px; width:100%;
                            background:#ffffff; border-radius:12px;
                            overflow:hidden;">

                            <!-- Header -->
                            <tr>
                                <td style="background:#4f46e5;
                                padding:28px; text-align:center;
                                color:white;">

                                    <h1 style="margin:0; font-size:25px;">
                                        Smart Order
                                    </h1>

                                    <p style="margin:8px 0 0; font-size:13px;">
                                        Order Management System
                                    </p>

                                </td>
                            </tr>

                            <!-- Main Content -->
                            <tr>
                                <td style="padding:35px 30px 15px;
                                text-align:center;">

                                    <div style="font-size:45px;
                                    color:${decisionColor};">
                                        ${isApproved ? "✓" : "!"}
                                    </div>

                                    <h2 style="color:#111827;
                                    margin:12px 0;">
                                        Cancellation Request approved
                                    </h2>

                                    <p style="color:#6b7280;
                                    font-size:14px; line-height:1.7;">
                                        Hi ${user.username || "Customer"},
                                        approved
                                    </p>

                                </td>
                            </tr>

                            <!-- Decision -->
                            <tr>
                                <td style="padding:15px 30px;">

                                    <div style="background:#f9fafb;
                                    border:1px solid #e5e7eb;
                                    border-radius:8px; padding:20px;
                                    text-align:center;">

                                        <p style="margin:0;
                                        color:#6b7280; font-size:12px;">
                                            CANCELLATION DECISION
                                        </p>

                                        <h2 style="margin:10px 0 0;
                                        color:${decisionColor};
                                        font-size:22px;">
                                            ${decision.toUpperCase()}
                                        </h2>

                                    </div>

                                </td>
                            </tr>

                            <!-- Order Details -->
                            <tr>
                                <td style="padding:15px 30px;">

                                    <h3 style="color:#111827;
                                    font-size:16px;">
                                        Order Details
                                    </h3>

                                    <table width="100%" cellpadding="12"
                                        style="background:#f9fafb;
                                        border-radius:8px;
                                        border:1px solid #e5e7eb;">

                                        <tr>
                                            <td style="color:#6b7280;
                                            font-size:13px;">
                                                Order Number
                                            </td>

                                            <td align="right"
                                                style="font-weight:bold;
                                                color:#111827;">
                                                #${order.orderNumber}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280;
                                            font-size:13px;">
                                                Cancellation Decision
                                            </td>

                                            <td align="right"
                                                style="font-weight:bold;
                                                color:${decisionColor};">
                                                ${decision}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280;
                                            font-size:13px;">
                                                Updated Order Status
                                            </td>

                                            <td align="right"
                                                style="font-weight:bold;
                                                color:#111827;">
                                                ${updatedStatus}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="color:#6b7280;
                                            font-size:13px;">
                                                Total Amount
                                            </td>

                                            <td align="right"
                                                style="font-weight:bold;
                                                color:#4f46e5;">
                                                ₹${order.grandTotal}
                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>

                            <!-- Additional Message -->
                            <tr>
                                <td style="padding:20px 30px 30px;
                                text-align:center;">

                                    <p style="font-size:14px;
                                    color:#374151; line-height:1.7;">
                                        ${
                                          isApproved
                                            ? "Your order has been cancelled successfully. If you have any questions, please contact our support team."
                                            : "Your order remains active and will continue with its updated status. Please contact our support team if you need assistance."
                                        }
                                    </p>

                                    <p style="font-size:13px;
                                    color:#9ca3af; margin-top:25px;">
                                        Thank you for choosing Smart Order!
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background:#f9fafb;
                                padding:18px; text-align:center;
                                border-top:1px solid #e5e7eb;">

                                    <p style="margin:0; font-size:12px;
                                    color:#9ca3af;">
                                        © ${new Date().getFullYear()}
                                        Smart Order Management.
                                        All rights reserved.
                                    </p>

                                    <p style="margin:7px 0 0;
                                    font-size:11px; color:#9ca3af;">
                                        This is an automated email.
                                        Please do not reply.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `,
  });

  return result;
}

export async function SendLowStockEmail(product) {
  console.log("SENDER:", process.env.APP_EMAIL);
  console.log("ADMIN:", process.env.ADMIN_EMAIL);
  const info = await transport.sendMail({
    from: process.env.APP_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `Low Stock Alert - ${product.productName}`,

    html: `
      <div style="font-family: Arial, sans-serif; background: #f4f4f7; padding: 30px;">

        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden;">

          <div style="background: #dc2626; color: white; padding: 25px; text-align: center;">
            <h1 style="margin: 0;">Low Stock Alert!</h1>
            <p style="margin-bottom: 0;">Smart Order Management System</p>
          </div>

          <div style="padding: 30px;">

            <h2 style="color: #333;">Hello Admin,</h2>

            <p style="color: #555; line-height: 1.6;">
              This is an automated notification that one of your products
              has reached the low stock level.
            </p>

            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">
                Stock Warning
              </h3>

              <p><strong>Product Name:</strong> ${product.productName}</p>
              <p><strong>Product ID:</strong> ${product._id}</p>
              <p><strong>Available Stock:</strong> ${product.stock}</p>
              <p><strong>Minimum Stock Level:</strong> 5</p>
            </div>

            <p style="color: #555; line-height: 1.6;">
              Please restock this product as soon as possible
              to avoid order interruptions.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <span style="background: #dc2626; color: white; padding: 12px 25px; border-radius: 6px;">
                Action Required: Restock Product
              </span>
            </div>

          </div>

          <div style="background: #f9fafb; padding: 15px; text-align: center; color: #888; font-size: 12px;">
            <p>Smart Order Management System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>

        </div>
      </div>
    `,
  });
  console.log("MESSAGE ID:", info.messageId);
  console.log("ACCEPTED:", info.accepted);
  console.log("REJECTED:", info.rejected);
}
