import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface LoginResponse {
  success: boolean;
  role?: string;
  message?: string;
}

interface AuthData {
  role: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentRole = new BehaviorSubject<string>('');
  
  // Define valid credentials
  private readonly VALID_CREDENTIALS = {
    operator: {
      username: 'operator123',
      password: 'operator123'
    },
    supervisor: {
      username: 'supervisor123',
      password: 'supervisor123'
    }
  };

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const authData = this.getAuthData();
    if (authData) {
      this.currentRole.next(authData.role);
    }
  }

  private getAuthData(): AuthData | null {
    const authData = localStorage.getItem('authData');
    return authData ? JSON.parse(authData) : null;
  }

  private setAuthData(role: string) {
    const authData: AuthData = { role, timestamp: Date.now() };
    localStorage.setItem('authData', JSON.stringify(authData));
    this.currentRole.next(role);
  }

  private checkAuthValidity() {
    const authData = this.getAuthData();
    if (!authData) return false;

    const now = Date.now();
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    return now - authData.timestamp < sessionTimeout;
  }

  login(username: string, password: string, role: string): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Get the valid credentials for the selected role
        const validCreds = this.VALID_CREDENTIALS[role as keyof typeof this.VALID_CREDENTIALS];
        
        if (!validCreds) {
          observer.next({ 
            success: false, 
            message: 'Invalid role selected' 
          });
          observer.complete();
          return;
        }

        // Check if credentials match exactly
        if (username === validCreds.username && password === validCreds.password) {
          this.setAuthData(role);
          observer.next({ success: true, role });
        } else {
          observer.next({ 
            success: false, 
            message: 'Invalid username or password' 
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  logout() {
    localStorage.removeItem('authData');
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

  isLoggedIn(): boolean {
    return this.checkAuthValidity();
  }
} 