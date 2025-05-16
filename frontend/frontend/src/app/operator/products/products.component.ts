import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product, ProductListData } from '../../models/product.model';
import { EditProductDialogComponent } from './edit-product-dialog/edit-product-dialog.component';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentPage = 0;
  pageSize = 12;
  totalProducts = 0;
  totalPages = 0;
  isLoading = false;
  error: string | null = null;
  searchTerm: string = '';
  searchType: string = 'name'; // Default to product name
  private defaultImage = 'assets/images/default-product.webp';

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
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
          this.totalProducts = data.totalElements;
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
            this.totalProducts = data.totalElements;
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
            this.totalProducts = data.totalElements;
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadProducts();
  }

  openEditDialog(product: Product) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.error = null;

        this.productService.updateProduct(result.barcode, result)
          .subscribe({
            next: () => {
              this.loadProducts();
            },
            error: (error) => {
              console.error('Error updating product:', error);
              this.error = 'Failed to update product. Please try again later.';
              this.isLoading = false;
            }
          });
      }
    });
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
} 