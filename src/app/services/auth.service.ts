import { Observable, Subject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from './auth-model';
import { ToastService } from './toast-service.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private 'token': string;
  private authenticatedSub = new Subject<boolean>();
  private isAuthenticated = false;
  private logoutTimer: any;

  getIsAuthenticated(){
    return this.isAuthenticated;
}
getAuthenticatedSub(){
    return this.authenticatedSub.asObservable();
}
  getToken(){
    return this.token;
  }

  constructor(private http: HttpClient, private router: Router, private toastService: ToastService) {}

//   createNewUser(username: string, password: string){
//     const authData: AuthModel = {username: username, password: password};
//     this.http.post('http://localhost:3000/signup/', authData).subscribe(res => {
//       console.log(res)
//     });
//   }

  createNewUser(username: string, password: string){
    const authData: AuthModel = {username: username, password: password};
    this.http.post('http://localhost:3000/signup/', authData).pipe(
    tap(() => {
      console.log('Account created successfully!');
      let successMessage = 'Account created. Please return to login';
      this.toastService.showSuccess(successMessage);
    }),
    catchError(error => {
      let errorMessage = 'Username already exists';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      this.toastService.showError(errorMessage);
      return throwError(error);
    })
    ).subscribe();
}

  loginUser(username: string, password: string){
    const authData: AuthModel = {username: username, password: password};

    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/login/', authData)
        .subscribe(res => {
            this.token = res.token;
            if(this.token){
                this.authenticatedSub.next(true);
                this.isAuthenticated = true;
                this.router.navigate(['/user/userHome']);
                this.logoutTimer = setTimeout(() => {this.logout()}, res.expiresIn * 1000);
                const now = new Date();
                const expiresDate = new Date(now.getTime() + (res.expiresIn * 1000));
                this.storeLoginDetails(this.token, expiresDate);
            }
        })
}

logout(){
    this.token = '';
    this.isAuthenticated = false;
    this.authenticatedSub.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.logoutTimer);
    this.clearLoginDetails();
}

storeLoginDetails(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationDate.toISOString());
}

clearLoginDetails(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
}

getLocalStorageData(){
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');

    if(!token || !expiresIn){
        return;
    }
    return {
        'token': token,
        'expiresIn': new Date(expiresIn)
    }
}

authenticateFromLocalStorage(){
    const localStorageData = this.getLocalStorageData();
    if(localStorageData){
        const now = new Date();
        const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();

        if(expiresIn > 0){
            this.token = localStorageData.token;
            this.isAuthenticated = true;
            this.authenticatedSub.next(true);
            this.logoutTimer.setTimeout(expiresIn / 1000);
        }
    }
}
}

  