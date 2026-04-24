import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthUser, Role } from './types';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly api: ApiService) {}

  register(email: string, password: string, role: Role): Observable<{ user: AuthUser }> {
    return this.api.post('/auth/register', { email, password, role });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.api.post('/auth/login', { email, password });
  }

  me(): Observable<{ user: AuthUser }> {
    return this.api.get('/auth/me', true);
  }
}
