import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, ToastComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    // Initialize component
  }

  onAddInventory(): void {
    // TODO: Implement add inventory functionality
    this.toastService.show('Add Inventory clicked!', 'info');
  }

  onAddProduct(): void {
    // TODO: Implement add product functionality
    this.toastService.show('Add Product clicked!', 'info');
  }

  products = [
    {
      id: 'P001',
      name: 'Product 1',
      client: 'Client A',
      price: 99.99,
      stock: 50
    },
    {
      id: 'P002',
      name: 'Product 2',
      client: 'Client B',
      price: 49.99,
      stock: 100
    },
    {
      id: 'P003',
      name: 'Product 3',
      client: 'Client C',
      price: 199.99,
      stock: 25
    }
  ];

  editProduct(product: any) {
    // TODO: Implement edit functionality
    console.log('Editing product:', product);
  }

  deleteProduct(product: any) {
    // TODO: Implement delete functionality
    console.log('Deleting product:', product);
  }
} 