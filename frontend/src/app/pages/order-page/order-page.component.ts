import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {
  orders: any[] = [];
  newOrder: any = { items: [] };
  page: number = 0;
  size: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<any>(`/api/order/get?page=${this.page}&size=${this.size}`)
      .subscribe(data => {
        this.orders = data.orders;
      });
  }

  createOrder(): void {
    this.http.post('/api/order/create', this.newOrder)
      .subscribe(() => {
        this.loadOrders();
        this.newOrder = { items: [] };
      });
  }

  getOrderById(orderId: number): void {
    this.http.get<any>(`/api/order/get/${orderId}`)
      .subscribe(data => {
        console.log('Order details:', data);
      });
  }
} 