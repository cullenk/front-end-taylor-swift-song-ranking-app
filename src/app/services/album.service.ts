import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SearchResult } from '../interfaces/SearchResult';
import { Album } from '../interfaces/Album';
import { Song } from '../interfaces/Song';

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
    'The Tortured Poets Department': 'The Tortured Poets Department'
  };
  private songsByAlbumUrl = 'http://localhost:3000/api/search';
  private allAlbumSearchUrl = 'http://localhost:3000/api/search/allAlbums';
  private songSearchUrl = 'http://localhost:3000/api/search/songSearch';
  private albumSearchBySongUrl = 'http://localhost:3000/api/search/albumBySong';
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  searchSongs(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.songSearchUrl}?q=${encodeURIComponent(query)}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error searching songs:', error);
        return of([]);
      })
    );
  }

  getAlbumBySong(songTitle: string): Observable<Album> {
    const encodedSongTitle = encodeURIComponent(songTitle);
    return this.http.get<Album>(`${this.albumSearchBySongUrl}/?songTitle=${encodedSongTitle}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Album response:', response);
        return {
          ...response,
          albumImage: response.albumImage || 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/album-cover-not-found.png'
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
    const encodedAlbumName = encodeURIComponent(mappedAlbumName);
    return this.http.get<Song[]>(`${this.songsByAlbumUrl}/${encodedAlbumName}`).pipe(
      catchError(error => {
        console.error('Error fetching songs:', error);
        return throwError(error);
      })
    );
  }

  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(this.allAlbumSearchUrl);
  }

}


