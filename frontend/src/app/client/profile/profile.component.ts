import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>My Profile</h1>
        <a routerLink="/client/dashboard" class="back-button">
          <i class="bi bi-arrow-left"></i>
          Back to Dashboard
        </a>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <h2>{{ profile.name }}</h2>
            <p class="email">{{ profile.email }}</p>
          </div>

          <div class="profile-details">
            <div class="detail-group">
              <label>Phone Number</label>
              <input type="tel" [(ngModel)]="profile.phone" placeholder="Enter phone number">
            </div>

            <div class="detail-group">
              <label>Address</label>
              <textarea [(ngModel)]="profile.address" placeholder="Enter your address" rows="3"></textarea>
            </div>

            <div class="detail-group">
              <label>Company Name</label>
              <input type="text" [(ngModel)]="profile.company" placeholder="Enter company name">
            </div>

            <div class="detail-group">
              <label>GST Number</label>
              <input type="text" [(ngModel)]="profile.gst" placeholder="Enter GST number">
            </div>
          </div>

          <div class="profile-actions">
            <button class="save-button" (click)="saveProfile()">
              Save Changes
            </button>
          </div>
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
      color: #2d3748;
      margin: 0;
      font-size: 2rem;
    }

    .back-button {
      color: #48bb78;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .back-button:hover {
      color: #38a169;
    }

    .profile-content {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .profile-header {
      background: #f8fafc;
      padding: 2rem;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }

    .avatar {
      width: 100px;
      height: 100px;
      margin: 0 auto 1rem;
      background: #48bb78;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar i {
      font-size: 3rem;
      color: white;
    }

    h2 {
      color: #2d3748;
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
    }

    .email {
      color: #718096;
      margin: 0;
    }

    .profile-details {
      padding: 2rem;
    }

    .detail-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      color: #4a5568;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #48bb78;
    }

    .profile-actions {
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: right;
    }

    .save-button {
      background: #48bb78;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .save-button:hover {
      background: #38a169;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .profile-details {
        padding: 1.5rem;
      }

      .profile-actions {
        padding: 1rem;
      }
    }
  `]
})
export class ProfileComponent {
  // Sample data - replace with actual data from your service
  profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, City, State - 123456',
    company: 'ABC Corporation',
    gst: 'GST123456789'
  };

  saveProfile() {
    // Implement profile update logic
    console.log('Saving profile:', this.profile);
  }
} 