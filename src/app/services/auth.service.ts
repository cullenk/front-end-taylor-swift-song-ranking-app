import { Observable, Subject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthModelLogin } from './auth-model-login';
import { AuthModelCreate } from './auth-model-create';
import { ToastService } from './toast-service.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private authenticatedSub = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
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
    return this.http.post('http://localhost:3000/api/auth/signup', authData).pipe(
      tap((response: any) => {
        console.log('Account created successfully!');
        const successMessage = response.emailSent 
          ? 'Account created. Please check your email for a welcome message.' 
          : 'Account created. Please return to login.';
        this.toastService.showSuccess(successMessage);
      }),
      catchError(error => {
        let errorMessage = 'An error occurred during signup';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.toastService.showError(errorMessage);
        return throwError(error);
      })
    );
  }

  loginUser(username: string, password: string): Observable<any> {
    const authData: AuthModelLogin = { username, password };

    return this.http.post<{ token: string; expiresIn: number, user: { username: string } }>('http://localhost:3000/api/auth/login', authData)
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
          this.toastService.showError('Login failed. Please check your credentials.');
          return throwError(error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/reset-password', { token, newPassword });
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
