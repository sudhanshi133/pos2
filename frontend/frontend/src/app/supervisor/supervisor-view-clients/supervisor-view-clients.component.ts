import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supervisor-view-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supervisor-view-clients.component.html',
  styleUrls: ['./supervisor-view-clients.component.css']
})
export class SupervisorViewClientsComponent {
  constructor() {
    console.log('SUPERVISOR-VIEW-CLIENTS COMPONENT: Constructor called');
  }

  ngOnInit() {
    console.log('SUPERVISOR-VIEW-CLIENTS COMPONENT: Initialized');
  }

  clients = [
    {
      id: 'C001',
      name: 'Client A',
      email: 'clienta@example.com',
      phone: '123-456-7890',
      address: '123 Main St, City, Country',
      status: 'Active',
      lastOrder: '2024-04-20'
    },
    {
      id: 'C002',
      name: 'Client B',
      email: 'clientb@example.com',
      phone: '987-654-3210',
      address: '456 Oak Ave, City, Country',
      status: 'Active',
      lastOrder: '2024-04-18'
    },
    {
      id: 'C003',
      name: 'Client C',
      email: 'clientc@example.com',
      phone: '555-123-4567',
      address: '789 Pine Rd, City, Country',
      status: 'Inactive',
      lastOrder: '2024-03-15'
    }
  ];

  showEditModal = false;
  selectedClient: any = null;
  editedClient: any = {
    name: '',
    email: '',
    phone: '',
    address: '',
    status: ''
  };

  editClient(client: any) {
    this.selectedClient = client;
    this.editedClient = { ...client };
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.selectedClient = null;
    this.editedClient = {
      name: '',
      email: '',
      phone: '',
      address: '',
      status: ''
    };
  }

  saveChanges() {
    if (this.selectedClient) {
      Object.assign(this.selectedClient, this.editedClient);
      // TODO: Add API call to save changes
      this.closeModal();
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
  }
} 