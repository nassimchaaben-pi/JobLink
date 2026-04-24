import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5000/api/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly authState: AuthStateService
  ) {}

  post<T>(path: string, body: unknown, authenticated = false): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, {
      headers: this.buildHeaders(authenticated)
    });
  }

  get<T>(path: string, authenticated = false): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      headers: this.buildHeaders(authenticated)
    });
  }

  put<T>(path: string, body: unknown, authenticated = false): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, {
      headers: this.buildHeaders(authenticated)
    });
  }

  patch<T>(path: string, body: unknown, authenticated = false): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, {
      headers: this.buildHeaders(authenticated)
    });
  }

  private buildHeaders(authenticated: boolean): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (authenticated) {
      const token = this.authState.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }
}
