import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders = [
    {
      id: 'ORD001',
      date: new Date('2024-03-15'),
      status: 'Completed',
      totalAmount: 150.00
    },
    {
      id: 'ORD002',
      date: new Date('2024-03-16'),
      status: 'Pending',
      totalAmount: 75.50
    },
    {
      id: 'ORD003',
      date: new Date('2024-03-17'),
      status: 'Cancelled',
      totalAmount: 200.00
    }
  ];

  currentPage = 0;
  pageSize = 10;
  totalPages = 1;
  loading = false;

  viewOrder(orderId: string) {
    console.log('Viewing order:', orderId);
    // Implement order viewing logic
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  loadOrders() {
    this.loading = true;
    // Implement API call to load orders
    // For now, just simulate loading
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  ngOnInit() {
    this.loadOrders();
  }
} 