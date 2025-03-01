import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthModelLogin } from './auth-model-login';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private authenticatedSub = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenExpirationTimer: any;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthenticatedSub() {
    return this.authenticatedSub.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  createNewUser(username: string, email: string, password: string): Observable<any> {
    const authData = { username, email, password };
    return this.http.post(`${this.apiUrl}/auth/signup`, authData).pipe(
      tap((response: any) => {
        console.log('Account created successfully!');
      }),
      catchError(error => {
        let errorMessage = 'An error occurred during signup';
        let errorField = '';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          errorField = error.error.field;
        }
        console.error('Signup error:', error);
        return throwError(() => ({ message: errorMessage, field: errorField }));
      })
    );
  }

  loginUser(username: string, password: string): Observable<any> {
    const authData: AuthModelLogin = { username, password };

    return this.http.post<{ token: string; expiresIn: number, user: { username: string } }>(`${this.apiUrl}/auth/login`, authData)
      .pipe(
        tap(response => {
          if (response.token) {
            this.token = response.token;
            this.isAuthenticated = true;
            this.authenticatedSub.next(true);
            this.router.navigate(['/user/userHome']);
            this.setAuthTimer(response.expiresIn);
            const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
            this.storeLoginDetails(this.token, expirationDate, response.user.username);
          }
        }),
        catchError(error => {
          console.error('Login failed:', error);
          // this.toastService.showError('Login failed. Please check your credentials.');
          return throwError(error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authenticatedSub.next(false);
    this.router.navigate(['/']);
    this.clearAuthTimer();
    this.clearLoginDetails();
  }

  private setAuthTimer(duration: number) {
    this.clearAuthTimer();
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  storeLoginDetails(token: string, expirationDate: Date, username: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', expirationDate.toISOString());
      localStorage.setItem('username', username);
    }
  }

  clearLoginDetails() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('username');
    }
  }

  getLocalStorageData() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const expiresIn = localStorage.getItem('expiresIn');
      const username = localStorage.getItem('username');

      if (!token || !expiresIn || !username) {
        return null;
      }
      return {
        token: token,
        expiresIn: new Date(expiresIn),
        username: username
      };
    }
    return null;
  }

  authenticateFromLocalStorage(): Promise<void>{
    return new Promise((resolve) => {
    const localStorageData = this.getLocalStorageData();
    if (localStorageData) {
      const now = new Date();
      const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();

      if (expiresIn > 0) {
        this.token = localStorageData.token;
        this.isAuthenticated = true;
        this.authenticatedSub.next(true);
        this.setAuthTimer(expiresIn / 1000);
      }
    }
  })
}

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
