import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-profile`);
  }

  updateTheme(theme: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/theme`, { theme });
  }

  updateProfileQuestions(questions: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/questions`, { questions });
  }

  getPublicProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public-profile/${username}`);
  }
}
