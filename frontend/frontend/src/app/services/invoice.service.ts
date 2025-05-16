import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, OrderItem } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  generateInvoice(order: Order): string {
    const doc = new jsPDF();
    
    // Add company logo and header
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Add company details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Company Name', 20, 30);
    doc.text('123 Business Street', 20, 35);
    doc.text('City, State 12345', 20, 40);
    doc.text('Phone: (123) 456-7890', 20, 45);
    doc.text('Email: contact@company.com', 20, 50);
    
    // Add invoice details
    doc.text(`Invoice #: ${order.id}`, 140, 30);
    doc.text(`Date: ${order.date}`, 140, 35);
    doc.text(`Time: ${order.time}`, 140, 40);
    
    // Add customer details
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Bill To:', 20, 65);
    doc.setFontSize(10);
    doc.text(order.customer || 'N/A', 20, 70);
    doc.text(order.customerEmail || 'N/A', 20, 75);
    doc.text(order.customerPhone || 'N/A', 20, 80);
    
    // Add items table
    autoTable(doc, {
      startY: 90,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: order.items.map(item => [
        item.name || 'N/A',
        item.quantity.toString(),
        `$${item.mrp.toFixed(2)}`,
        `$${item.total.toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      }
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`$${order.subtotal.toFixed(2)}`, 170, finalY);
    doc.text('Tax (10%):', 140, finalY + 5);
    doc.text(`$${order.tax.toFixed(2)}`, 170, finalY + 5);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 140, finalY + 15);
    doc.text(`$${order.total.toFixed(2)}`, 170, finalY + 15);
    
    // Add Most Sold Product section
    const topProductY = finalY + 30;
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Most Sold Product', 20, topProductY);
    
    // Find the most sold product
    const productStats = order.items.reduce((acc: { [key: string]: { quantity: number, total: number, name: string } }, item) => {
      if (!acc[item.barcode]) {
        acc[item.barcode] = { quantity: 0, total: 0, name: item.name || 'N/A' };
      }
      acc[item.barcode].quantity += item.quantity;
      acc[item.barcode].total += item.total;
      return acc;
    }, {});
    
    const mostSoldProduct = Object.entries(productStats)
      .sort(([, a], [, b]) => b.quantity - a.quantity)[0];
    
    if (mostSoldProduct) {
      const [barcode, stats] = mostSoldProduct;
      autoTable(doc, {
        startY: topProductY + 5,
        head: [['Barcode', 'Quantity Sold', 'Total Earnings']],
        body: [[
          barcode,
          stats.quantity.toString(),
          `$${stats.total.toFixed(2)}`
        ]],
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 40, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' }
        }
      });
    }
    
    // Add footer
    const finalTableY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 105, finalTableY, { align: 'center' });
    doc.text('Terms & Conditions: Payment is due within 30 days', 105, finalTableY + 5, { align: 'center' });
    
    return doc.output('datauristring');
  }
} 