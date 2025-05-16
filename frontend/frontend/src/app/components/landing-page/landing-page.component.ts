import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <div class="landing-content">
        <h1>Increff's POS System</h1>
        <p class="subtitle">Choose your role to continue</p>
        
        <div class="login-options">
          <a routerLink="/login" [queryParams]="{role: 'operator'}" class="login-card">
            <div class="card-content">
              <i class="bi bi-person-circle"></i>
              <h2>Operator</h2>
              <p>Manage daily operations and orders</p>
            </div>
          </a>

          <a routerLink="/login" [queryParams]="{role: 'supervisor'}" class="login-card">
            <div class="card-content">
              <i class="bi bi-shield-lock"></i>
              <h2>Supervisor</h2>
              <p>Access advanced management features</p>
            </div>
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
      background: linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FFD700 100%);
      padding: 2rem;
    }

    .landing-content {
      text-align: center;
      max-width: 800px;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 3.5rem;
      color: #FF8C00;
      margin-bottom: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      display: inline-block;
      padding-bottom: 0.5rem;
    }

    h1::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 3px;
      background-color: #FF8C00;
      border-radius: 2px;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #666666;
      margin-bottom: 3rem;
      font-weight: 500;
    }

    .login-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .login-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 2rem;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;
    }

    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(255, 140, 0, 0.2);
      border-color: #FF8C00;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .card-content i {
      font-size: 2.5rem;
      color: #FF8C00;
    }

    .login-card h2 {
      color: #1A1A1A;
      font-size: 1.5rem;
      margin: 0;
      font-weight: 600;
    }

    .login-card p {
      color: #666666;
      margin: 0;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .login-options {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 2.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .landing-content {
        padding: 2rem;
      }
    }
  `]
})
export class LandingPageComponent {}
