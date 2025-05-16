import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-links">
          <ng-container *ngIf="isOperator">
            <a routerLink="/operator/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-speedometer2"></i>
              Dashboard
            </a>
            <a routerLink="/operator/clients" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-people"></i>
              Clients
            </a>
            <a routerLink="/operator/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-box"></i>
              Products
            </a>
            <a routerLink="/operator/orders" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-cart"></i>
              Orders
            </a>
          </ng-container>
          <ng-container *ngIf="isSupervisor">
            <a routerLink="/supervisor/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-speedometer2"></i>
              Dashboard
            </a>
            <a routerLink="/supervisor/clients" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-people"></i>
              Clients
            </a>
            <a routerLink="/supervisor/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-box"></i>
              Products
            </a>
            <a routerLink="/supervisor/orders" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-cart"></i>
              Orders
            </a>
            <a routerLink="/supervisor/sales-summary" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-graph-up"></i>
              Sales Summary
            </a>
            <a routerLink="/supervisor/daily-summary" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-calendar-check"></i>
              Daily Summary
            </a>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      justify-content: center;
    }

    .nav-links a {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: relative;
      overflow: hidden;
      background: transparent;
    }

    .nav-links a i {
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .nav-links a:hover {
      color: #fff;
      background: linear-gradient(45deg, #007bff,rgb(179, 0, 9));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .nav-links a:hover i {
      transform: scale(1.1);
      color: #fff;
    }

    .nav-links a.active {
      color: #fff;
      background: linear-gradient(45deg, #007bff,);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .nav-links a.active i {
      color: #fff;
    }

    @media (max-width: 768px) {
      .nav-content {
        padding: 0 1rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .nav-links a {
        padding: 0.75rem;
      }

      .nav-links a span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  isOperator = false;
  isSupervisor = false;

  constructor(private router: Router) {
    // Check the current URL to determine the role
    const url = this.router.url;
    this.isOperator = url.startsWith('/operator');
    this.isSupervisor = url.startsWith('/supervisor');
  }
} 