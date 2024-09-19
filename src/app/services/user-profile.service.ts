import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../interfaces/userProfile';
import { EraSetList } from '../interfaces/EraSetList';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  // private apiUrl = 'http://localhost:3000/api/profile';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/user-profile`, { headers: this.getHeaders() });
  }

  updateProfileImage(image: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/image`, { image }, { headers: this.getHeaders() });
  }

  updateTheme(theme: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/theme`, { theme }, { headers: this.getHeaders() });
  }

  updateProfileQuestions(questions: Array<{ question: string; answer: string }>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/questions`, { questions }, { headers: this.getHeaders() });
  }

  getPublicProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/public-profile/${username}`);
}
getErasTourSetListByUsername(username: string): Observable<EraSetList[]> {
  return this.http.get<EraSetList[]>(`${this.apiUrl}/profile/eras-tour-set-list/${username}`);
}
}
