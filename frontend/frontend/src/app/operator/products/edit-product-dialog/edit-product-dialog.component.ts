import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Product</h2>
    <mat-dialog-content>
      <form #editForm="ngForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput [(ngModel)]="product.productName" name="productName" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Barcode</mat-label>
          <input matInput [(ngModel)]="product.barcode" name="barcode" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Client Name</mat-label>
          <input matInput [(ngModel)]="product.clientName" name="clientName" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>MRP</mat-label>
          <input matInput type="number" [(ngModel)]="product.mrp" name="mrp" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="product.quantity" name="quantity" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput [(ngModel)]="product.url" name="url">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!editForm.form.valid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class EditProductDialogComponent {
  product: Product;

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.product = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.product);
  }
} 