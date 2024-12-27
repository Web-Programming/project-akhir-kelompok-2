import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

interface AuthResponse {
  token: string;
  isAdmin: boolean;
  message: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      name: user.name,
      email: user.email,
      password: user.password
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('isAdmin', String(response.isAdmin));
            localStorage.setItem('userId', response.userId);
          }
        })
      );
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('isAdmin') === 'true';
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }
}
