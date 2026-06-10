import jsPDF from "jspdf";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.text("BYND BOX", 20, 20);

  doc.setFontSize(11);
  doc.text("Handmade Luxury Products", 20, 28);

  doc.setFontSize(18);
  doc.text("INVOICE", 150, 20);

  doc.setFontSize(11);
  doc.text(`Order No: ${order.orderNumber || order._id}`, 20, 45);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 53);
  doc.text("Payment Status: Paid", 20, 61);

  doc.setFontSize(14);
  doc.text("Customer Details", 20, 78);

  doc.setFontSize(11);
  doc.text(`Name: ${order.deliveryDetails?.fullName || "-"}`, 20, 88);
  doc.text(`Phone: ${order.deliveryDetails?.phone || "-"}`, 20, 96);
  doc.text(`Address: ${order.deliveryDetails?.address || "-"}`, 20, 104);
  doc.text(`City: ${order.deliveryDetails?.city || "-"}`, 20, 112);
  doc.text(`Pincode: ${order.deliveryDetails?.pincode || "-"}`, 20, 120);

  doc.setFontSize(14);
  doc.text("Order Items", 20, 140);

  let y = 152;

  order.items.forEach((item, index) => {
    doc.setFontSize(11);
    doc.text(`${index + 1}. ${item.name}`, 20, y);
    doc.text(`Rs. ${item.price}`, 160, y);

    y += 8;

    item.customizations?.forEach((custom) => {
      doc.setFontSize(9);
      doc.text(`${custom.label}: ${custom.value}`, 28, y);
      y += 6;
    });

    y += 4;
  });

  doc.setFontSize(14);
  doc.text(`Total Amount: Rs. ${order.totalAmount}`, 20, y + 10);

  doc.setFontSize(11);
  doc.text("Thank you for choosing BYND BOX.", 20, y + 28);

  doc.save(`BYND-BOX-Invoice-${order.orderNumber || order._id}.pdf`);
};
