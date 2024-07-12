import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../interfaces/userProfile';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user-profile`, { headers: this.getHeaders() });
  }

  updateTheme(theme: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/theme`, { theme }, { headers: this.getHeaders() });
  }

  updateProfileQuestions(questions: Array<{ question: string; answer: string }>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/questions`, { questions }, { headers: this.getHeaders() });
  }

  getPublicProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public-profile/${username}`);
}
}
