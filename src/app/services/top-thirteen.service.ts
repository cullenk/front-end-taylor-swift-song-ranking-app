import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TopThirteenItem } from '../interfaces/Top13Item';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TopThirteenService {
  // private apiUrl = 'http://localhost:3000/api/rankings';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('TopThirteenService initialized with API URL:', this.apiUrl);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    console.log('Getting headers, token exists:', !!token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTopThirteen(): Observable<TopThirteenItem[]> {
    console.log('TopThirteenService.getTopThirteen() called');
    const url = `${this.apiUrl}/rankings/user/top-thirteen`;
    console.log('Making HTTP GET request to:', url);
    
    return this.http.get<TopThirteenItem[]>(url, { headers: this.getHeaders() }).pipe(
      tap(response => {
        console.log('TopThirteenService.getTopThirteen() - SUCCESS response:', response);
      }),
      catchError(error => {
        console.error('TopThirteenService.getTopThirteen() - ERROR:', error);
        console.error('Error details - Status:', error.status, 'Message:', error.message);
        console.error('Full error object:', error);
        return of([]);
      })
    );
  }

  updateSong(slot: number, albumName: string, songId: string, songTitle: string, albumCover: string): Observable<TopThirteenItem[]> {
    console.log('TopThirteenService.updateSong() called with:', { slot, albumName, songId, songTitle, albumCover });
    const url = `${this.apiUrl}/rankings/user/top-thirteen`;
    console.log('Making HTTP POST request to:', url);
    
    return this.http.post<TopThirteenItem[]>(url, { slot, albumName, songId, songTitle, albumCover }, { headers: this.getHeaders() }).pipe(
      tap(response => {
        console.log('TopThirteenService.updateSong() - SUCCESS response:', response);
      }),
      catchError(error => {
        console.error('TopThirteenService.updateSong() - ERROR:', error);
        throw error;
      })
    );
  }

  removeSong(slot: number): Observable<TopThirteenItem[]> {
    console.log('TopThirteenService.removeSong() called with slot:', slot);
    const url = `${this.apiUrl}/rankings/user/top-thirteen/${slot}`;
    console.log('Making HTTP DELETE request to:', url);
    
    return this.http.delete<TopThirteenItem[]>(url, { headers: this.getHeaders() }).pipe(
      tap(response => {
        console.log('TopThirteenService.removeSong() - SUCCESS response:', response);
      }),
      catchError(error => {
        console.error('TopThirteenService.removeSong() - ERROR:', error);
        throw error;
      })
    );
  }

  updateEntireTopThirteen(topThirteenList: TopThirteenItem[]): Observable<TopThirteenItem[]> {
    console.log('TopThirteenService.updateEntireTopThirteen() called with:', topThirteenList);
    const url = `${this.apiUrl}/rankings/user/top-thirteen`;
    console.log('Making HTTP PUT request to:', url);
    
    return this.http.put<TopThirteenItem[]>(url, topThirteenList, { headers: this.getHeaders() }).pipe(
      tap(response => {
        console.log('TopThirteenService.updateEntireTopThirteen() - SUCCESS response:', response);
      }),
      catchError(error => {
        console.error('TopThirteenService.updateEntireTopThirteen() - ERROR:', error);
        throw error;
      })
    );
  }
}