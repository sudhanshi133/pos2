import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>My Profile</h1>
        <button routerLink="/client/dashboard" class="back-button">
          <i class="fas fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>

      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            <i class="fas fa-user"></i>
          </div>
          <h2>John Doe</h2>
          <p class="email">john.doe&#64;example.com</p>
        </div>

        <div class="profile-info">
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <span>+1 (555) 123-4567</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>123 Main St, City, Country</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Member since: January 2024</span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="edit-button">
            <i class="fas fa-edit"></i> Edit Profile
          </button>
          <button class="password-button">
            <i class="fas fa-key"></i> Change Password
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
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

    .back-button {
      background-color: #2e7d32;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .back-button:hover {
      background-color: #1b5e20;
    }

    .profile-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 100px;
      height: 100px;
      background-color: #e8f5e9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .avatar i {
      font-size: 3rem;
      color: #2e7d32;
    }

    h2 {
      color: #2e7d32;
      margin: 0 0 0.5rem;
    }

    .email {
      color: #666;
      margin: 0;
    }

    .profile-info {
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .info-item i {
      color: #2e7d32;
      width: 20px;
    }

    .profile-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .edit-button, .password-button {
      background-color: #2e7d32;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .edit-button:hover, .password-button:hover {
      background-color: #1b5e20;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .profile-actions {
        flex-direction: column;
      }

      .edit-button, .password-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ProfileComponent {
  // Component logic will go here
} 