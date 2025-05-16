import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-supervisor-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>User Management</h1>
        <div class="header-actions">
          <button routerLink="/supervisor/dashboard" class="back-button">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <button class="add-button">
            <i class="fas fa-plus"></i> Add User
          </button>
        </div>
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span class="status-badge" [ngClass]="user.status">
                  {{ user.status }}
                </span>
              </td>
              <td>
                <button class="action-button edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
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

    h1 {
      color: #2e7d32;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .back-button, .add-button {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }

    .back-button {
      background-color: #2e7d32;
      color: white;
    }

    .add-button {
      background-color: #1976d2;
      color: white;
    }

    .back-button:hover {
      background-color: #1b5e20;
    }

    .add-button:hover {
      background-color: #1565c0;
    }

    .users-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #c62828;
    }

    .action-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0 0.25rem;
    }

    .action-button.edit {
      color: #1976d2;
    }

    .action-button.delete {
      color: #c62828;
    }

    .action-button:hover {
      background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
      .users-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
      }

      .users-table {
        overflow-x: auto;
      }

      table {
        min-width: 600px;
      }
    }
  `]
})
export class UsersComponent {
  users = [
    { name: 'John Doe', email: 'john@example.com', role: 'Operator', status: 'active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Client', status: 'active' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Operator', status: 'inactive' }
  ];
} 