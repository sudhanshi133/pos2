import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ToastService } from '../../services/toast.service';
import { OrderService, Order, OrderListData, CreateOrderDto } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ViewOrderPopupComponent } from '../../components/view-order-popup/view-order-popup.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    ToastComponent,
    ViewOrderPopupComponent
  ],
  templateUrl: './orders.component.html',
  styles: [`
    .orders-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #f0f2f5;
    }

    .header h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.8rem;
      font-weight: 600;
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
      border-radius: 16px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      padding: 24px;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
      border-radius: 16px 16px 0 0;
      display: flex;
      justify-content: center;
    }

    .modal-title {
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }

    .modal-title h2 {
      margin: 0;
      color: #1a237e;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .modal-subtitle {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    .modal-body {
      padding: 24px;
    }

    .order-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f2f5;
    }

    .section-header i {
      font-size: 1.4rem;
      color: #1a237e;
    }

    .section-header h3 {
      margin: 0;
      color: #1a237e;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      color: #333;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .required {
      color: #dc3545;
      margin-left: 4px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper i {
      position: absolute;
      left: 12px;
      color: #666;
      font-size: 1.1rem;
    }

    .input-wrapper input,
    .input-wrapper select {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .input-wrapper input:focus,
    .input-wrapper select:focus {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
      outline: none;
    }

    .input-wrapper input.is-invalid,
    .input-wrapper select.is-invalid {
      border-color: #dc3545;
    }

    .validation-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 4px;
    }

    .validation-message i {
      font-size: 1rem;
    }

    .add-item-button {
      margin-left: auto;
      background: #1a237e;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-item-button:hover {
      background: #283593;
      transform: translateY(-1px);
    }

    .order-items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-item {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e0e0e0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .item-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-title i {
      color: #1a237e;
      font-size: 1.2rem;
    }

    .item-title h4 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .remove-item-button {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .remove-item-button:hover:not([disabled]) {
      background: rgba(220, 53, 69, 0.1);
    }

    .remove-item-button:disabled {
      color: #adb5bd;
      cursor: not-allowed;
    }

    .item-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }

    .quantity-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .quantity-btn {
      width: 36px;
      height: 36px;
      border: 1px solid #e0e0e0;
      background: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quantity-btn:hover:not([disabled]) {
      background: #f8f9fa;
      border-color: #1a237e;
      color: #1a237e;
    }

    .quantity-btn:disabled {
      background: #f8f9fa;
      color: #adb5bd;
      cursor: not-allowed;
    }

    .quantity-input input {
      width: 80px;
      text-align: center;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #f8f9fa;
      border-radius: 0 0 16px 16px;
    }

    .cancel-button,
    .submit-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-button {
      background: white;
      border: 1px solid #dc3545;
      color: #dc3545;
    }

    .cancel-button:hover {
      background: #dc3545;
      color: white;
    }

    .submit-button {
      background: #1a237e;
      border: none;
      color: white;
    }

    .submit-button:hover:not([disabled]) {
      background: #283593;
      transform: translateY(-1px);
    }

    .submit-button:disabled {
      background: #adb5bd;
      cursor: not-allowed;
    }

    .add-order-button {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .add-order-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
      transition: all 0.3s ease;
    }

    .add-order-button i {
      font-size: 1.4rem;
      transition: transform 0.3s ease;
    }

    .add-order-button span {
      font-size: 1.05rem;
      letter-spacing: 0.3px;
    }

    .add-order-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(26, 35, 126, 0.3);
    }

    .add-order-button:hover i {
      transform: scale(1.1);
    }

    .add-order-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(26, 35, 126, 0.2);
    }

    .add-order-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.3);
    }

    .input-wrapper select {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background-color: white;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
    }

    .input-wrapper select option {
      padding: 12px;
      font-size: 0.95rem;
      background-color: white;
      color: #333;
    }

    .input-wrapper select:focus {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
      outline: none;
    }

    .input-wrapper select:hover {
      border-color: #1a237e;
    }

    .input-wrapper select.is-invalid {
      border-color: #dc3545;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23dc3545' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
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

      .form-row {
        grid-template-columns: 1fr;
      }

      .item-content {
        grid-template-columns: 1fr;
      }

      .modal-footer {
        flex-direction: column;
      }

      .cancel-button,
      .submit-button {
        width: 100%;
        justify-content: center;
      }

      .add-order-button {
        padding: 10px 20px;
        font-size: 0.95rem;
      }

      .add-order-button i {
        font-size: 1.2rem;
      }
    }

    .product-info {
      margin-top: 8px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-name {
      font-weight: 500;
      color: #1a237e;
      font-size: 0.95rem;
    }

    .product-stock {
      color: #666;
      font-size: 0.9rem;
    }

    .input-wrapper input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background-color: white;
    }

    .input-wrapper input:focus {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
      outline: none;
    }

    .input-wrapper input:hover {
      border-color: #1a237e;
    }

    .input-wrapper input.is-invalid {
      border-color: #dc3545;
    }

    .input-wrapper i {
      position: absolute;
      left: 12px;
      color: #666;
      font-size: 1.1rem;
    }

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
  `],
  encapsulation: ViewEncapsulation.None
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  selectedOrder: Order | null = null;
  products: Product[] = [];

  // Add Order Modal State
  showAddOrderModal = false;
  addOrderForm = {
    name: '',
    phoneNumber: '',
    orderItems: [
      { productId: '', quantity: 1, touched: false }
    ]
  };

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orderService.getAllOrders(this.currentPage, this.pageSize).subscribe({
      next: (response: OrderListData) => {
        this.orders = response.orders;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        this.toastService.show('Error loading orders', 'error');
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (error) => {
        this.toastService.show('Failed to load products', 'error');
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  downloadInvoice(order: Order): void {
    this.orderService.getInvoice(order.orderId).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${order.orderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastService.show('Invoice downloaded successfully', 'success');
      },
      error: (error: any) => {
        this.toastService.show('Failed to download invoice', 'error');
      }
    });
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

  onAddOrder(): void {
    this.showAddOrderModal = true;
    // Reset form state
    this.addOrderForm = {
      name: '',
      phoneNumber: '',
      orderItems: [
        { productId: '', quantity: 1, touched: false }
      ]
    };
  }

  closeAddOrderModal(): void {
    this.showAddOrderModal = false;
    // Reset form state
    this.addOrderForm = {
      name: '',
      phoneNumber: '',
      orderItems: [
        { productId: '', quantity: 1, touched: false }
      ]
    };
    // Force change detection
    setTimeout(() => {
      this.showAddOrderModal = false;
    });
  }

  addOrderItem(): void {
    this.addOrderForm.orderItems.push({ productId: '', quantity: 1, touched: false });
  }

  removeOrderItem(index: number): void {
    if (this.addOrderForm.orderItems.length > 1) {
      this.addOrderForm.orderItems.splice(index, 1);
    }
  }

  submitAddOrder(): void {
    // Validate required fields
    if (!this.addOrderForm.name?.trim()) {
      this.toastService.show('Customer name is required', 'error');
      return;
    }

    if (!this.addOrderForm.phoneNumber?.trim()) {
      this.toastService.show('Phone number is required', 'error');
      return;
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(this.addOrderForm.phoneNumber)) {
      this.toastService.show('Phone number must be 10 digits', 'error');
      return;
    }

    // Validate order items
    if (!this.addOrderForm.orderItems.length) {
      this.toastService.show('Order must contain at least one item', 'error');
      return;
    }

    // Validate each item
    for (const item of this.addOrderForm.orderItems) {
      if (!item.productId) {
        this.toastService.show('Please select a product for all items', 'error');
        return;
      }

      const selectedProduct = this.products.find(p => p.barcode === item.productId);
      if (!selectedProduct) {
        this.toastService.show('Invalid product selected', 'error');
        return;
      }

      if (item.quantity < 1) {
        this.toastService.show('Quantity must be at least 1 for all items', 'error');
        return;
      }

      if (item.quantity > selectedProduct.quantity) {
        this.toastService.show(`Quantity exceeds available stock for ${selectedProduct.productName}`, 'error');
        return;
      }
    }

    // Prepare order data
    const orderData: CreateOrderDto = {
      clientName: this.addOrderForm.name.trim(),
      clientPhone: this.addOrderForm.phoneNumber.trim(),
      items: this.addOrderForm.orderItems.map(item => {
        const product = this.products.find(p => p.barcode === item.productId);
        if (!product) {
          throw new Error('Product not found');
        }
        return {
          barcode: product.barcode,
        quantity: item.quantity
        };
      })
    };

    console.log('Sending order data:', orderData); // Debug log
    
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response); // Debug log
        this.toastService.show('Order created successfully', 'success');
        this.closeAddOrderModal();
        this.loadOrders(); // Refresh the orders list
      },
      error: (error: any) => {
        console.error('Error creating order:', error); // Debug log
        if (error.error?.message) {
          this.toastService.show(error.error.message, 'error');
        } else {
        this.toastService.show('Failed to create order', 'error');
        }
      }
    });
  }

  searchProduct(event: any, index: number): void {
    const barcode = event.target.value.trim();
    const item = this.addOrderForm.orderItems[index];
    item.touched = true;
    
    if (!barcode) {
      item.productId = '';
      return;
    }

    // Find the product with matching barcode
    const product = this.products.find(p => p.barcode === barcode);
    
    if (product) {
      // Check if this product already exists in another item
      const existingItemIndex = this.addOrderForm.orderItems.findIndex(
        (existingItem, i) => i !== index && existingItem.productId === product.barcode
      );

      if (existingItemIndex !== -1) {
        // If product exists in another item, increment its quantity
        const existingItem = this.addOrderForm.orderItems[existingItemIndex];
        if (existingItem.quantity < product.quantity) {
          existingItem.quantity++;
          // Remove the current empty item
          this.addOrderForm.orderItems.splice(index, 1);
          this.toastService.show(`Quantity increased for ${product.productName}`, 'success');
        } else {
          this.toastService.show(`Cannot exceed available stock for ${product.productName}`, 'error');
        }
      } else {
        // If product doesn't exist, update the current item
        item.productId = product.barcode;
        // Reset quantity to 1 if it's more than available stock
        if (item.quantity > product.quantity) {
          item.quantity = 1;
        }
        this.toastService.show(`Product found: ${product.productName}`, 'success');
      }
    } else {
      // If no exact match, check for partial matches
      const partialMatches = this.products.filter(p => 
        p.barcode.includes(barcode) || 
        p.productName.toLowerCase().includes(barcode.toLowerCase())
      );

      if (partialMatches.length > 0) {
        this.toastService.show(`No exact match found. ${partialMatches.length} similar products available.`, 'info');
      } else {
        this.toastService.show('No product found with this barcode', 'error');
      }
    }
  }

  handleBarcodeScan(event: any, index: number): void {
    // Check if the input is from a barcode scanner (usually ends with Enter key)
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      const barcode = event.target.value.trim();
      
      if (barcode) {
        this.searchProduct({ target: { value: barcode } }, index);
      }
    }
  }

  increaseQuantity(index: number): void {
    const item = this.addOrderForm.orderItems[index];
    const selectedProduct = this.products.find(p => p.barcode === item.productId);
    if (selectedProduct && item.quantity < selectedProduct.quantity) {
      item.quantity++;
    } else {
      this.toastService.show('Cannot exceed available stock', 'error');
    }
  }

  decreaseQuantity(index: number): void {
    const item = this.addOrderForm.orderItems[index];
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  getSelectedProduct(index: number): Product | undefined {
    const item = this.addOrderForm.orderItems[index];
    return this.products.find(p => p.barcode === item.productId);
  }
} 