import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  products: any[] = [];
  newProduct: any = { barcode: '', name: '', brand: '', category: '', mrp: 0 };
  searchQuery: string = '';
  searchBarcode: string = '';
  page: number = 0;
  size: number = 12;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any>(`/api/product/get?page=${this.page}&size=${this.size}`)
      .subscribe(data => {
        this.products = data.products.map(product => ({
          id: product.barcode,
          name: product.name,
          client: product.brand,
          price: product.mrp,
          stock: product.category
        }));
      });
  }

  searchProducts(): void {
    this.http.get<any>(`/api/product/search?productName=${this.searchQuery}&barcode=${this.searchBarcode}&page=${this.page}&size=${this.size}`)
      .subscribe(data => {
        this.products = data.products.map(product => ({
          id: product.barcode,
          name: product.name,
          client: product.brand,
          price: product.mrp,
          stock: product.category
        }));
      });
  }

  addProduct(): void {
    this.http.post('/api/product/create', this.newProduct)
      .subscribe(() => {
        this.loadProducts();
        this.newProduct = { barcode: '', name: '', brand: '', category: '', mrp: 0 };
      });
  }

  updateProduct(barcode: string, product: any): void {
    this.http.put(`/api/product/update/${barcode}`, product)
      .subscribe(() => {
        this.loadProducts();
      });
  }

  bulkAddProducts(products: any[]): void {
    this.http.post('/api/product/bulk-create', products)
      .subscribe(() => {
        this.loadProducts();
      });
  }
} 