import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../components/toast/toast.component';
import { ProductService } from '../../../services/product.service';
import { OrderItem } from '../../../models/order-item.model';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  order = {
    clientName: '',
    clientPhone: '',
    items: [] as OrderItem[]
  };
  orderItems: OrderItem[] = [];
  barcodeInput: string = '';
  loading: boolean = false;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validateCustomerName(name: string): boolean {
    if (!name) return true;
    return /^[a-zA-Z\s]*$/.test(name);
  }

  onCustomerNameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Immediately remove any numbers or special characters
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    
    // If the value was changed, update both the model and input
    if (sanitizedValue !== value) {
      this.order.clientName = sanitizedValue;
      input.value = sanitizedValue;
      this.toastService.show('Only letters and spaces are allowed in customer name', 'error');
    }
  }

  onCustomerNameKeyPress(event: KeyboardEvent): boolean {
    // Prevent any non-letter characters from being typed
    const key = event.key;
    if (!/^[a-zA-Z\s]$/.test(key)) {
      event.preventDefault();
      this.toastService.show('Only letters and spaces are allowed in customer name', 'error');
      return false;
    }
    return true;
  }

  isFormValid(): boolean {
    return (
      this.order.clientName.trim() !== '' &&
      this.validateCustomerName(this.order.clientName) &&
      this.order.clientPhone.trim() !== '' &&
      this.orderItems.length > 0 &&
      this.orderItems.every(item => item.quantity > 0)
    );
  }

  async addToOrder(): Promise<void> {
    if (!this.barcodeInput) {
      this.toastService.show('Please enter a barcode', 'error');
      return;
    }

    try {
      this.loading = true;
      const product = await this.productService.getProductByBarcode(this.barcodeInput).toPromise();
      
      if (!product) {
        this.toastService.show('Product not found', 'error');
        return;
      }

      const existingItem = this.orderItems.find(item => item.barcode === product.barcode);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.orderItems.push({
          barcode: product.barcode,
          productName: product.productName,
          mrp: product.mrp,
          quantity: 1
        });
      }

      this.barcodeInput = '';
      this.toastService.show('Product added to order', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      this.toastService.show('Error adding product to order', 'error');
    } finally {
      this.loading = false;
    }
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity < 1) return;
    this.orderItems[index].quantity = newQuantity;
  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  calculateTotal(): number {
    return this.orderItems.reduce((total, item) => total + (item.mrp * item.quantity), 0);
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }

    try {
      this.loading = true;
      const orderData = {
        clientName: this.order.clientName,
        clientPhone: this.order.clientPhone,
        items: this.orderItems.map(item => ({
          barcode: item.barcode,
          quantity: item.quantity
        }))
      };

      await this.orderService.createOrder(orderData).toPromise();
      this.toastService.show('Order created successfully', 'success');
      this.router.navigate(['/operator/orders']);
    } catch (error) {
      console.error('Error creating order:', error);
      this.toastService.show('Error creating order', 'error');
    } finally {
      this.loading = false;
    }
  }
} 