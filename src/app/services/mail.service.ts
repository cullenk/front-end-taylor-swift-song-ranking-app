// mail.service.ts
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'http://localhost:3000/api/sendMail'; 

  constructor(private http: HttpClient) {}

  sendWelcomeEmail(email: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-welcome-email`, { email, username });
  }

  sendContactForm(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-contact-form`, formData);
  }
}