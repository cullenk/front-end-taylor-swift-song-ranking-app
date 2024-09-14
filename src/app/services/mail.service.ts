import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendContactFormEmail(formData: any): Observable<any> {
    console.log('Sending contact form email');
    return this.http.post(`${this.apiUrl}/sendMail/sendMail`, { ...formData, type: 'contact' });
  }
}