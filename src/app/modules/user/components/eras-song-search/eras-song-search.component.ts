import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../../../services/album.service';
import { Song } from '../../../../interfaces/Song';

@Component({
  selector: 'app-eras-song-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select [(ngModel)]="selectedSong" (ngModelChange)="onSongSelected()">
      <option value="">Select a song</option>
      <option *ngFor="let song of songs" [ngValue]="song">{{ song.title }}</option>
    </select>
  `,
  styleUrls: ['./eras-song-search.component.scss']
})
export class ErasSongSearchComponent implements OnInit {
  @Input() albumName!: string;
  @Output() songSelected = new EventEmitter<Song>();

  songs: Song[] = [];
  selectedSong: Song | null = null;

  constructor(private albumService: AlbumService) {}

  ngOnInit() {
    // console.log('ErasSongSearchComponent initialized with albumName:', this.albumName);
    this.loadSongs();
  }

  loadSongs() {
    this.albumService.getSongsByAlbum(this.albumName).subscribe(
      songs => {
        // console.log('Received songs:', songs);
        this.songs = songs;
      },
      error => {
        console.error('Error loading songs:', error);
      }
    );
  }

  onSongSelected() {
    if (this.selectedSong) {
      this.songSelected.emit(this.selectedSong);
    }
  }
}