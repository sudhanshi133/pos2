import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>{{ role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Login' }}</h1>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              class="form-control"
            />
          </div>

          <button type="submit" [disabled]="!loginForm.form.valid" class="login-button">
            Login
          </button>
        </form>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #FFFFFF;
      padding: 1rem;
    }

    .login-card {
      background: #F5F5F5;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      color: #D32F2F;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #1A1A1A;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: #FFFFFF;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #D32F2F;
    }

    .login-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #D32F2F;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font-weight: 500;
    }

    .login-button:hover:not(:disabled) {
      background-color: #B71C1C;
    }

    .login-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #D32F2F;
      text-align: center;
      margin-top: 1rem;
      font-weight: 500;
    }
  `]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || '';
    });
  }

  onSubmit() {
    this.authService.login(this.username, this.password, this.role).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate([`/${this.role}/dashboard`]);
        } else {
          this.error = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.error = 'An error occurred during login';
        console.error('Login error:', error);
      }
    });
  }
} 