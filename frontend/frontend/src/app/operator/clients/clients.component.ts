import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="clients-container">
      <div class="header">
        <h1>Clients</h1>
      </div>

      <div class="clients-grid">
        <div class="client-card" *ngFor="let client of clients; let i = index">
          <div class="card-content">
            <div class="client-number">{{ (currentPage * 10) + i + 1 }}</div>
            <div class="client-name">{{ client.clientName }}</div>
          </div>
        </div>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <div class="pagination-info">
          <span>Page {{ currentPage + 1 }}</span>
        </div>
        <div class="pagination-buttons">
          <button 
            class="pagination-button" 
            [disabled]="currentPage === 0"
            (click)="onPageChange(currentPage - 1)"
            title="Previous Page">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button 
            class="pagination-button" 
            [disabled]="currentPage === totalPages - 1"
            (click)="onPageChange(currentPage + 1)"
            title="Next Page">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .clients-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      color: #2c3e50;
      font-size: 2rem;
      margin: 0;
    }

    .back-button {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.3s ease;
    }

    .back-button:hover {
      color: #2980b9;
    }

    .clients-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      padding: 1rem 0;
      margin-bottom: 2rem;
    }

    .client-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }

    .client-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .card-content {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .client-number {
      background: #3498db;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .client-name {
      font-size: 1.1rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
      padding: 15px;
      background: #1a237e;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
    }

    .pagination-info {
      font-size: 1.1rem;
      color: white;
      font-weight: 500;
    }

    .pagination-buttons {
      display: flex;
      gap: 10px;
    }

    .pagination-button {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .pagination-button:hover:not([disabled]) {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .pagination-button:disabled {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.3);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .pagination-button i {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .clients-grid {
        grid-template-columns: 1fr;
      }

      .pagination {
        padding: 10px;
        margin-top: 20px;
      }

      .pagination-button {
        width: 36px;
        height: 36px;
      }

      .pagination-info {
        font-size: 1rem;
      }
    }
  `]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  currentPage: number = 0;
  totalPages: number = 1;
  loading = false;
  showAddModal = false;
  showEditModal = false;
  selectedClient: Client | null = null;
  newClient: Client = { clientName: '' };

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients(this.currentPage).subscribe({
      next: (response) => {
        console.log('Clients loaded:', response);
        this.clients = response.content;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadClients();
  }

  getClientRows(): Client[][] {
    const rows: Client[][] = [];
    for (let i = 0; i < this.clients.length; i += 2) {
      const row = this.clients.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  }
}
