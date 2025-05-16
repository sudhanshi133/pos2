import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent implements OnInit {
  inventory: any[] = [];
  newInventory: any = { barcode: '', quantity: 0 };
  bulkInventory: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.http.get<any>('/api/inventory/get')
      .subscribe(data => {
        this.inventory = data.inventory;
      });
  }

  updateInventory(barcode: string, quantity: number): void {
    this.http.put(`/api/inventory/update/${barcode}`, { quantity })
      .subscribe(() => {
        this.loadInventory();
      });
  }

  bulkUpdateInventory(): void {
    this.http.put('/api/inventory/bulk-update', this.bulkInventory)
      .subscribe(() => {
        this.loadInventory();
        this.bulkInventory = [];
      });
  }

  addBulkItem(): void {
    this.bulkInventory.push({ barcode: '', quantity: 0 });
  }

  removeBulkItem(index: number): void {
    this.bulkInventory.splice(index, 1);
  }
} 