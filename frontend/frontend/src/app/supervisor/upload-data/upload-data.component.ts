import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UploadDataComponent {
  productFile: File | null = null;
  inventoryFile: File | null = null;
  productFileName: string = '';
  inventoryFileName: string = '';
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onProductFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.tsv')) {
      this.productFile = file;
      this.productFileName = file.name;
    } else {
      this.showError('Please select a valid TSV file for products');
    }
  }

  onInventoryFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.tsv')) {
      this.inventoryFile = file;
      this.inventoryFileName = file.name;
    } else {
      this.showError('Please select a valid TSV file for inventory');
    }
  }

  uploadProducts(): void {
    if (!this.productFile) {
      this.showError('Please select a product file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.productFile);

    this.http.post('/api/upload/products', formData).subscribe({
      next: () => {
        this.showSuccess('Products uploaded successfully');
        this.productFile = null;
        this.productFileName = '';
      },
      error: (error) => {
        this.showError('Failed to upload products: ' + error.message);
      }
    });
  }

  uploadInventory(): void {
    if (!this.inventoryFile) {
      this.showError('Please select an inventory file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.inventoryFile);

    this.http.post('/api/upload/inventory', formData).subscribe({
      next: () => {
        this.showSuccess('Inventory uploaded successfully');
        this.inventoryFile = null;
        this.inventoryFileName = '';
      },
      error: (error) => {
        this.showError('Failed to upload inventory: ' + error.message);
      }
    });
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }
} 