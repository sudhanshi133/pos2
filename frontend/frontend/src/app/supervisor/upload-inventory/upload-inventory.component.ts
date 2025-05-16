import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upload-inventory',
  templateUrl: './upload-inventory.component.html',
  styleUrls: ['./upload-inventory.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UploadInventoryComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  inventoryFile: File | null = null;
  inventoryFileName: string = '';
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.tsv')) {
      this.inventoryFile = file;
      this.inventoryFileName = file.name;
    } else {
      this.showError('Please select a valid TSV file');
    }
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  uploadInventory(): void {
    if (!this.inventoryFile) {
      this.showError('Please select a file to upload');
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