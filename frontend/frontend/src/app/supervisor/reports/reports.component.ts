import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order, OrderItem } from '../../services/order.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface ProductStats {
  productId: number;
  productName: string;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-supervisor-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="reports-container">
      <h2>Daily Reports</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Orders</h3>
          <p class="stat-value">{{ totalOrders }}</p>
        </div>
        
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
        </div>
        
        <div class="stat-card">
          <h3>Average Order Value</h3>
          <p class="stat-value">{{ formatCurrency(averageOrderValue) }}</p>
        </div>
      </div>

      <div class="top-products" *ngIf="topProducts.length > 0">
        <h3>Top Products</h3>
        <div class="products-grid">
          <div class="product-card" *ngFor="let product of topProducts">
            <div class="product-name">{{ product.productName }}</div>
            <div class="product-stats">
              <div>Quantity: {{ product.quantity }}</div>
              <div>Total: {{ formatCurrency(product.total) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">Loading reports...</div>
      <div class="error" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 2rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stat-card h3 {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }
    
    .stat-value {
      margin: 0.5rem 0 0;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .top-products {
      margin-top: 2rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .product-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .product-name {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .product-stats {
      color: #666;
      font-size: 0.875rem;
    }
    
    .loading, .error {
      text-align: center;
      padding: 2rem;
    }
    
    .error {
      color: red;
    }
  `]
})
export class ReportsComponent implements OnInit {
  totalOrders = 0;
  totalRevenue = 0;
  averageOrderValue = 0;
  topProducts: ProductStats[] = [];
  loading = false;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.error = null;

    this.orderService.getOrdersArray().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;

        // Calculate product statistics
        const productStats = new Map<number, ProductStats>();
        
        orders.forEach(order => {
          order.orderItems.forEach(item => {
            const existing = productStats.get(item.productId);
            if (existing) {
              existing.quantity += item.quantity;
              existing.total += item.total;
            } else {
              productStats.set(item.productId, {
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                total: item.total
              });
            }
          });
        });

        // Convert to array and sort by quantity
        this.topProducts = Array.from(productStats.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10); // Show top 10 products

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load reports. Please try again.';
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
} 