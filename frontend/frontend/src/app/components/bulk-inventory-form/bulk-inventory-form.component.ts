import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

interface InventoryForm {
  barcode: string;
  quantity: number;
  message?: string;
}

interface FailedItem {
  barcode: string;
  error: string;
}

interface UploadResult {
  success: InventoryForm[];
  failed: FailedItem[];
}

interface FailureResponse {
  barcode: string;
  error: string;
}

@Component({
  selector: 'app-bulk-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Bulk Update Inventory</h2>
          <button class="close-button" (click)="onClose()">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="actions-container">
            <div class="file-input-container">
              <input 
                type="file" 
                id="csvFile" 
                accept=".csv,.tsv"
                (change)="onFileSelected($event)"
                class="file-input"
                [disabled]="isUploading">
              <label for="csvFile" class="action-button" [class.disabled]="isUploading">
                <i class="bi bi-upload"></i>
                Choose File
              </label>
              <span class="file-status" [ngClass]="{'success': selectedFile}">
                {{ selectedFile ? 'File uploaded: ' + selectedFile.name : 'No file chosen' }}
              </span>
            </div>

            <button type="button" class="action-button" (click)="downloadTemplate()" [disabled]="isUploading">
              <i class="bi bi-download"></i>
              Download Template
            </button>

            <div class="download-buttons" *ngIf="uploadResult && (uploadResult.success.length > 0 || uploadResult.failed.length > 0)">
              <button 
                *ngIf="uploadResult.success.length > 0"
                type="button" 
                class="action-button success-action" 
                (click)="downloadSuccessList()">
                <i class="bi bi-download"></i>
                Download Success List ({{ uploadResult.success.length }})
              </button>

              <button 
                *ngIf="uploadResult.failed.length > 0"
                type="button" 
                class="action-button error-action" 
                (click)="downloadFailureList()">
                <i class="bi bi-download"></i>
                Download Failure List ({{ uploadResult.failed.length }})
              </button>
            </div>

            <button 
              *ngIf="uploadResult" 
              type="button" 
              class="action-button close-action" 
              (click)="onClose()">
              <i class="bi bi-check-circle"></i>
              Close
            </button>
          </div>

          <div class="upload-results" *ngIf="uploadResult">
            <div class="result-section success" *ngIf="uploadResult.success.length > 0">
              <h3>Inventory Updated Successfully ({{ uploadResult.success.length }})</h3>
              <div class="result-list">
                <div class="result-item" *ngFor="let inventory of uploadResult.success">
                  <span class="barcode">{{ inventory.barcode }}</span>
                  <span class="quantity">+{{ inventory.quantity }}</span>
                </div>
              </div>
            </div>

            <div class="result-section failed" *ngIf="uploadResult.failed.length > 0">
              <h3>Failed to Update ({{ uploadResult.failed.length }})</h3>
              <div class="result-list">
                <div class="result-item" *ngFor="let item of uploadResult.failed">
                  <span class="barcode">{{ item.barcode }}</span>
                  <span class="error-message">{{ item.error }}</span>
                </div>
              </div>
            </div>
          </div>
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

    .actions-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .file-input-container {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .file-status {
      color: #666;
      font-size: 0.9rem;
      text-align: center;
      padding: 0.5rem;
      border-radius: 4px;
      background: #f5f5f5;
      transition: all 0.3s ease;
    }

    .file-status.success {
      color: #2e7d32;
      background: #e8f5e9;
    }

    .action-button {
      width: 100%;
      background: #1a237e;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .action-button:hover:not(.disabled) {
      background: #151b60;
      transform: translateY(-1px);
    }

    .action-button.disabled {
      background: #9e9e9e;
      cursor: not-allowed;
      transform: none;
    }

    .action-button.close-action {
      background: #2e7d32;
    }

    .action-button.close-action:hover {
      background: #1b5e20;
    }

    .action-button i {
      font-size: 1.2rem;
    }

    .upload-results {
      margin-top: 1.5rem;
      border-top: 1px solid #eee;
      padding-top: 1.5rem;
    }

    .result-section {
      margin-bottom: 1.5rem;
    }

    .result-section h3 {
      color: #1a237e;
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    .result-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 6px;
    }

    .result-item {
      padding: 0.75rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .result-item:last-child {
      border-bottom: none;
    }

    .barcode {
      font-weight: 500;
      color: #333;
    }

    .quantity {
      color: #2e7d32;
      font-weight: 500;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.9rem;
    }

    .success h3 {
      color: #2e7d32;
    }

    .failed h3 {
      color: #d32f2f;
    }

    .download-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-button.success-action {
      background: #2e7d32;
    }

    .action-button.success-action:hover {
      background: #1b5e20;
    }

    .action-button.error-action {
      background: #d32f2f;
    }

    .action-button.error-action:hover {
      background: #b71c1c;
    }

    .action-button.close-action {
      background: #2e7d32;
      margin-top: 1rem;
    }

    .action-button.close-action:hover {
      background: #1b5e20;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 1rem;
      }
    }
  `]
})
export class BulkInventoryFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  
  selectedFile: File | null = null;
  previewData: InventoryForm[] = [];
  uploadResult: UploadResult | null = null;
  isUploading = false;
  hasSuccessfulUpdates = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  onClose() {
    this.toastService.show('Inventory updated successfully!', 'success');
    this.refresh.emit(); // Emit refresh event to parent
    this.close.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadResult = null; // Reset previous results
      this.isUploading = true;
      this.parseFile(this.selectedFile);
    }
  }

  private parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const headers = lines[0].split('\t').map(header => header.trim());
        
        // Check for required columns
        const requiredColumns = ['Barcode', 'Quantity'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        const columnIndices = {
          barcode: headers.indexOf('Barcode'),
          quantity: headers.indexOf('Quantity')
        };

        this.previewData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split('\t');
            
            // Extract and validate values
            const barcode = values[columnIndices.barcode]?.trim() || '';
            const quantity = parseInt(values[columnIndices.quantity]?.trim() || '0', 10);

            // Validate required fields
            if (!barcode) {
              throw new Error('Barcode cannot be empty');
            }
            if (isNaN(quantity) || quantity < 0) {
              throw new Error(`Invalid quantity for barcode ${barcode}`);
            }

            return {
              barcode,
              quantity
            };
          });

        if (this.previewData.length === 0) {
          throw new Error('No valid data found in the file.');
        }

        // If file is valid, proceed with upload
        this.uploadFile();
      } catch (error) {
        console.error('Error parsing file:', error);
        this.toastService.show(error instanceof Error ? error.message : 'Error parsing file', 'error');
        this.selectedFile = null;
        this.previewData = [];
        this.isUploading = false;
      }
    };

    reader.onerror = () => {
      this.toastService.show('Error reading file', 'error');
      this.selectedFile = null;
      this.previewData = [];
      this.isUploading = false;
    };

    reader.readAsText(file);
  }

  private uploadFile() {
    if (!this.selectedFile || this.previewData.length === 0) {
      this.toastService.show('Please select a valid file first', 'error');
      this.isUploading = false;
      return;
    }

    this.productService.bulkUpdateInventory(this.previewData).subscribe({
      next: (response: any) => {
        console.log('Upload response:', response);
        
        // Initialize uploadResult with empty arrays
        this.uploadResult = {
          success: [],
          failed: []
        };

        // Handle the response format with successList and failureList
        if (response) {
          if (response.successList) {
            this.uploadResult.success = Array.isArray(response.successList) ? response.successList : [response.successList];
          }
          if (response.failureList) {
            // Transform failureList to match the expected format
            this.uploadResult.failed = Array.isArray(response.failureList) 
              ? response.failureList.map((item: FailureResponse) => ({
                  barcode: item.barcode || '',
                  error: item.error || 'Failed to update'
                }))
              : [{
                  barcode: response.failureList.barcode || '',
                  error: response.failureList.error || 'Failed to update'
                }];
          }
        }

        console.log('Processed uploadResult:', this.uploadResult);
        
        // If there are any successful updates, set a flag
        if (this.uploadResult.success.length > 0) {
          this.hasSuccessfulUpdates = true;
        }
        
        if (this.uploadResult.failed.length > 0) {
          this.toastService.show(`${this.uploadResult.failed.length} inventory items failed to update`, 'error');
        }
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Error updating inventory:', error);
        let errorMessage = 'Failed to update inventory';
        
        if (error.status === 400) {
          errorMessage += ': Invalid data format';
        } else if (error.status === 404) {
          errorMessage += ': One or more products not found';
        } else if (error.status === 0) {
          errorMessage += ': Network error. Please check your connection';
        }
        
        this.toastService.show(errorMessage, 'error');
        this.isUploading = false;
      }
    });
  }

  downloadTemplate() {
    this.productService.downloadInventoryTemplate().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory_template.tsv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.toastService.show('Template downloaded successfully', 'success');
      },
      error: (error) => {
        console.error('Error downloading template:', error);
        this.toastService.show('Failed to download template', 'error');
      }
    });
  }

  downloadSuccessList() {
    if (!this.uploadResult?.success.length) return;

    const headers = ['Barcode', 'Quantity', 'Message'];
    const csvContent = [
      headers.join('\t'),
      ...this.uploadResult.success.map(item => {
        console.log('Success item:', item);
        return [
          item.barcode || '',
          item.quantity || '',
          item.message || 'Successfully updated'
        ].join('\t');
      })
    ].join('\n');

    this.downloadFile(csvContent, 'successful_inventory.tsv');
  }

  downloadFailureList() {
    if (!this.uploadResult?.failed.length) return;

    const headers = ['Barcode', 'Error Message'];
    const csvContent = [
      headers.join('\t'),
      ...this.uploadResult.failed.map((item: FailedItem) => {
        console.log('Failed item:', item);
        return [
          item.barcode || '',
          item.error || 'Failed to update'
        ].join('\t');
      })
    ].join('\n');

    this.downloadFile(csvContent, 'failed_inventory.tsv');
  }

  private downloadFile(content: string, filename: string) {
    try {
      const blob = new Blob([content], { type: 'text/tab-separated-values' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('File downloaded successfully:', filename);
    } catch (error) {
      console.error('Error downloading file:', error);
      this.toastService.show('Error downloading file', 'error');
    }
  }
} 