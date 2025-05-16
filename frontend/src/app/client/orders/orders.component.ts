import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-container">
      <div class="header">
        <h1>My Orders</h1>
        <a routerLink="/client/dashboard" class="back-button">
          <i class="bi bi-arrow-left"></i>
          Back to Dashboard
        </a>
      </div>

      <div class="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td>{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td>
                <span [class]="'status ' + order.status.toLowerCase()">
                  {{ order.status }}
                </span>
              </td>
              <td>₹{{ order.total }}</td>
              <td>
                <button class="view-button" (click)="viewOrder(order)">
                  View Details
                </button>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="5" class="no-orders">
                No orders found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #2d3748;
      margin: 0;
      font-size: 2rem;
    }

    .back-button {
      color: #48bb78;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .back-button:hover {
      color: #38a169;
    }

    .orders-table {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f8fafc;
      font-weight: 600;
      color: #4a5568;
    }

    tr:hover {
      background: #f8fafc;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status.processing {
      background: #dbeafe;
      color: #1e40af;
    }

    .status.completed {
      background: #dcfce7;
      color: #166534;
    }

    .status.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .view-button {
      background: #48bb78;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .view-button:hover {
      background: #38a169;
    }

    .no-orders {
      text-align: center;
      color: #718096;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .orders-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class OrdersComponent {
  // Sample data - replace with actual data from your service
  orders = [
    {
      id: 'ORD001',
      date: '2024-03-15',
      status: 'Completed',
      total: 1500.00
    },
    {
      id: 'ORD002',
      date: '2024-03-20',
      status: 'Processing',
      total: 2300.00
    },
    {
      id: 'ORD003',
      date: '2024-03-25',
      status: 'Pending',
      total: 950.00
    }
  ];

  viewOrder(order: any) {
    // Implement order details view
    console.log('View order:', order);
  }
} 