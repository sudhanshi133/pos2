import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface LoginResponse {
  success: boolean;
  role?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentRole = new BehaviorSubject<string>('');

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const authData = this.getAuthData();
    if (authData) {
      this.currentRole.next(authData.role);
    }
  }

  private getAuthData() {
    const authData = sessionStorage.getItem('authData');
    return authData ? JSON.parse(authData) : null;
  }

  private setAuthData(role: string) {
    const authData = { role, timestamp: Date.now() };
    sessionStorage.setItem('authData', JSON.stringify(authData));
    this.currentRole.next(role);
  }

  private checkAuthValidity() {
    const authData = this.getAuthData();
    if (!authData) return false;

    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    return now - authData.timestamp < sessionTimeout;
  }

  login(email: string, password: string, role: string): Observable<LoginResponse> {
    // Simulate API call with timeout
    return new Observable(observer => {
      setTimeout(() => {
        // Check for operator credentials
        if (role === 'operator') {
          if (email === 'operator' && password === 'operator') {
            this.setAuthData(role);
            observer.next({ success: true, role });
          } else {
            observer.next({ 
              success: false, 
              message: 'Invalid operator credentials' 
            });
          }
          observer.complete();
          return;
        }

        // Check for supervisor credentials
        if (role === 'supervisor') {
          if (email === 'supervisor' && password === 'supervisor') {
            this.setAuthData(role);
            observer.next({ success: true, role });
          } else {
            observer.next({ 
              success: false, 
              message: 'Invalid supervisor credentials' 
            });
          }
          observer.complete();
          return;
        }

        // For any other role
        observer.next({ 
          success: false, 
          message: 'Invalid role' 
        });
        observer.complete();
      }, 1000);
    });
  }

  logout() {
    sessionStorage.removeItem('authData');
    this.currentRole.next('');
  }

  getCurrentRole(): Observable<string> {
    return this.currentRole.asObservable();
  }

  isAuthorized(requiredRole: string): boolean {
    if (!this.checkAuthValidity()) {
      this.logout();
      return false;
    }
    const currentRole = this.currentRole.value;
    return currentRole === requiredRole;
  }
} 