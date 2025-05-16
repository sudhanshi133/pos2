import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upload-products',
  templateUrl: './upload-products.component.html',
  styleUrls: ['./upload-products.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UploadProductsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  productFile: File | null = null;
  productFileName: string = '';
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.tsv')) {
      this.productFile = file;
      this.productFileName = file.name;
    } else {
      this.showError('Please select a valid TSV file');
    }
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  uploadProducts(): void {
    if (!this.productFile) {
      this.showError('Please select a file to upload');
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