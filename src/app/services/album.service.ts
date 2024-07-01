import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SearchResult } from '../interfaces/SearchResult';
import { Album } from '../interfaces/Album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
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
        console.log('Album response:', response); // Add this log
        return {
          ...response,
          albumImage: response.albumImage || 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/album-cover-not-found.png' // Ensure albumCover is always set
        };
      }),
      catchError(error => {
        console.error('Error fetching album:', error);
        throw error;
      })
    );
  }
  


  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(this.allAlbumSearchUrl);
  }

}
  // searchSongs(query: string): Observable<any[]> {
  //   const url = `${this.songSearchUrl}?q=${encodeURIComponent(query)}`;
  //   return this.http.get<any[]>(url);
  // }

  // searchSongs(query: string): Observable<SearchResult[]> {
  //   return this.http.get<SearchResult[]>(`${this.songSearchUrl}?q=${query}`);
  // }
  
  // getAlbumBySong(songTitle: string): Observable<any[]> {
  //   const url = `${this.albumSearchBySongUrl}?songTitle=${encodeURIComponent(songTitle)}`;
  //   return this.http.get<any[]>(url);
  // }

  // const encodedSongTitle = encodeURIComponent(songTitle);
  // getAlbumBySong(encodedSongTitle: string): Observable<Album> {
  //   return this.http.get<Album>(`${this.albumSearchBySongUrl}?songTitle=${songTitle}`);
  // }


