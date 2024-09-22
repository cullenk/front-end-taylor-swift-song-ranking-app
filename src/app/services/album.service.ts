import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Album } from '../interfaces/Album';
import { Song } from '../interfaces/Song';
import { SearchResult } from '../interfaces/SearchResult';
import { AlbumRanking } from '../interfaces/AlbumRanking';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private albumNameMapping: { [key: string]: string } = {
    'Debut': 'Taylor Swift',
    'Fearless': 'Fearless (Taylor\'s Version)',
    'Speak Now': 'Speak Now (Taylor\'s Version)',
    'Red': 'Red (Taylor\'s Version)',
    '1989': '1989 (Taylor\'s Version)',
    'Reputation': 'reputation',
    'Lover': 'Lover',
    'Folklore': 'folklore',
    'Evermore': 'evermore',
    'Midnights': 'Midnights',
    'The Tortured Poets Department': 'The Tortured Poets Department',
    'Singles': 'Singles'
  };

  private apiUrl = `${environment.apiUrl}/albums`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAlbumByTitle(title: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/album/${encodeURIComponent(title)}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        // console.log('Album response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  searchSongs(query: string): Observable<SearchResult[]> {
    const encodedQuery = encodeURIComponent(query);
    return this.http.get<SearchResult[]>(`${this.apiUrl}/songSearch?q=${encodedQuery}`);
  }

  getAlbumBySong(songTitle: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/albumBySong`, {
      headers: this.getHeaders(),
      params: { songTitle: encodeURIComponent(songTitle) }
    }).pipe(
      map(response => {
        // console.log('Album response:', response);
        return {
          ...response,
          albumImage: response.albumCover || 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/singles.png'
        };
      }),
      catchError(error => {
        console.error('Error fetching album:', error);
        throw error;
      })
    );
  }

  private getMappedAlbumName(albumName: string): string {
    return this.albumNameMapping[albumName] || albumName;
  }

  getSongsByAlbum(albumName: string): Observable<Song[]> {
    const mappedAlbumName = this.getMappedAlbumName(albumName);
    return this.http.get<Song[]>(`${this.apiUrl}/album/${encodeURIComponent(mappedAlbumName)}/songs`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching songs:', error);
        return throwError(error);
      })
    );
  }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/allAlbums`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching albums:', error);
        return throwError(error);
      })
    );
  }

  addAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(`${this.apiUrl}/add-album`, album, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error adding album:', error);
        return throwError(error);
      })
    );
  }

  getSongById(songId: string): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/songs/${encodeURIComponent(songId)}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching song by ID:', error);
        return throwError(error);
      })
    );
  }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/allSongs`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching all songs:', error);
        return throwError(error);
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
      console.error('Backend returned an error:', error);
      console.error('Error response body:', error.error);
    }
    return throwError(() => new Error(errorMessage));
  }
}

