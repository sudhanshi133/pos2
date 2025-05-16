import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-view-clients',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    HttpClientModule, 
    ToastComponent,
    NavbarComponent
  ],
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss']
})
export class ViewClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;

  // Modal state
  showAddModal = false;
  showEditModal = false;
  selectedClient: Client | null = null;
  originalClientName: string = '';
  newClient: Client = { clientName: '' };

  constructor(
    private clientService: ClientService,
    private toastService: ToastService
  ) {
    console.log('VIEW-CLIENTS COMPONENT: Constructor called');
  }

  ngOnInit() {
    console.log('VIEW-CLIENTS COMPONENT: Initialized');
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = null;
    console.log('Loading clients for page:', this.currentPage);

    this.clientService.getAllClients(this.currentPage).subscribe({
      next: (response) => {
        console.log('Received response:', JSON.stringify(response, null, 2));
        this.clients = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        
        console.log('Updated component state:', {
          clients: this.clients,
          totalItems: this.totalItems,
          totalPages: this.totalPages,
          currentPage: this.currentPage,
          itemsInCurrentPage: this.clients.length,
          hasMorePages: this.clients.length === 10
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.error = 'Failed to load clients. Please try again later.';
        this.loading = false;
      }
    });
  }

  nextPage() {
    console.log('Next page clicked - START');
    console.log('Current page before increment:', this.currentPage);
    console.log('Total pages:', this.totalPages);
    console.log('Items in current page:', this.clients.length);
    
    // If we have a full page (10 items), there might be more pages
    if (this.clients.length === 10) {
      this.currentPage++;
      console.log('Current page after increment:', this.currentPage);
      console.log('Will make request to:', `http://localhost:9001/pos/api/client/get?page=${this.currentPage}&size=10`);
      this.loadClients();
    } else {
      console.log('Cannot move to next page - already at last page');
    }
    console.log('Next page clicked - END');
  }

  previousPage() {
    console.log('Previous page clicked');
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('Moving to previous page:', this.currentPage);
      this.loadClients();
    } else {
      console.log('Cannot move to previous page - already at first page');
    }
  }

  openAddModal() {
    this.newClient = { clientName: '' };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newClient = { clientName: '' };
  }

  addClient() {
    console.log('Adding client:', this.newClient);
    
    if (!this.newClient.clientName.trim()) {
      console.log('Client name is empty, showing error toast');
      this.toastService.error('Please enter a client name');
      return;
    }

    this.loading = true;
    console.log('Calling clientService.addClient');
    this.clientService.addClient({ clientName: this.newClient.clientName.trim() }).subscribe({
      next: (response) => {
        console.log('Client added successfully:', response);
        this.toastService.success('Client added successfully');
        this.closeAddModal();
        this.loadClients();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error adding client:', error);
        this.toastService.error(error.error?.message || 'Failed to add client');
        this.loading = false;
      }
    });
  }

  editClient(client: Client) {
    this.selectedClient = { ...client };
    this.originalClientName = client.clientName;
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.selectedClient = null;
    this.originalClientName = '';
  }

  saveChanges() {
    if (!this.selectedClient?.clientName.trim()) {
      this.toastService.error('Please enter a client name');
      return;
    }

    this.loading = true;
    console.log('Updating client with:');
    console.log('Original name (URL parameter):', this.originalClientName);
    console.log('New name (Request body):', this.selectedClient.clientName.trim());
    console.log('Full URL:', `http://localhost:9001/pos/api/client/update/${this.originalClientName}`);
    
    const updatedClient = {
      clientName: this.selectedClient.clientName.trim()
    };
    
    this.clientService.updateClient(
      this.originalClientName,
      updatedClient
    ).subscribe({
      next: () => {
        this.toastService.success('Client updated successfully');
        this.closeModal();
        this.loadClients();
      },
      error: (error) => {
        this.toastService.error(error.error?.message || 'Failed to update client');
        this.loading = false;
      }
    });
  }
} 