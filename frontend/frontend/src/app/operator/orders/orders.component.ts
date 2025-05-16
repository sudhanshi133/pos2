import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../invoice/invoice.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  sellingPrice: number;
  totalPrice: number;
  barcode: string;
  itemId: number;
}

interface Order {
  orderId: number;
  orderTime: string;
  orderItems: OrderItem[];
  totalPrice: number;
  name: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-operator-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ToastComponent,
    NavbarComponent
  ],
  templateUrl: './orders.component.html',
  styles: [`
    .orders-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .orders-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 20px 0;
    }

    .order-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      transition: transform 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .order-info {
      width: 100%;
    }

    .order-id-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .order-id {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .order-date-time {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 8px;
    }

    .order-date {
      color: #666;
      font-size: 1rem;
    }

    .order-time {
      color: #666;
      font-size: 0.9rem;
    }

    .customer-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      margin-top: 10px;
    }

    .customer-name, .customer-phone {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .customer-name i, .customer-phone i {
      color: #1a237e;
      font-size: 16px;
      width: 16px;
      text-align: center;
    }

    .customer-name span, .customer-phone span {
      color: #333;
      font-weight: 500;
    }

    .order-total {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      margin-top: 8px;
    }

    .total-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .total-amount {
      font-size: 20px;
      font-weight: 700;
      color: #1a237e;
    }

    .order-items {
      margin: 15px 0;
      flex-grow: 1;
      overflow-y: auto;
      max-height: 200px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px dashed #eee;
    }

    .item-row:last-child {
      border-bottom: none;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
      font-size: 1.1rem;
    }

    .item-quantity, .item-price, .item-barcode {
      color: #666;
      font-size: 0.9rem;
    }

    .item-barcode {
      color: #888;
      font-size: 0.85rem;
    }

    .item-total {
      font-weight: 600;
      color: #2c5282;
    }

    .order-actions {
      margin-top: auto;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .button-group {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .action-button {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
    }

    .action-button::before {
      content: attr(title);
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      padding: 5px 10px;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 12px;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .action-button::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .action-button:hover::before,
    .action-button:hover::after {
      opacity: 1;
      visibility: visible;
    }

    .action-button i {
      font-size: 18px;
    }

    .view-details-button {
      background-color: #e8eaf6;
      color: #1a237e;
    }

    .view-details-button:hover {
      background-color: #c5cae9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.15);
    }

    .download-button {
      background-color: #e8f5e9;
      color: #1b5e20;
    }

    .download-button:hover {
      background-color: #c8e6c9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(27, 94, 32, 0.15);
    }

    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      flex: 1;
    }

    .order-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .order-header-row h3 {
      margin: 0;
      color: #1a237e;
      font-size: 1.5rem;
    }

    .order-date-time {
      color: #666;
      font-size: 1rem;
      white-space: nowrap;
    }

    .order-total-large {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1a237e;
    }

    .close-button {
      background: none;
      border: 2px solid #dc3545;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 20px;
      color: #dc3545;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      padding: 0;
      line-height: 1;
    }

    .close-button:hover {
      background-color: #dc3545;
      color: white;
    }

    .modal-body {
      padding: 20px;
    }

    .order-items-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .price-total {
      font-weight: 600;
      color: #1a237e;
      font-size: 1.1rem;
    }

    .customer-info {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .customer-info h4 {
      color: #1a237e;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #e0e0e0;
    }

    .customer-details-grid {
      display: grid;
      gap: 16px;
    }

    .customer-detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .customer-detail-item i {
      font-size: 1.4rem;
      color: #1a237e;
      width: 24px;
      text-align: center;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
      min-width: 120px;
    }

    .detail-value {
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .order-items-section {
      margin-top: 24px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .order-items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    .order-items-table th {
      background-color: #f8f9fa;
      color: #1a237e;
      font-weight: 600;
      text-align: left;
      padding: 12px 16px;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }

    .order-items-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
    }

    .order-items-table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .order-items-table tfoot tr {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    .order-items-table tfoot td {
      border-bottom: none;
      padding: 16px;
    }

    .modal-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }

    .close-modal-button {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-modal-button:hover {
      background-color: #c82333;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
    }

    /* Column widths */
    .product-col {
      width: 30%;
    }

    .barcode-col {
      width: 20%;
    }

    .quantity-col {
      width: 15%;
      text-align: center;
    }

    .price-col {
      width: 17.5%;
      text-align: right;
    }

    .subtotal-col {
      width: 17.5%;
      text-align: right;
    }

    /* Pagination Styles */
    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
      padding: 15px;
      background: #1a237e;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
    }

    .pagination-info {
      font-size: 1.1rem;
      color: white;
      font-weight: 500;
    }

    .pagination-buttons {
      display: flex;
      gap: 10px;
    }

    .pagination-button {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .pagination-button:hover:not([disabled]) {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .pagination-button:disabled {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.3);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .pagination-button i {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .orders-grid {
        grid-template-columns: 1fr;
      }

      .order-card {
        padding: 15px;
        gap: 12px;
      }

      .order-header {
        padding-bottom: 12px;
      }

      .order-id {
        font-size: 16px;
      }

      .order-time {
        font-size: 13px;
      }

      .customer-details {
        padding: 10px;
        margin-top: 8px;
      }

      .customer-name, .customer-phone {
        font-size: 13px;
      }

      .action-button {
        width: 36px;
        height: 36px;
      }

      .action-button i {
        font-size: 16px;
      }

      .modal-content {
        width: 95%;
        margin: 10px;
      }

      .order-items-table {
        margin: 0 -20px;
        width: calc(100% + 40px);
      }

      .order-items-table table {
        min-width: 600px;
      }

      .order-items-table th,
      .order-items-table td {
        padding: 10px;
        font-size: 13px;
      }

      .pagination {
        padding: 10px;
        margin-top: 20px;
      }

      .pagination-button {
        width: 36px;
        height: 36px;
      }

      .pagination-info {
        font-size: 1rem;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  totalOrders = 0;

  constructor(
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    console.log('OrdersComponent initialized');
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;
    console.log('Loading orders for page:', this.currentPage);

    this.orderService.getAllOrders(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Received response:', JSON.stringify(response, null, 2));
        this.orders = response.orders;
        this.totalOrders = response.totalElements;
        this.totalPages = response.totalPages;
        
        console.log('Updated component state:', {
          orders: this.orders,
          totalOrders: this.totalOrders,
          totalPages: this.totalPages,
          currentPage: this.currentPage,
          itemsInCurrentPage: this.orders.length
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  nextPage() {
    console.log('Next page clicked - START');
    console.log('Current page before increment:', this.currentPage);
    console.log('Total pages:', this.totalPages);
    console.log('Items in current page:', this.orders.length);
    
    // If we have exactly 10 items, there might be more pages
    if (this.orders.length === 10) {
      this.currentPage++;
      console.log('Current page after increment:', this.currentPage);
      this.loadOrders();
    } else {
      console.log('Cannot move to next page - already at last page');
      this.toastService.show('You are already on the last page', 'info');
    }
    console.log('Next page clicked - END');
  }

  previousPage() {
    console.log('Previous page clicked');
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('Moving to previous page:', this.currentPage);
      this.loadOrders();
    } else {
      console.log('Cannot move to previous page - already at first page');
      this.toastService.show('You are already on the first page', 'info');
    }
  }

  viewOrderDetails(order: Order) {
    console.log('Selected Order:', order);
    console.log('Order Items:', order.orderItems);
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

  downloadInvoice(order: Order) {
    try {
      console.log('Downloading invoice for order:', order.orderId);
      
      this.orderService.getInvoice(order.orderId).subscribe({
        next: (blob: Blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          link.download = `order_${order.orderId}.pdf`;
          
          // Append to body, click, and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the URL
          window.URL.revokeObjectURL(url);
          
          console.log('Invoice downloaded successfully');
          this.toastService.show('Invoice downloaded successfully', 'success');
        },
        error: (error) => {
          console.error('Error downloading invoice:', error);
          this.toastService.show('Failed to download invoice. Please try again.', 'error');
        }
      });
    } catch (error) {
      console.error('Error in downloadInvoice:', error);
      this.toastService.show('Failed to download invoice. Please try again.', 'error');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    if (!amount || isNaN(amount)) {
      return '₹0.00';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
} 