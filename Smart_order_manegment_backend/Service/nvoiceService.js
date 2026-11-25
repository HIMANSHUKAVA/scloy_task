
import PDFDocument from "pdfkit";

export function InvoiceGenretpdf(invoiceData, res) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    bufferPages: true
  });

  // PDF directly response mein send hoga
  doc.pipe(res);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const blue = "#243B78";
  const lightBlue = "#EEF2FF";
  const dark = "#222222";
  const grey = "#666666";
  const lightGrey = "#F5F6FA";

  const company = invoiceData.company;
  const invoice = invoiceData.invoice;
  const customer = invoiceData.customer;
  const order = invoiceData.order;

  // Currency format
  const currency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Date format
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Draw horizontal line
  const drawLine = (y) => {
    doc
      .moveTo(margin, y)
      .lineTo(pageWidth - margin, y)
      .lineWidth(1)
      .strokeColor("#D9DDE7")
      .stroke();
  };

  // =========================
  // HEADER
  // =========================

  doc
    .roundedRect(margin, 35, contentWidth, 112, 10)
    .fill(blue);

  // Company name
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(company.name, margin + 20, 55, {
      width: 300
    });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#E1E8FF")
    .text(company.address, margin + 20, 88);

  doc.text(company.email, margin + 20, 105);

  if (company.phone) {
    doc.text(company.phone, margin + 20, 120);
  }

  // Invoice title
  doc
    .font("Helvetica-Bold")
    .fontSize(27)
    .fillColor("#FFFFFF")
    .text("INVOICE", 390, 55, {
      width: 145,
      align: "right"
    });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#E1E8FF")
    .text(`Invoice No: ${invoice.invoiceNumber}`, 340, 95, {
      width: 195,
      align: "right"
    });

  // =========================
  // INVOICE DETAILS
  // =========================

  let y = 170;

  // Customer card
  doc
    .roundedRect(margin, y, 245, 120, 8)
    .fill(lightGrey);

  doc
    .fillColor(blue)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("BILL TO", margin + 15, y + 15);

  doc
    .fillColor(dark)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(customer.name || "Customer", margin + 15, y + 42, {
      width: 215
    });

  doc
    .fillColor(grey)
    .font("Helvetica")
    .fontSize(10)
    .text(customer.email || "-", margin + 15, y + 65, {
      width: 215
    });

  if (customer.phone) {
    doc.text(customer.phone, margin + 15, y + 83);
  }

  // Invoice information card
  const rightX = 310;

  doc
    .roundedRect(rightX, y, 245, 120, 8)
    .fill(lightBlue);

  doc
    .fillColor(blue)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("INVOICE DETAILS", rightX + 15, y + 15);

  doc
    .fillColor(dark)
    .font("Helvetica")
    .fontSize(10);

  doc.text(`Invoice Date: ${formatDate(invoice.invoiceDate)}`, rightX + 15, y + 43);

  doc.text(`Order No: ${order.orderNumber}`, rightX + 15, y + 63);

  doc.text(`Order Date: ${formatDate(order.orderDate)}`, rightX + 15, y + 83);

  doc.text(`Status: ${order.orderStatus || "-"}`, rightX + 15, y + 103);

  // =========================
  // ORDER SUMMARY
  // =========================

  y = 325;

  doc
    .fillColor(blue)
    .font("Helvetica-Bold")
    .fontSize(15)
    .text("ORDER SUMMARY", margin, y);

  y += 30;

  // Table header
  function drawTableHeader() {
    doc
      .roundedRect(margin, y, contentWidth, 32, 5)
      .fill(blue);

    doc
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(10);

    doc.text("PRODUCT", margin + 12, y + 11);

    doc.text("QTY", 310, y + 11, {
      width: 40,
      align: "center"
    });

    doc.text("PRICE", 365, y + 11, {
      width: 70,
      align: "right"
    });

    doc.text("TOTAL", 455, y + 11, {
      width: 90,
      align: "right"
    });

    y += 32;
  }

  drawTableHeader();

  // =========================
  // PRODUCT ROWS
  // =========================

  const products = order.products || [];

  products.forEach((item, index) => {

    // New page if space is insufficient
    if (y + 45 > pageHeight - 100) {
      doc.addPage();
      y = 50;
      drawTableHeader();
    }

    const rowHeight = 38;

    // Alternate row background
    if (index % 2 === 0) {
      doc
        .rect(margin, y, contentWidth, rowHeight)
        .fill("#F5F6FA");
    }

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(10);

    doc.text(item.productName || "Product", margin + 12, y + 13, {
      width: 245,
      ellipsis: true
    });

    doc.text(String(item.quantity || 0), 310, y + 13, {
      width: 40,
      align: "center"
    });

    doc.text(currency(item.price), 365, y + 13, {
      width: 70,
      align: "right"
    });

    doc.text(currency(item.total), 455, y + 13, {
      width: 90,
      align: "right"
    });

    y += rowHeight;
  });

  // =========================
  // TOTAL SECTION
  // =========================

  y += 25;

  if (y + 140 > pageHeight - 70) {
    doc.addPage();
    y = 60;
  }

  const totalX = 335;
  const totalWidth = 220;

  doc
    .fillColor(grey)
    .font("Helvetica")
    .fontSize(11);

  doc.text("Subtotal", totalX, y);

  doc
    .fillColor(dark)
    .text(currency(order.subtotal), totalX, y, {
      width: totalWidth,
      align: "right"
    });

  y += 25;

  doc
    .fillColor(grey)
    .text("Tax", totalX, y);

  doc
    .fillColor(dark)
    .text(currency(order.taxAmount), totalX, y, {
      width: totalWidth,
      align: "right"
    });

  y += 15;

  drawLine(y + 10);

  y += 25;

  // Grand total background
  doc
    .roundedRect(totalX - 10, y - 5, totalWidth + 10, 42, 6)
    .fill(blue);

  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("GRAND TOTAL", totalX, y + 9);

  doc.text(currency(order.grandTotal), totalX, y + 9, {
    width: totalWidth - 5,
    align: "right"
  });

  y += 75;

  // =========================
  // FOOTER
  // =========================

  if (y + 45 > pageHeight - 35) {
    doc.addPage();
    y = 60;
  }

  drawLine(y);

  y += 18;

  doc
    .fillColor(blue)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Thank you for your order!", margin, y, {
      width: contentWidth,
      align: "center"
    });

  y += 18;

  doc
    .fillColor(grey)
    .font("Helvetica")
    .fontSize(9)
    .text(company.name, margin, y, {
      width: contentWidth,
      align: "center"
    });

  // Generate PDF
  doc.end();
}
