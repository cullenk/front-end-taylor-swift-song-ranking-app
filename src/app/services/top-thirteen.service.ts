import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopThirteenService {
  constructor(private http: HttpClient) {}

  getTopThirteen(): Observable<any> {
    return this.http.get('/api/user/top-thirteen');
  }

  updateSong(slot: number, albumId: string, songTitle: string): Observable<any> {
    return this.http.post('/api/user/top-thirteen', { slot, albumId, songTitle });
  }

  removeSong(slot: number): Observable<any> {
    return this.http.delete(`/api/user/top-thirteen/${slot}`);
  }
}