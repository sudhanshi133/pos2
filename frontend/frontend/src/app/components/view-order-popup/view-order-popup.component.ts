import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../services/order.service';

@Component({
  selector: 'app-view-order-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal" *ngIf="order">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <div class="order-header-row">
              <h3>Order #{{ order.orderId }}</h3>
              <span class="order-date-time">{{ formatDate(order.orderTime) | date:'MMM d, y' }} | {{ formatDate(order.orderTime) | date:'hh:mm a' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <!-- Customer Details Section -->
          <div class="customer-info">
            <h4>Customer Information</h4>
            <div class="customer-details-grid">
              <div class="customer-detail-item">
                <i class="bi bi-person"></i>
                <div class="detail-content">
                  <span class="detail-label">Name</span>
                  <span class="detail-value">{{ order.name || 'N/A' }}</span>
                </div>
              </div>
              <div class="customer-detail-item">
                <i class="bi bi-telephone"></i>
                <div class="detail-content">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ order.phoneNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items Table -->
          <div class="order-items-section">
            <h4>Order Items</h4>
            <div class="table-container">
              <table class="order-items-table">
                <thead>
                  <tr>
                    <th class="product-col">Product</th>
                    <th class="quantity-col">Quantity</th>
                    <th class="price-col">Price</th>
                    <th class="subtotal-col">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of order.orderItems">
                    <td>{{ item.productName }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end">{{ formatCurrency(item.sellingPrice) }}</td>
                    <td class="text-end">{{ formatCurrency(item.totalPrice) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end fw-bold">Total:</td>
                    <td class="text-end fw-bold">{{ formatCurrency(order.totalPrice) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Close Button -->
          <div class="modal-footer">
            <button class="close-modal-button" (click)="close()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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

    .modal-body {
      padding: 20px;
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

    @media (max-width: 768px) {
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
    }
  `]
})
export class ViewOrderPopupComponent {
  @Input() order: Order | null = null;
  @Output() closePopup = new EventEmitter<void>();

  close() {
    this.closePopup.emit();
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