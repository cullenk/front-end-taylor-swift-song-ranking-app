import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  username: string;
  loginCount: number;
}

interface Song {
  title: string;
  count: number;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserLogins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/logins`, { headers: this.getHeaders() });
  }

  getTopSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/top-songs`, { headers: this.getHeaders() });
  }

}