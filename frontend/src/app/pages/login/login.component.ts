import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>{{ role === 'operator' ? 'Operator Login' : 'Supervisor Login' }}</h2>
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username" 
              required 
              class="form-control"
              placeholder="Enter your username"
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              required 
              class="form-control"
              placeholder="Enter your password"
            >
          </div>
          <button type="submit" class="login-button">Login</button>
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
    }

    .login-box {
      background: white;
      padding: 3rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }

    .login-box h2 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: #2c3e50;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .form-control {
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1.1rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #2c3e50;
    }

    .form-control::placeholder {
      color: #adb5bd;
    }

    .login-button {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 1rem;
    }

    .login-button:hover {
      background-color: #34495e;
    }

    .error-message {
      color: #e74c3c;
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  role: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'operator';
    });
  }

  onSubmit() {
    this.error = '';
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