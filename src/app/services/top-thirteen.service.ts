import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TopThirteenItem } from '../interfaces/Top13Item';

@Injectable({
  providedIn: 'root'
})
export class TopThirteenService {
  private apiUrl = 'http://localhost:3000/user/top-thirteen';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTopThirteen(): Observable<TopThirteenItem[]> {
    return this.http.get<TopThirteenItem[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching top thirteen:', error);
        return of([]);
      })
    );
  }

  updateSong(slot: number, albumId: string, songTitle: string): Observable<TopThirteenItem[]> {
    return this.http.post<TopThirteenItem[]>(this.apiUrl, { slot, albumId, songTitle }, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error updating song:', error);
        throw error; // Re-throw the error so the component can handle it
      })
    );
  }

  removeSong(slot: number): Observable<TopThirteenItem[]> {
    return this.http.delete<TopThirteenItem[]>(`${this.apiUrl}/${slot}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error removing song:', error);
        throw error;
      })
    );
  }
}