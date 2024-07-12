import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Rankings, Ranking } from '../interfaces/Rankings';
import { EraSetList } from "../interfaces/EraSetList";

@Injectable({
  providedIn: 'root'
})
export class RankingsService {
  private apiUrl = 'http://localhost:3000/api/rankings';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserRankings(): Observable<Rankings> {
    return this.http.get<Rankings>(`${this.apiUrl}/rankings`, { headers: this.getHeaders() })
      .pipe(
        retry(3), // Retry up to 3 times on failure
        catchError(this.handleError)
      );
  }

  updateRanking(listName: string, rankings: Ranking[]): Observable<Rankings> {
    return this.http.put<Rankings>(`${this.apiUrl}/rankings/${listName}`, { rankings }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTopThirteen(): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(`${this.apiUrl}/user/top-thirteen`, { headers: this.getHeaders() })
      .pipe(
        retry(3), // Retry up to 3 times on failure
        catchError(this.handleError)
      );
  }

  updateTopThirteen(slot: number, albumName: string, songId: string, songTitle: string, albumCover: string): Observable<Ranking[]> {
    return this.http.post<Ranking[]>(`${this.apiUrl}/user/top-thirteen`, { slot, albumName, songId, songTitle, albumCover }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  removeTopThirteen(slot: number): Observable<Ranking[]> {
    return this.http.delete<Ranking[]>(`${this.apiUrl}/user/top-thirteen/${slot}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getErasTourSetList(): Observable<EraSetList[]> {
    return this.http.get<EraSetList[]>(`${this.apiUrl}/eras-tour-set-list`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching Eras Tour set list:', error);
        return throwError(() => new Error('Failed to fetch Eras Tour set list'));
      })
    );
  }

  updateErasTourSetList(setList: EraSetList[]): Observable<any> {
    console.log('Sending setlist to server:', setList);
    return this.http.put(`${this.apiUrl}/eras-tour-set-list`, { erasTourSetList: setList }, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error updating Eras Tour set list:', error);
        return throwError(() => new Error('Failed to update Eras Tour set list'));
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
