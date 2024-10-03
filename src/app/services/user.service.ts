import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { User } from '../interfaces/User';

interface Song {
  title: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserLogins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/logins`, { headers: this.getHeaders() });
  }

  getTopFavoriteSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/users/top-favorite-songs`, { headers: this.getHeaders() });
  }

  getPopularErasTourSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/users/popular-eras-tour-songs`, { headers: this.getHeaders() });
  }
}