import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, CreateOrderDto } from '../../services/order.service';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #orderForm="ngForm">
      <div class="form-group">
        <label for="name">Customer Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          [(ngModel)]="order.name" 
          required 
          #name="ngModel"
          class="form-control">
        <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error-message">
          Name is required
        </div>
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          name="phoneNumber" 
          [(ngModel)]="order.phoneNumber" 
          required 
          #phoneNumber="ngModel"
          class="form-control">
        <div *ngIf="phoneNumber.invalid && (phoneNumber.dirty || phoneNumber.touched)" class="error-message">
          Phone number is required
        </div>
      </div>

      <div class="form-group">
        <label>Order Items</label>
        <div *ngFor="let item of order.orderItems; let i = index" class="order-item">
          <div class="row">
            <div class="col">
              <select 
                [(ngModel)]="item.productId" 
                [name]="'productId' + i"
                required
                class="form-control">
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} - {{ formatCurrency(product.price) }}
                </option>
              </select>
            </div>
            <div class="col">
              <input 
                type="number" 
                [(ngModel)]="item.quantity" 
                [name]="'quantity' + i"
                required 
                min="1"
                class="form-control"
                placeholder="Quantity">
            </div>
            <div class="col-auto">
              <button type="button" class="btn btn-danger" (click)="removeItem(i)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-secondary" (click)="addItem()">
          Add Item
        </button>
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="!orderForm.form.valid">
        Create Order
      </button>
    </form>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .order-item {
      margin-bottom: 1rem;
    }
    .error-message {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class OrderFormComponent {
  @Output() orderCreated = new EventEmitter<CreateOrderDto>();
  @Input() order: CreateOrderDto = {
    clientName: '',
    clientPhone: '',
    items: [],
    name: '',
    phoneNumber: '',
    orderItems: []
  };

  products: Product[] = [
    { id: 1, name: 'Product 1', price: 10.99 },
    { id: 2, name: 'Product 2', price: 15.99 },
    { id: 3, name: 'Product 3', price: 20.99 }
  ];

  addItem(): void {
    if (!this.order.orderItems) {
      this.order.orderItems = [];
    }
    this.order.orderItems.push({
      productId: '',
      quantity: 1,
      touched: false
    });
  }

  removeItem(index: number): void {
    if (this.order.orderItems) {
      this.order.orderItems.splice(index, 1);
    }
  }

  onSubmit() {
    if (!this.order.orderItems) {
      this.order.orderItems = [];
    }
    if (this.order.orderItems.length > 0) {
      this.orderCreated.emit(this.order);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.order = {
      clientName: '',
      clientPhone: '',
      items: [],
      name: '',
      phoneNumber: '',
      orderItems: []
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  isFormValid(): boolean {
    return (
      (this.order.clientName?.trim() !== '') &&
      (this.order.clientPhone?.trim() !== '') &&
      ((this.order.items?.length ?? 0) > 0) &&
      (this.order.items?.every(item => item.quantity > 0) ?? false)
    );
  }
} 