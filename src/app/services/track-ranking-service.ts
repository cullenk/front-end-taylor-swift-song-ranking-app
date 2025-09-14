import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Album } from '../interfaces/Album';
import { Song } from '../interfaces/Song';
import { TrackRankingItem } from '../interfaces/TrackRankingItem';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TrackRankingService {
  private apiUrl = `${environment.apiUrl}/rankings`;

  constructor(private http: HttpClient) {}

  getTrackRankings(): Observable<TrackRankingItem[][]> {
    return this.http.get<TrackRankingItem[][]>(`${this.apiUrl}/track-rankings`).pipe(
      switchMap(rankings => {
        if (rankings && rankings.length > 0) {
          return of(rankings);
        } else {
          console.log('No rankings found, creating default rankings');
          return this.createDefaultTrackRankings();
        }
      }),
      catchError(error => {
        console.error('Error fetching rankings:', error);
        return this.createDefaultTrackRankings();
      })
    );
  }

  private createDefaultTrackRankings(): Observable<TrackRankingItem[][]> {
    console.log('Creating default track rankings');
    return this.http.get<Album[]>(`${environment.apiUrl}/albums/allAlbums`).pipe(
      tap(albums => console.log('Fetched albums:', albums)),
      switchMap(albums => {
        // Filter out the 'Singles' album and sort by release year
        const filteredAndSortedAlbums = albums
          .filter(album => album.title !== 'Singles')
          .sort((a, b) => a.releaseYear - b.releaseYear);
        
        const songRequests = filteredAndSortedAlbums.map(album => 
          this.http.get<Song[]>(`${environment.apiUrl}/albums/album/${encodeURIComponent(album.title)}/songs`)
        );
        return forkJoin(songRequests).pipe(
          tap(albumSongs => console.log('Fetched songs for all albums (excluding Singles):', albumSongs)),
          map(albumSongs => {
            const maxTracks = Math.max(...albumSongs.map(songs => songs.length));
            console.log('Max tracks:', maxTracks);
            const trackRankings: TrackRankingItem[][] = Array(maxTracks).fill(null).map(() => []);
  
            albumSongs.forEach((songs, albumIndex) => {
              songs.forEach((song, trackIndex) => {
                if (trackRankings[trackIndex]) {
                  trackRankings[trackIndex].push({
                    songId: song._id,
                    songTitle: song.title,
                    albumName: filteredAndSortedAlbums[albumIndex].title,
                    audioSource: song.audioSource,
                    albumImageSource: song.albumImageSource || filteredAndSortedAlbums[albumIndex].albumCover,
                    rank: trackRankings[trackIndex].length + 1
                  });
                }
              });
            });
  
            console.log('Created default track rankings:', trackRankings);
            return trackRankings;
          })
        );
      }),
      catchError(error => {
        console.error('Error creating default track rankings:', error);
        return of([]);
      })
    );
  }

  saveTrackRankings(trackRankings: TrackRankingItem[][]): Observable<any> {
    const formattedRankings = trackRankings.map(track => 
      track.map(item => ({
        songId: item.songId,
        songTitle: item.songTitle,
        albumName: item.albumName,
        audioSource: item.audioSource,
        albumImageSource: item.albumImageSource,
        rank: item.rank
      }))
    );
    return this.http.put(`${this.apiUrl}/track-rankings`, { trackRankings: formattedRankings });
  }
}