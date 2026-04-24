import { Injectable } from '@angular/core';

type UserRole = 'candidate' | 'recruiter' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly tokenKey = 'joblink_token';
  private readonly roleKey = 'joblink_role';
  private readonly emailKey = 'joblink_email';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    const role = localStorage.getItem(this.roleKey);
    if (role === 'candidate' || role === 'recruiter' || role === 'admin') {
      return role;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  setSession(token: string, role: UserRole): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
  }

  setEmail(email: string): void {
    localStorage.setItem(this.emailKey, email);
  }

  getEmail(): string {
    return localStorage.getItem(this.emailKey) || '';
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.emailKey);
  }
}
