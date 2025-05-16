import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    console.log('ToastService: Showing toast', { message, type, duration });
    this.toastSubject.next({ message, type, duration });
    
    if (duration > 0) {
      setTimeout(() => {
        console.log('ToastService: Auto-hiding toast');
        this.hide();
      }, duration);
    }
  }

  hide() {
    console.log('ToastService: Hiding toast');
    this.toastSubject.next(null);
  }

  success(message: string, duration: number = 3000) {
    console.log('ToastService: Success toast called', { message, duration });
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 3000) {
    console.log('ToastService: Error toast called', { message, duration });
    this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3000) {
    console.log('ToastService: Info toast called', { message, duration });
    this.show(message, 'info', duration);
  }
} 