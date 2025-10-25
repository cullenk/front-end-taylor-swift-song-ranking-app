import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
    if (this.cachedRanking) {
      console.log('🔄 [SERVICE] Returning cached ranking:', this.cachedRanking.length, 'songs');
      return of(this.cachedRanking);
    }
    
    // console.log('🌐 [SERVICE] Fetching fresh ranking from server');
    return this.http.get<AllSongsRankingItem[]>(`${this.apiUrl}/all-songs-ranking`).pipe(
      tap(ranking => {
        // console.log('✅ [SERVICE] Cached fresh ranking:', ranking.length, 'songs');
        this.cachedRanking = ranking;
      }),
      catchError(error => {
        console.error('❌ [SERVICE] Error fetching all songs ranking:', error);
        return of([]);
      })
    );
  }
  
saveAllSongsRanking(ranking: AllSongsRankingItem[]): Observable<AllSongsRankingItem[]> {
  console.log('💾 [SERVICE] Saving ranking:', ranking.length, 'songs');
  console.log('📊 [SERVICE] First 3 songs in ranking being saved:', 
    ranking.slice(0, 3).map(s => ({ 
      rank: s.rank, 
      title: s.songTitle,
      songId: s.songId,
      hasRequiredFields: !!(s.rank && s.songTitle && s.songId)
    }))
  );
  
  // Validate data before sending
  const invalidItems = ranking.filter(item => 
    !item.songId || 
    !item.songTitle || 
    !item.rank || 
    typeof item.rank !== 'number'
  );
  
  if (invalidItems.length > 0) {
    console.error('❌ [SERVICE] Invalid items detected before sending:', invalidItems.slice(0, 3));
    return throwError(() => new Error(`Invalid ranking data: ${invalidItems.length} items missing required fields`));
  }
  
  return this.http.put<AllSongsRankingItem[]>(`${this.apiUrl}/all-songs-ranking`, { ranking }).pipe(
    tap(updatedRanking => {
      console.log('✅ [SERVICE] Save successful. Clearing cache to force fresh fetch next time');
      console.log('📊 [SERVICE] Server returned:', updatedRanking.length, 'songs');
      console.log('🔄 [SERVICE] First 3 songs from server:', 
        updatedRanking.slice(0, 3).map(s => ({ rank: s.rank, title: s.songTitle }))
      );
      
      // Clear the cache instead of updating it - this forces a fresh fetch next time
      this.cachedRanking = null;
    }),
    catchError(error => {
      console.error('❌ [SERVICE] Error saving all songs ranking:');
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      console.error('Error body:', error.error);
      
      // Return a more specific error message
      const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
      return throwError(() => new Error(`Save failed: ${errorMessage}`));
    })
  );
}

  // Add method to manually clear cache if needed
  clearCache(): void {
    console.log('🗑️ [SERVICE] Manually clearing cache');
    this.cachedRanking = null;
  }

  // Add method to force refresh
  forceRefresh(): Observable<AllSongsRankingItem[]> {
    console.log('🔄 [SERVICE] Force refreshing ranking');
    this.cachedRanking = null;
    return this.getAllSongsRanking();
  }
}