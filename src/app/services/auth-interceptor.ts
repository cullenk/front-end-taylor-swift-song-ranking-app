import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from './auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private AuthService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('AuthInterceptor called');
        const authToken = this.AuthService.getToken();
        console.log('Token from AuthService:', authToken);
        if (authToken) {
          const authReq = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${authToken}`)
          });
          console.log('Request with auth header:', authReq);
          return next.handle(authReq);
        }
        console.log('Request without auth header:', req);
        return next.handle(req);
      }
      
      

}