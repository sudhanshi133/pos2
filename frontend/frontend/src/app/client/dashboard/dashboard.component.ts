import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="client-dashboard">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Client Dashboard</h1>
          <div class="user-info">
            <span class="welcome-text">Welcome, Client</span>
            <button class="logout-button" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="dashboard-grid">
          <!-- Orders Card -->
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="bi bi-cart-check"></i>
            </div>
            <h2>My Orders</h2>
            <p>View and track your orders</p>
            <a routerLink="/client/orders" class="card-button">
              <i class="bi bi-arrow-right"></i>
              View Orders
            </a>
          </div>

          <!-- Profile Card -->
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="bi bi-person"></i>
            </div>
            <h2>My Profile</h2>
            <p>Manage your account information</p>
            <a routerLink="/client/profile" class="card-button">
              <i class="bi bi-arrow-right"></i>
              View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-dashboard {
      min-height: 100vh;
      background: #f8fafc;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      font-size: 1rem;
      opacity: 0.9;
    }

    .logout-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .card-icon i {
      font-size: 1.5rem;
      color: white;
    }

    .dashboard-card h2 {
      color: #2d3748;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }

    .dashboard-card p {
      color: #718096;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .card-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #48bb78;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .card-button:hover {
      color: #38a169;
      transform: translateX(5px);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .user-info {
        flex-direction: column;
      }

      .dashboard-content {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
} 