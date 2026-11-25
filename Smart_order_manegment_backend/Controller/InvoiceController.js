import { InvoiceGenretpdf } from "../Service/nvoiceService.js";
import { GenretInvoice } from "../Model_API/Invoice.js";

export async function pdfcontroller(req, resp) {
  try {
    const userid = req.user.user_id;
    const id = req.params.id;
    let invoice_deta = undefined;

    if (req.user.role === "User") {
      invoice_deta = await GenretInvoice(id, userid);

      if (!invoice_deta) {
        return resp.status(404).json({
          message: "Order Not FOund",
        });
      }
    } else if (req.user.role === "Admin") {
      invoice_deta = await GenretInvoice(id);
      if (!invoice_deta) {
        return resp.status(404).json({
          message: "Order Not FOund",
        });
      }
    } else {
      return resp.status(403).json({
        message: "Access Denied",
      });
    }
    resp.set("Content-Type", "application/pdf");
    resp.set("Content-Disposition", 'attachment; filename="invoice.pdf"');

    await InvoiceGenretpdf(invoice_deta, resp);
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}
