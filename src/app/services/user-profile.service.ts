import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  updateProfileImage(image: string): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile/image`, { image }, { headers: this.getHeaders() });
  }

  updateTheme(theme: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/theme`, { theme }, { headers: this.getHeaders() });
  }

  updateProfileQuestions(questions: Array<{ question: string; answer: string }>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/questions`, { questions }, { headers: this.getHeaders() });
  }

  getPublicProfile(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/public-profile/${username}`);
  }

  hasCompletedErasTourSetlist(username: string): Observable<boolean> {
    return this.http.get<{ hasCompletedSetlist: boolean }>(`${this.apiUrl}/profile/${username}/has-completed-eras-tour`)
      .pipe(map(response => response.hasCompletedSetlist));
  }

getErasTourSetListByUsername(username: string): Observable<EraSetList[]> {
  return this.http.get<EraSetList[]>(`${this.apiUrl}/profile/eras-tour-set-list/${username}`);
}

getAllPublicProfiles(page: number = 1, limit: number = 20): Observable<{ totalCount: number; users: UserProfile[] }> {
  return this.http.get<{ totalCount: number; users: UserProfile[] }>(`${this.apiUrl}/profile/all-public-profiles?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
}

getAllPublicProfilesWithoutPagination(): Observable<UserProfile[]> {
  return this.http.get<UserProfile[]>(`${this.apiUrl}/profile/all-public-profiles/all`, { headers: this.getHeaders() });
}

}
