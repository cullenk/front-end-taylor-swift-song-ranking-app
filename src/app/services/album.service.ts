import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private allAlbumSearchUrl = 'http://localhost:3000/allAlbums';
  private songSearchUrl = 'http://localhost:3000/songSearch';
  private albumSearchBySongUrl = 'http://localhost:3000/albumBySong';
  
  constructor(private http: HttpClient) {}

  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(this.allAlbumSearchUrl);
  }

  searchSongs(query: string): Observable<any[]> {
    const url = `${this.songSearchUrl}?q=${encodeURIComponent(query)}`;
    return this.http.get<any[]>(url);
  }
  
  getAlbumBySong(songTitle: string): Observable<any[]> {
    const url = `${this.albumSearchBySongUrl}?songTitle=${encodeURIComponent(songTitle)}`;
    return this.http.get<any[]>(url);
  }

}
