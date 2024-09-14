import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'http://localhost:3000/api/sendMail/sendMail'; 

  constructor(private http: HttpClient) {}

  sendContactFormEmail(formData: any): Observable<any> {
    console.log('Sending contact form email');
    return this.http.post(`${this.apiUrl}`, { ...formData, type: 'contact' });
  }
}