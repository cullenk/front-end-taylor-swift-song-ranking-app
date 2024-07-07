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

  getErasTourSetList(): Observable<EraSetList[]> {
    return this.http.get<EraSetList[]>(`${this.apiUrl}/eras-tour-set-list`, { headers: this.getHeaders() });
  }

  updateErasTourSetList(setList: EraSetList[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/eras-tour-set-list`, { erasTourSetList: setList }, { headers: this.getHeaders() });
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
