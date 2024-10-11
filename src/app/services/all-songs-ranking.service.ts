import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

export interface AllSongsRankingItem {
  songId: string;
  songTitle: string;
  albumName: string;
  audioSource: string;
  rank: number;
  albumImageSource: string;
}

@Injectable({
  providedIn: 'root'
})
export class AllSongsRankingService {
  private apiUrl = `${environment.apiUrl}/rankings`;
  private cachedRanking: AllSongsRankingItem[] | null = null;

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<AllSongsRankingItem[]> {
    return this.http.get<AllSongsRankingItem[]>(`${this.apiUrl}/all-songs`);
  }

  getAllSongsRanking(): Observable<AllSongsRankingItem[]> {
    console.log('Fetching all songs ranking');
    return this.http.get<AllSongsRankingItem[]>(`${this.apiUrl}/all-songs-ranking`).pipe(
      tap(ranking => {
        console.log('Received ranking:', ranking);
        this.cachedRanking = ranking;
      }),
      catchError(error => {
        console.error('Error fetching all songs ranking:', error);
        return of([]);
      })
    );
  }
  saveAllSongsRanking(ranking: AllSongsRankingItem[]): Observable<AllSongsRankingItem[]> {
    return this.http.put<AllSongsRankingItem[]>(`${this.apiUrl}/all-songs-ranking`, { ranking }).pipe(
      tap(updatedRanking => this.cachedRanking = updatedRanking),
      catchError(error => {
        console.error('Error saving all songs ranking:', error);
        return of([]);
      })
    );
  }
}