import jsPDF from 'jspdf';
import { LaundryOrder } from '../types';

export function downloadLaundryReceiptPdf(order: LaundryOrder): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 190], // Thermal receipt voucher aspect ratio (80mm width)
  });

  const pageWidth = 80;
  let y = 10;

  // Header background accent
  doc.setFillColor(140, 88, 40); // #8C5828 Cognac
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Institution Title
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text('REALM OF HOSTELS', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(115, 115, 115);
  doc.text('CAMPUS LAUNDRY & DRY CLEAN DEPOT', pageWidth / 2, y, { align: 'center' });

  y += 4;
  doc.text('ROYAL PARADISE STUDENT HOSTEL', pageWidth / 2, y, { align: 'center' });

  y += 5;
  // Divider line (dashed)
  doc.setLineDashPattern([1, 1], 0);
  doc.setDrawColor(180, 180, 180);
  doc.line(5, y, pageWidth - 5, y);

  // Voucher details
  y += 6;
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 88, 40);
  doc.text(`RECEIPT: ${order.receiptNumber}`, pageWidth / 2, y, { align: 'center' });

  y += 4.5;
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(28, 25, 23);
  doc.text(`TOKEN PIN: ${order.tokenPin}`, pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setLineDashPattern([1, 1], 0);
  doc.line(5, y, pageWidth - 5, y);

  // Key-value pairs
  y += 6;
  doc.setFontSize(7.5);

  const printRow = (label: string, value: string) => {
    doc.setFont('courier', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(label, 7, y);
    doc.setFont('courier', 'bold');
    doc.setTextColor(28, 25, 23);
    doc.text(value, pageWidth - 7, y, { align: 'right' });
    y += 4.5;
  };

  printRow('DATE & TIME:', order.createdAt);
  printRow('STUDENT:', order.studentName);
  printRow('ROOM:', order.roomNumber);
  printRow('MOBILE:', order.mobileNumber);
  printRow('TOTAL PIECES:', `${order.clothCount} Clothes`);
  printRow('STATUS:', order.status.toUpperCase());
  printRow('DELIVERY BY:', order.expectedDelivery);

  if (order.clothBreakdown && order.clothBreakdown.length > 0) {
    y += 2;
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(140, 88, 40);
    doc.text('ITEMIZED BREAKDOWN:', 7, y);
    y += 4;
    order.clothBreakdown.forEach((item) => {
      doc.setFont('courier', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`- ${item.type}:`, 9, y);
      doc.text(`${item.count}`, pageWidth - 9, y, { align: 'right' });
      y += 3.8;
    });
  }

  if (order.specialInstructions) {
    y += 2;
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(90, 90, 90);
    doc.text(`Note: ${order.specialInstructions.slice(0, 45)}`, 7, y);
    y += 4.5;
  }

  // Barcode representation
  y += 4;
  doc.setLineDashPattern([1, 1], 0);
  doc.line(5, y, pageWidth - 5, y);

  y += 6;
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`|||||| ||||| |||| |||||| |||||`, pageWidth / 2, y, { align: 'center' });

  y += 4;
  doc.setFontSize(6.5);
  doc.text(order.receiptNumber, pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(120, 120, 120);
  doc.text('Show this receipt & token PIN at laundry desk.', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Royal Paradise Laundry Depot · Timings 08:00 - 20:00', pageWidth / 2, y, { align: 'center' });

  // Save the PDF
  doc.save(`Laundry_Receipt_${order.receiptNumber}.pdf`);
}
