import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TopThirteenItem } from '../interfaces/Top13Item';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TopThirteenService {
  // private apiUrl = 'http://localhost:3000/api/rankings';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTopThirteen(): Observable<TopThirteenItem[]> {
    return this.http.get<TopThirteenItem[]>(`${this.apiUrl}/rankings/user/top-thirteen`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching top thirteen:', error);
        return of([]);
      })
    );
  }

  updateEntireList(list: TopThirteenItem[]): Observable<TopThirteenItem[]> {
    return this.http.put<TopThirteenItem[]>(`${this.apiUrl}/rankings/user/top-thirteen`, list);
  }

  updateSong(slot: number, albumName: string, songId: string, songTitle: string, albumCover: string): Observable<TopThirteenItem[]> {
    return this.http.post<TopThirteenItem[]>(`${this.apiUrl}/rankings/user/top-thirteen`, { slot, albumName, songId, songTitle, albumCover }, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error updating song:', error);
        throw error; // Re-throw the error so the component can handle it
      })
    );
  }

  removeSong(slot: number): Observable<TopThirteenItem[]> {
    return this.http.delete<TopThirteenItem[]>(`${this.apiUrl}/rankings/user/top-thirteen/${slot}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error removing song:', error);
        throw error;
      })
    );
  }
}