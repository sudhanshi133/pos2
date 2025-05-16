import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface InvoiceItem {
  barcode: string;
  name: string;
  quantity: number;
  mrp: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor() {}

  generateInvoicePDF(data: InvoiceData): void {
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.text('POS System Invoice', 15, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Date: ${data.date}`, 15, 35);
    
    // Add customer information
    doc.text('Customer Details:', 15, 50);
    doc.text(`Name: ${data.customerName}`, 15, 60);
    if (data.customerEmail) {
      doc.text(`Email: ${data.customerEmail}`, 15, 70);
    }
    if (data.customerPhone) {
      doc.text(`Phone: ${data.customerPhone}`, 15, 80);
    }
    
    // Add items table
    const tableData = data.items.map(item => [
      item.barcode,
      item.name,
      item.quantity.toString(),
      `₹${item.mrp.toFixed(2)}`,
      `₹${item.total.toFixed(2)}`
    ]);
    
    // Add summary rows
    tableData.push(
      ['', '', '', 'Subtotal:', `₹${data.subtotal.toFixed(2)}`],
      ['', '', '', 'Tax:', `₹${data.tax.toFixed(2)}`],
      ['', '', '', 'Total:', `₹${data.total.toFixed(2)}`]
    );
    
    (doc as any).autoTable({
      startY: 90,
      head: [['Barcode', 'Item', 'Quantity', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] },
      foot: [],
      didDrawPage: (data: any) => {
        // Add footer on each page
        doc.setFontSize(10);
        doc.text('Thank you for your business!', 15, doc.internal.pageSize.height - 10);
      }
    });

    // Save the PDF directly
    doc.save(`invoice-${data.date}.pdf`);
  }
} 