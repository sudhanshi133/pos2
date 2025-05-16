import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #FFFFFF;
      padding: 2rem;
    }

    .header {
      background: white;
      color: #1a237e;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      border-radius: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 5px solid #D32F2F;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo {
      height: 120px;
      width: 120px;
      object-fit: contain;
    }

    .system-title {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(45deg, #1a237e, #0d47a1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 1px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      color: #1a237e;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .logout-button {
      background: #1a237e;
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .logout-button:hover {
      background: #0d47a1;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
    }

    .logout-button i {
      font-size: 1.2rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
      border-top: 4px solid #1a237e;
    }

    .dashboard-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, rgba(26, 35, 126, 0.1), rgba(13, 71, 161, 0.1));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(26, 35, 126, 0.2);
    }

    .dashboard-card:hover::before {
      opacity: 1;
    }

    .card-icon {
      font-size: 3rem;
      background: linear-gradient(45deg, #1a237e, #0d47a1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1.5rem;
      padding: 1rem;
      border-radius: 12px;
      background-color: rgba(26, 35, 126, 0.1);
      display: inline-block;
    }

    .card-content h2 {
      color: #1a237e;
      margin-bottom: 0.75rem;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .card-content p {
      color: #6c757d;
      margin: 0;
      font-size: 1.1rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1.5rem;
      }

      .user-info {
        flex-direction: column;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-container {
        padding: 1rem;
      }
    }
  `]
})
export class OperatorDashboardComponent implements OnInit {
  username: string = 'Operator';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = 'Operator';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 