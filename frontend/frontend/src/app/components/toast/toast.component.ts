import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toast" 
         class="toast" 
         [class.success]="toast.type === 'success'"
         [class.error]="toast.type === 'error'"
         [class.info]="toast.type === 'info'"
         (click)="toastService.hide()">
      <div class="toast-content">
        <div class="toast-icon">
          <i *ngIf="toast.type === 'success'" class="bi bi-check-circle-fill"></i>
          <i *ngIf="toast.type === 'error'" class="bi bi-x-circle-fill"></i>
          <i *ngIf="toast.type === 'info'" class="bi bi-info-circle-fill"></i>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
      <div class="toast-progress"></div>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      min-width: 300px;
      max-width: 400px;
      background: white;
      border-radius: 12px;
      padding: 16px;
      color: #2c3e50;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease forwards;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toast-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .toast-message {
      flex-grow: 1;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .success {
      background-color: #27ae60;
      color: white;
    }

    .success .toast-icon {
      color: white;
    }

    .success .toast-message {
      color: white;
    }

    .error {
      background-color: #c0392b;
      color: white;
    }

    .error .toast-icon {
      color: white;
    }

    .error .toast-message {
      color: white;
    }

    .info {
      border-left: 4px solid #3498db;
    }

    .info .toast-icon {
      color: #3498db;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.5);
      animation: progress 3s linear forwards;
    }

    @keyframes slideIn {
      from {
        transform: translateX(120%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(120%);
        opacity: 0;
      }
    }

    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .toast:hover {
      transform: translateX(-5px);
      transition: transform 0.2s ease;
    }

    @media (max-width: 768px) {
      .toast {
        top: 10px;
        right: 10px;
        left: 10px;
        min-width: auto;
        max-width: none;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: Toast | null = null;
  private subscription: Subscription;

  constructor(public toastService: ToastService) {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      console.log('Toast received:', toast);
      this.toast = toast;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
} 