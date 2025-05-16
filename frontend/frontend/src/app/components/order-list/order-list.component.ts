import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="order-list">
            <div *ngIf="loading" class="loading">Loading orders...</div>
            <div *ngIf="error" class="error">{{ error }}</div>
            
            <table *ngIf="!loading && !error" class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Order Time</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let order of orders">
                        <td>{{ order.orderId }}</td>
                        <td>{{ order.name }}</td>
                        <td>{{ order.phoneNumber }}</td>
                        <td>{{ formatDate(order.orderTime) }}</td>
                        <td>{{ formatCurrency(order.totalPrice) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    styles: [`
        .order-list {
            padding: 1rem;
        }
        .loading, .error {
            text-align: center;
            padding: 1rem;
        }
        .error {
            color: red;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        th {
            background-color: #f8f9fa;
        }
    `]
})
export class OrderListComponent implements OnInit {
    orders: Order[] = [];
    loading = false;
    error: string | null = null;

    constructor(private orderService: OrderService) {}

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.loading = true;
        this.error = null;
        
        this.orderService.getOrdersArray().subscribe({
            next: (orders) => {
                this.orders = orders;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load orders. Please try again.';
                this.loading = false;
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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
} 