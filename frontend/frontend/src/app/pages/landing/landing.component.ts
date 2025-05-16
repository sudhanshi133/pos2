import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <div class="landing-content">
        <h1>Welcome to POS System</h1>
        <div class="role-selection">
          <a routerLink="/login" [queryParams]="{role: 'operator'}" class="role-button operator">
            <i class="bi bi-person"></i>
            Operator Login
          </a>
          <a routerLink="/login" [queryParams]="{role: 'supervisor'}" class="role-button supervisor">
            <i class="bi bi-shield-lock"></i>
            Supervisor Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f9fa;
      padding: 1rem;
    }

    .landing-content {
      text-align: center;
      max-width: 600px;
    }

    h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .role-selection {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .role-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      text-decoration: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .role-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .operator {
      background-color: #3498db;
      color: white;
    }

    .supervisor {
      background-color: #2ecc71;
      color: white;
    }

    .role-button i {
      font-size: 1.2rem;
    }
  `]
})
export class LandingComponent {} 