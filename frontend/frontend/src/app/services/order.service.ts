import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
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

export interface Order {
  orderId: number;
  name: string;
  phoneNumber: string;
  orderTime: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

export interface CreateOrderDto {
  // For backend API
  clientName: string;
  clientPhone: string;
  items: {
    barcode: string;
    quantity: number;
  }[];
  // For frontend compatibility
  name?: string;
  phoneNumber?: string;
  orderItems?: {
    productId: string;
    quantity: number;
    touched?: boolean;
  }[];
}

export interface OrderListData {
  orders: Order[];
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {
    console.log('OrderService initialized with API URL:', this.apiUrl);
  }

  getAllOrders(page: number = 0, size: number = 10): Observable<OrderListData> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const url = `${this.apiUrl}/get`;
    console.log('Fetching orders with params:', { page, size });
    console.log('Full URL with params:', `${url}?page=${page}&size=${size}`);

    return this.http.get<any>(url, { params }).pipe(
      tap({
        next: (data) => {
          console.log('Raw API Response:', JSON.stringify(data, null, 2));
        },
        error: (error) => {
          console.error('API Error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error details:', error.error);
        }
      }),
      map(response => {
        // If we have exactly 10 items, there might be more pages
        const hasMorePages = response.orders?.length === 10;
        const totalPages = hasMorePages ? page + 2 : page + 1;
        
        console.log('Processed response:', {
          orders: response.orders,
          totalPages,
          currentPage: page,
          itemsInResponse: response.orders?.length || 0
        });

        return {
          orders: response.orders || [],
          totalPages: totalPages,
          totalElements: response.totalElements || response.orders?.length || 0
        };
      })
    );
  }

  getOrdersArray(): Observable<Order[]> {
    return this.getAllOrders().pipe(
      map(response => response.orders)
    );
  }

  createOrder(order: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create`, order);
  }

  getInvoice(orderId: number): Observable<Blob> {
    console.log('=== OrderService: getInvoice ===');
    console.log('Order ID:', orderId);
    const url = `http://localhost:8080/api/order/invoice/${orderId}`;
    console.log('API URL:', url);
    
    return this.http.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    }).pipe(
      tap({
        next: (blob) => {
          console.log('Received blob from server');
          console.log('Blob size:', blob.size);
          console.log('Blob type:', blob.type);
        },
        error: (error) => {
          console.error('Error in getInvoice:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error response:', error.error);
          throw error;
        }
      })
    );
  }
} 