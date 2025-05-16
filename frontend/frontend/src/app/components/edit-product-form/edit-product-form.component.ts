import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

interface ProductForm {
  productName: string;
  barcode: string;
  url: string;
  mrp: number;
  clientName: string;
  quantity: number;
}

@Component({
  selector: 'app-edit-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isAddMode ? 'Add Product' : 'Edit Product' }}</h2>
          <button class="close-button" (click)="onClose()">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form (ngSubmit)="onSubmit()" #productForm="ngForm">
            <div class="form-group">
              <label for="productName">Product Name</label>
              <input 
                type="text" 
                id="productName" 
                name="productName" 
                [(ngModel)]="formData.productName" 
                required
                maxlength="100"
                class="form-control">
              <small class="error-message" *ngIf="productForm.submitted && !formData.productName">
                Product name must not be blank
              </small>
            </div>

            <div class="form-group">
              <label for="barcode">Barcode</label>
              <input 
                type="text" 
                id="barcode" 
                name="barcode" 
                [(ngModel)]="formData.barcode"
                [readonly]="!isAddMode"
                [class.readonly]="!isAddMode"
                required
                class="form-control">
              <small class="error-message" *ngIf="productForm.submitted && !formData.barcode">
                Barcode must not be blank
              </small>
            </div>

            <div class="form-group">
              <label for="clientName">Client Name</label>
              <input 
                type="text" 
                id="clientName" 
                name="clientName" 
                [(ngModel)]="formData.clientName"
                [readonly]="!isAddMode"
                [class.readonly]="!isAddMode"
                required
                class="form-control">
              <small class="error-message" *ngIf="productForm.submitted && !formData.clientName">
                Client name must not be blank
              </small>
            </div>

            <div class="form-group">
              <label for="mrp">Price (₹)</label>
              <input 
                type="number" 
                id="mrp" 
                name="mrp" 
                [(ngModel)]="formData.mrp" 
                required
                min="0"
                step="0.01"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode === 46"
                class="form-control">
              <small class="error-message" *ngIf="productForm.submitted && formData.mrp < 0">
                MRP cannot be negative
              </small>
            </div>

            <div class="form-group">
              <label for="quantity">Quantity</label>
              <div class="quantity-input-group">
                <input 
                  type="number" 
                  id="quantity" 
                  name="quantity" 
                  [(ngModel)]="formData.quantity" 
                  required
                  min="0"
                  step="1"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  class="form-control"
                  (ngModelChange)="onQuantityChange()">
                <button 
                  *ngIf="isQuantityChanged && !isAddMode" 
                  type="button" 
                  class="update-inventory-button"
                  (click)="onUpdateInventory()">
                  Update Inventory
                </button>
              </div>
              <small class="error-message" *ngIf="productForm.submitted && formData.quantity < 0">
                Quantity cannot be negative
              </small>
            </div>

            <div class="form-group">
              <label for="url">Image URL</label>
              <input 
                type="text" 
                id="url" 
                name="url" 
                [(ngModel)]="formData.url" 
                class="form-control">
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-button" (click)="onClose()">Cancel</button>
              <button type="submit" class="save-button" [disabled]="!productForm.form.valid">
                {{ isAddMode ? 'Add Product' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #1a237e;
      font-size: 1.5rem;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
      transition: color 0.3s ease;
    }

    .close-button:hover {
      color: #1a237e;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #1a237e;
      box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .cancel-button, .save-button {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-button {
      background: #f5f5f5;
      border: 1px solid #ddd;
      color: #666;
    }

    .cancel-button:hover {
      background: #eee;
    }

    .save-button {
      background: #1a237e;
      border: none;
      color: white;
    }

    .save-button:hover:not(:disabled) {
      background: #151b60;
      transform: translateY(-1px);
    }

    .save-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .form-control.readonly {
      background-color: #f5f5f5;
      cursor: not-allowed;
      border-color: #ddd;
    }

    .form-control.readonly:focus {
      border-color: #ddd;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .cancel-button, .save-button {
        width: 100%;
      }
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    .form-control.ng-invalid.ng-touched {
      border-color: #d32f2f;
    }

    .quantity-input-group {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .update-inventory-button {
      padding: 0.5rem 1rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .update-inventory-button:hover {
      background: #388e3c;
      transform: translateY(-1px);
    }

    .update-inventory-button:active {
      transform: translateY(0);
    }
  `]
})
export class EditProductFormComponent implements OnInit {
  @Input() product!: Product;
  @Input() isAddMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{barcode: string, form: ProductForm}>();
  @Output() updateInventory = new EventEmitter<{barcode: string, quantity: number}>();

  formData: ProductForm = {
    productName: '',
    barcode: '',
    url: '',
    mrp: 0,
    clientName: '',
    quantity: 0
  };

  isQuantityChanged = false;
  originalQuantity: number = 0;

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Initialize form data with product values
    this.formData = {
      productName: this.product.productName || '',
      barcode: this.product.barcode || '',
      mrp: this.product.mrp || 0,
      quantity: this.product.quantity || 0,
      url: this.product.url || '',
      clientName: this.product.clientName || ''
    };
    this.originalQuantity = this.product.quantity;
  }

  onClose() {
    this.close.emit();
  }

  onQuantityChange() {
    this.isQuantityChanged = this.formData.quantity !== this.originalQuantity;
  }

  onUpdateInventory() {
    this.updateInventory.emit({
      barcode: this.product.barcode,
      quantity: this.formData.quantity
    });
    this.isQuantityChanged = false;
    this.originalQuantity = this.formData.quantity;
  }

  onSubmit() {
    // Ensure all fields are populated with non-null values
    const updatedForm: ProductForm = {
      productName: this.formData.productName || '',
      barcode: this.isAddMode ? this.formData.barcode : this.product.barcode || '',
      mrp: this.formData.mrp || 0,
      quantity: this.formData.quantity || 0,
      url: this.formData.url || '',
      clientName: this.isAddMode ? this.formData.clientName : this.product.clientName || ''
    };

    if (updatedForm.productName && 
        updatedForm.barcode && 
        updatedForm.clientName && 
        updatedForm.mrp >= 0 && 
        updatedForm.quantity >= 0) {
      this.save.emit({
        barcode: this.isAddMode ? updatedForm.barcode : this.product.barcode || '',
        form: updatedForm
      });
    }
  }
} 