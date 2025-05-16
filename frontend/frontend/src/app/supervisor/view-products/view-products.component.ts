import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductListData } from '../../models/product.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { EditProductFormComponent } from '../../components/edit-product-form/edit-product-form.component';
import { FileDownloadService } from '../../services/file-download.service';
import { BulkInventoryFormComponent } from '../../components/bulk-inventory-form/bulk-inventory-form.component';
import { BulkProductFormComponent } from '../../components/bulk-product-form/bulk-product-form.component';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    NavbarComponent, 
    ToastComponent,
    EditProductFormComponent,
    BulkInventoryFormComponent,
    BulkProductFormComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="products-container">
      <div class="header">
        <div class="header-left">
          <h1>Products</h1>
        </div>
        <div class="header-actions">
          <div class="dropdown">
            <button class="action-button edit" (click)="toggleProductDropdown()">
              <i class="bi bi-pencil"></i> Edit Product
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="dropdown-menu" [class.show]="showProductDropdown">
              <button class="dropdown-item" (click)="onAddProduct()">
                <i class="bi bi-plus-circle"></i> Add Product
              </button>
              <button class="dropdown-item" (click)="onAddBulkProduct()">
                <i class="bi bi-boxes"></i> Add Bulk Product
              </button>
              <button class="dropdown-item" (click)="onDownloadProductTemplate()">
                <i class="bi bi-download"></i> Download Template
              </button>
            </div>
          </div>
          <div class="dropdown">
            <button class="action-button edit" (click)="toggleInventoryDropdown()">
              <i class="bi bi-pencil"></i> Edit Inventory
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="dropdown-menu" [class.show]="showInventoryDropdown">
              <button class="dropdown-item" (click)="onAddBulkInventory()">
                <i class="bi bi-boxes"></i> Add Bulk Inventory
              </button>
              <button class="dropdown-item" (click)="onDownloadTemplate()">
                <i class="bi bi-download"></i> Download Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="search-container">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (keyup.enter)="searchProducts()"
            placeholder="Search products..."
            class="search-input">
          <select [(ngModel)]="searchType" class="search-type">
            <option value="name">By Name</option>
            <option value="barcode">By Barcode</option>
          </select>
          <button (click)="searchProducts()" class="search-button">
            <i class="bi bi-search"></i>
          </button>
          <button *ngIf="searchTerm" (click)="clearSearch()" class="clear-button">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="isLoading" class="loading-spinner">
        Loading...
      </div>

      <div *ngIf="!isLoading && !error" class="products-grid">
        <div *ngFor="let product of products" class="product-card">
          <div class="card-image">
            <img 
              [src]="getProductImage(product.url)" 
              [alt]="product.productName"
              (error)="onImageError($event)"
              class="product-image">
            <button class="edit-button" (click)="editProduct(product)" title="Edit Product">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
          <div class="card-header">
            <h3>{{ product.productName }}</h3>
            <div class="barcode">{{ product.barcode }}</div>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value price">{{ formatCurrency(product.mrp) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Stock:</span>
              <span class="value stock" [ngClass]="{'low-stock': product.quantity < 10}">
                {{ product.quantity }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="products.length === 0 && !isLoading" class="no-data">
        <p>No products found.</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 0">
        <div class="pagination-info">
          <span>Page {{ currentPage + 1 }}</span>
        </div>
        <div class="pagination-buttons">
          <button 
            class="pagination-button" 
            [disabled]="currentPage === 0"
            (click)="previousPage()"
            title="Previous Page">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button 
            class="pagination-button" 
            [disabled]="currentPage >= totalPages - 1"
            (click)="nextPage()"
            title="Next Page">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <app-edit-product-form
      *ngIf="showEditForm && selectedProduct"
      [product]="selectedProduct"
      [isAddMode]="isAddMode"
      (close)="onCloseEditForm()"
      (save)="onSaveProduct($event)"
      (updateInventory)="onUpdateInventory($event)">
    </app-edit-product-form>

    <app-bulk-inventory-form 
      *ngIf="showBulkInventoryForm"
      (close)="onCloseBulkInventoryForm()"
      (refresh)="loadProducts()">
    </app-bulk-inventory-form>

    <app-bulk-product-form 
      *ngIf="showBulkProductForm"
      (close)="onCloseBulkProductForm()"
      (refresh)="loadProducts()">
    </app-bulk-product-form>
  `,
  styles: [`
    .products-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #dee2e6;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header h1 {
      color: #2c3e50;
      font-size: 2rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      z-index: 1000;
      display: none;
      margin-top: 0.5rem;
    }

    .dropdown-menu.show {
      display: block;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      width: 100%;
      border: none;
      background: none;
      color: #2c3e50;
      font-size: 1rem;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f8f9fa;
      }

      i {
        font-size: 1.1rem;
      }

      &:first-child {
        border-radius: 8px 8px 0 0;
      }

      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }

    .action-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      white-space: nowrap;

      &.edit {
        background: #2196F3;
        color: white;

        &:hover {
          background: #1976D2;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      }

      i {
        font-size: 1.2rem;
      }
    }

    .search-container {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      width: 100%;
      max-width: 500px;
    }

    .search-input {
      border: none;
      padding: 0.5rem;
      font-size: 1rem;
      width: 300px;
      outline: none;
    }

    .search-type {
      border: none;
      padding: 0.5rem;
      font-size: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      margin: 0 0.5rem;
      outline: none;
    }

    .search-button, .clear-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #666;
      transition: color 0.3s ease;
    }

    .search-button:hover, .clear-button:hover {
      color: #1a237e;
    }

    .clear-button {
      margin-left: 0.5rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      position: relative;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-header {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .card-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .barcode {
      color: #666;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .card-body {
      padding: 1rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .label {
      color: #666;
    }

    .value {
      font-weight: 500;
    }

    .value.price {
      color: #2e7d32;
    }

    .value.stock {
      color: #1976d2;
    }

    .value.stock.low-stock {
      color: #d32f2f;
    }

    .error-message {
      background: #ffebee;
      color: #d32f2f;
      padding: 1rem;
      border-radius: 5px;
      margin-bottom: 1rem;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    /* Pagination Styles */
    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
      padding: 15px;
      background: #1a237e;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
    }

    .pagination-info {
      font-size: 1.1rem;
      color: white;
      font-weight: 500;
    }

    .pagination-buttons {
      display: flex;
      gap: 10px;
    }

    .pagination-button {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .pagination-button:hover:not([disabled]) {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .pagination-button:disabled {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.3);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .pagination-button i {
      font-size: 1.2rem;
    }

    .edit-button {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      color: #1a237e;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      opacity: 0;
      z-index: 10;
      backdrop-filter: blur(4px);
      border: 2px solid rgba(255, 255, 255, 0.8);
    }

    .product-card:hover .edit-button {
      opacity: 1;
      transform: translateY(0);
    }

    .edit-button:hover {
      background: #1a237e;
      color: white;
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 6px 16px rgba(26, 35, 126, 0.3);
      border-color: rgba(255, 255, 255, 0.9);
    }

    .edit-button i {
      font-size: 1.2rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .edit-button::after {
      content: 'Edit';
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      backdrop-filter: blur(4px);
    }

    .edit-button:hover::after {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
      }

      .search-box {
        width: 100%;
      }

      .search-input {
        width: 100%;
      }

      .pagination {
        padding: 10px;
        margin-top: 20px;
      }

      .pagination-button {
        width: 36px;
        height: 36px;
      }

      .pagination-info {
        font-size: 1rem;
      }
    }
  `]
})
export class ViewProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  searchTerm: string = '';
  searchType: string = 'name';
  private defaultImage = 'assets/images/default-product.webp';
  showProductDropdown = false;
  showInventoryDropdown = false;
  showEditForm = false;
  selectedProduct: Product | null = null;
  isAddMode = false;
  showBulkInventoryForm = false;
  showBulkProductForm = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private fileDownloadService: FileDownloadService
  ) {
    console.log('ViewProductsComponent constructor called');
  }

  ngOnInit() {
    console.log('ViewProductsComponent ngOnInit called');
    this.loadProducts();
  }

  getProductImage(url: string | null | undefined): string {
    if (!url || url.trim() === '') {
      return this.defaultImage;
    }
    return url;
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src !== this.defaultImage) {
      imgElement.src = this.defaultImage;
    }
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    console.log('=== Loading Products ===');
    console.log('Current Page:', this.currentPage);
    console.log('Page Size:', this.pageSize);

    this.productService.getAllProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: (data: ProductListData) => {
          console.log('=== API Response ===');
          console.log('Products data:', data);
          console.log('Total Elements:', data.totalElements);
          console.log('Total Pages:', data.totalPages);
          console.log('Products in response:', data.products?.length || 0);
          
          this.products = data.products;
          this.totalPages = data.totalPages;
          
          console.log('=== Updated Component State ===');
          console.log('Total pages:', this.totalPages);
          console.log('Current page:', this.currentPage);
          console.log('Products length:', this.products.length);
          console.log('Should show pagination:', this.totalPages > 0);
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('=== Error Loading Products ===');
          console.error('Error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          this.error = 'Failed to load products. Please try again later.';
          this.isLoading = false;
          this.toastService.show(this.error, 'error');
        }
      });
  }

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.loadProducts();
      return;
    }

    this.isLoading = true;
    this.error = null;

    if (this.searchType === 'name') {
      this.productService.searchProductsByName(this.searchTerm, this.currentPage, this.pageSize)
        .subscribe({
          next: (data: ProductListData) => {
            this.products = data.products;
            this.totalPages = data.totalPages;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error searching products:', error);
            this.error = 'Failed to search products. Please try again later.';
            this.isLoading = false;
            this.toastService.show(this.error, 'error');
          }
        });
    } else if (this.searchType === 'barcode') {
      this.productService.searchProductsByBarcode(this.searchTerm, this.currentPage, this.pageSize)
        .subscribe({
          next: (data: ProductListData) => {
            this.products = data.products;
            this.totalPages = data.totalPages;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error searching products:', error);
            this.error = 'Failed to search products. Please try again later.';
            this.isLoading = false;
            this.toastService.show(this.error, 'error');
          }
        });
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadProducts();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  nextPage() {
    console.log('=== Next Page Clicked ===');
    console.log('Current page before:', this.currentPage);
    console.log('Total pages:', this.totalPages);
    console.log('Products in current page:', this.products.length);
    
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      console.log('Moving to page:', this.currentPage);
      this.loadProducts();
    } else {
      console.log('Cannot move to next page - already at last page');
      this.toastService.show('You are already on the last page', 'info');
    }
  }

  previousPage() {
    console.log('=== Previous Page Clicked ===');
    console.log('Current page before:', this.currentPage);
    console.log('Total pages:', this.totalPages);
    
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('Moving to page:', this.currentPage);
      this.loadProducts();
    } else {
      console.log('Cannot move to previous page - already at first page');
      this.toastService.show('You are already on the first page', 'info');
    }
  }

  toggleProductDropdown() {
    this.showProductDropdown = !this.showProductDropdown;
    this.showInventoryDropdown = false;
  }

  toggleInventoryDropdown() {
    this.showInventoryDropdown = !this.showInventoryDropdown;
    this.showProductDropdown = false;
  }

  onEditProduct(): void {
    console.log('Edit Product clicked');
    this.showProductDropdown = false;
    // TODO: Implement edit product functionality
    this.toastService.show('Edit Product clicked!', 'info');
  }

  onAddProduct(): void {
    console.log('Add Product clicked');
    this.showProductDropdown = false;
    this.isAddMode = true;
    this.selectedProduct = {
      id: 0,
      barcode: '',
      productName: '',
      mrp: 0,
      quantity: 0,
      url: '',
      clientName: ''
    };
    this.showEditForm = true;
  }

  onEditInventory(): void {
    console.log('Edit Inventory clicked');
    this.showInventoryDropdown = false;
    // TODO: Implement edit inventory functionality
    this.toastService.show('Edit Inventory clicked!', 'info');
  }

  onAddInventory() {
    console.log('Add Bulk Inventory clicked');
    this.showInventoryDropdown = false;
    this.showBulkInventoryForm = true;
  }

  onCloseBulkInventoryForm() {
    this.showBulkInventoryForm = false;
    this.loadProducts();
  }

  onAddBulkInventory(): void {
    console.log('Add Bulk Inventory clicked');
    this.showInventoryDropdown = false;
    this.showBulkInventoryForm = true;
  }

  onDownloadTemplate(): void {
    console.log('Download Inventory Template clicked');
    this.showInventoryDropdown = false;
    this.downloadInventoryTemplate();
  }

  downloadInventoryTemplate(): void {
    console.log('Starting inventory template download...');
    this.toastService.show('Downloading inventory template...', 'info');
    
    this.productService.downloadInventoryTemplate().subscribe({
      next: (blob: Blob) => {
        try {
          // Create a blob URL
          const url = window.URL.createObjectURL(blob);
          console.log('Created blob URL:', url);
          
          // Create download link
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = 'inventory_template.tsv';
          
          // Append to body
          document.body.appendChild(link);
          console.log('Triggering download...');
          link.click();
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('Cleaned up download resources');
          }, 100);

          this.toastService.show('Inventory template downloaded successfully', 'success');
        } catch (error) {
          console.error('Error downloading inventory template:', error);
          this.toastService.show('Error downloading inventory template: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        }
      },
      error: (error) => {
        console.error('Error downloading inventory template:', error);
        let errorMessage = 'Failed to download inventory template. ';
        
        if (error.status === 404) {
          errorMessage += 'Template file not found. Please contact support.';
        } else if (error.status === 0) {
          errorMessage += 'Network error. Please check your connection.';
        } else {
          errorMessage += 'Please try again.';
        }
        
        this.toastService.show(errorMessage, 'error');
      }
    });
  }

  onAddBulkProduct(): void {
    console.log('Add Bulk Product clicked');
    this.showProductDropdown = false;
    this.showBulkProductForm = true;
  }

  onDownloadProductTemplate(): void {
    console.log('Download Product Template clicked');
    this.showProductDropdown = false;
    this.downloadTemplate();  // Call the actual download method
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.showEditForm = true;
  }

  onCloseEditForm(): void {
    this.showEditForm = false;
    this.selectedProduct = null;
    this.isAddMode = false;
  }

  onSaveProduct(data: {barcode: string, form: any}): void {
    if (this.isAddMode) {
      this.productService.createProduct(data.form).subscribe({
        next: () => {
          this.toastService.show('Product created successfully', 'success');
          this.loadProducts();
          this.onCloseEditForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.toastService.show('Failed to create product', 'error');
        }
      });
    } else {
      this.productService.updateProduct(data.barcode, data.form).subscribe({
        next: () => {
          this.toastService.show('Product updated successfully', 'success');
          this.loadProducts();
          this.onCloseEditForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.toastService.show('Failed to update product', 'error');
        }
      });
    }
  }

  onUpdateInventory(data: {barcode: string, quantity: number}): void {
    this.productService.updateInventory(data.barcode, data.quantity).subscribe({
      next: () => {
        this.toastService.show('Inventory updated successfully', 'success');
        this.loadProducts(); // Refresh the product list
      },
      error: (error) => {
        console.error('Error updating inventory:', error);
        this.toastService.show('Failed to update inventory', 'error');
      }
    });
  }

  downloadTemplate(): void {
    console.log('Starting template download...');
    this.toastService.show('Downloading product template...', 'info');
    
    // Use the ProductService instead of FileDownloadService
    this.productService.downloadTemplate().subscribe({
      next: (blob: Blob) => {
        try {
          // Create a blob URL
          const url = window.URL.createObjectURL(blob);
          console.log('Created blob URL:', url);
          
          // Create download link
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = 'products_template.tsv';
          
          // Append to body
          document.body.appendChild(link);
          console.log('Triggering download...');
          link.click();
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('Cleaned up download resources');
          }, 100);

          this.toastService.show('Template downloaded successfully', 'success');
        } catch (error) {
          console.error('Error downloading template:', error);
          this.toastService.show('Error downloading template: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        }
      },
      error: (error) => {
        console.error('Error downloading template:', error);
        let errorMessage = 'Failed to download template. ';
        
        if (error.status === 404) {
          errorMessage += 'Template file not found. Please contact support.';
        } else if (error.status === 0) {
          errorMessage += 'Network error. Please check your connection.';
        } else {
          errorMessage += 'Please try again.';
        }
        
        this.toastService.show(errorMessage, 'error');
      }
    });
  }

  onCloseBulkProductForm() {
    this.showBulkProductForm = false;
  }
} 