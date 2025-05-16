import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductListData } from '../models/product.model';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface ProductForm {
  productName: string;
  barcode: string;
  url: string;
  mrp: number;
  clientName: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:9001/pos/api/product';
  private inventoryApiUrl = 'http://localhost:9001/pos/api/inventory';

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 0, size: number = 12): Observable<ProductListData> {
    const pageNumber = Math.max(0, page);
    const url = `${this.apiUrl}/get?page=${pageNumber}&size=${size}`;
    console.log('API Request URL:', url);
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Raw API Response:', response);
        // If we have exactly 12 items, there might be more pages
        const hasMorePages = response.products?.length === 12;
        const totalPages = hasMorePages ? page + 2 : page + 1;
        
        return {
          products: response.products || [],
          totalElements: response.totalElements || response.products?.length || 0,
          totalPages: totalPages,
          size: size,
          number: page
        };
      })
    );
  }

  searchProducts(productName?: string, barcode?: string, page: number = 0, size: number = 12): Observable<ProductListData> {
    const pageNumber = Math.max(0, page);
    let url = `${this.apiUrl}/search?page=${pageNumber}&size=${size}`;
    if (productName) url += `&productName=${encodeURIComponent(productName)}`;
    if (barcode) url += `&barcode=${encodeURIComponent(barcode)}`;
    console.log('Search URL:', url);
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Raw Search Response:', response);
        // If we have exactly 12 items, there might be more pages
        const hasMorePages = response.products?.length === 12;
        const totalPages = hasMorePages ? page + 2 : page + 1;
        
        return {
          products: response.products || [],
          totalElements: response.totalElements || response.products?.length || 0,
          totalPages: totalPages,
          size: size,
          number: page
        };
      })
    );
  }

  createProduct(product: Product): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, product);
  }

  updateProduct(barcode: string, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${barcode}`, product);
  }

  updateProductQuantity(barcode: string, quantity: number): Observable<void> {
    const url = `${this.inventoryApiUrl}/update/${barcode}`;
    console.log('Full inventory update URL:', url);
    const inventoryForm = {
      quantity: quantity
    };
    console.log('Request payload (InventoryForm):', inventoryForm);
    return this.http.put<void>(url, inventoryForm);
  }

  searchProductsByName(name: string, page: number = 0, size: number = 12): Observable<ProductListData> {
    return this.searchProducts(name, undefined, page, size);
  }

  searchProductsByBarcode(barcode: string, page: number = 0, size: number = 12): Observable<ProductListData> {
    return this.searchProducts(undefined, barcode, page, size);
  }

  updateInventory(barcode: string, quantity: number): Observable<any> {
    return this.http.put(`${this.inventoryApiUrl}/update/${barcode}`, { quantity });
  }

  getProductByBarcode(barcode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${barcode}`);
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get('assets/images/products.tsv', {
      responseType: 'blob',
      headers: {
        'Accept': 'text/tab-separated-values'
      }
    });
  }

  downloadInventoryTemplate(): Observable<Blob> {
    console.log('Downloading inventory template...');
    return this.http.get('assets/images/inventory.tsv', {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'text/tab-separated-values'
      })
    }).pipe(
      tap(response => {
        console.log('Template download response:', response);
        if (!response || response.size === 0) {
          throw new Error('Empty template file received');
        }
      }),
      catchError(error => {
        console.error('Error downloading inventory template:', error);
        if (error.status === 404) {
          throw new Error('Inventory template file not found');
        }
        throw error;
      })
    );
  }

  bulkUpdateInventory(inventoryForms: { barcode: string, quantity: number }[]): Observable<any> {
    return this.http.put(`${this.inventoryApiUrl}/bulk-update`, inventoryForms);
  }

  bulkCreateProducts(products: ProductForm[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk-create`, products);
  }
} 