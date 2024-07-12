import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EraSetList, EraSetListSong } from '../../../../interfaces/EraSetList';
import { Song } from '../../../../interfaces/Song';
import { AlbumService } from '../../../../services/album.service';
import { ErasSongSearchComponent } from '../eras-song-search/eras-song-search.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-era-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, ErasSongSearchComponent],
  template: `
    <div class="era-widget" [ngStyle]="{'background-image': 'url(' + getAlbumCover(era.era) + ')'}">
      <div class="overlay"></div>
      <h2>{{ era.era }}</h2>
      <div class="song-slots" *ngIf="era.era === 'Surprise Songs'; else normalSlots">
        <div class="song-slot">
          <label for="guitarSong">Guitar:</label>
          <input id="guitarSong" [(ngModel)]="guitarSong.title" (ngModelChange)="updateSurpriseSongs()" />
        </div>
        <div class="song-slot">
          <label for="pianoSong">Piano:</label>
          <input id="pianoSong" [(ngModel)]="pianoSong.title" (ngModelChange)="updateSurpriseSongs()" />
        </div>
      </div>
      <ng-template #normalSlots>
        <div class="song-slots">
          <div *ngFor="let song of era.songs; let i = index" class="song-slot">
            <ng-container *ngIf="song.title; else searchSlot">
              <p>{{ song.title }}</p>
              <button class="remove-button" (click)="removeSong(i)">x</button>
            </ng-container>
            <ng-template #searchSlot>
              <app-eras-song-search 
                [albumName]="era.era" 
                (songSelected)="addSong($event, i)">
              </app-eras-song-search>
            </ng-template>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./era-widget.component.scss']
})
export class EraWidgetComponent implements OnInit {
  @Input() era!: EraSetList;
  @Output() eraUpdated = new EventEmitter<EraSetList>();
  guitarSong: EraSetListSong = { _id: '', title: '', audioSource: '' };
  pianoSong: EraSetListSong = { _id: '', title: '', audioSource: '' };

  constructor(private albumService: AlbumService) {}

  ngOnInit() {
    console.log('EraWidgetComponent initialized with era:', this.era);
    if (this.era.era === 'Surprise Songs') {
      this.initializeSurpriseSongs();
    } else {
      this.initializeSongs();
      this.loadSongs();
    }
  }

  initializeSurpriseSongs() {
    if (this.era.songs.length >= 2) {
      this.guitarSong = this.era.songs[0];
      this.pianoSong = this.era.songs[1];
    }
  }

  initializeSongs() {
    if (this.era.songs.length < 4) {
      this.era.songs = [...this.era.songs, ...Array(4 - this.era.songs.length).fill({ _id: '', title: '', audioSource: '' })];
    }
  }

  loadSongs() {
    console.log('other widgets load called');
    const validSongs = this.era.songs.filter(song => song._id && song._id !== '');
    if (validSongs.length === 0) {
      console.log('No valid songs to load');
      return;
    }
    const songRequests = validSongs.map(song => this.albumService.getSongById(song._id));
    forkJoin(songRequests).subscribe(
      (songs: Song[]) => {
        this.era.songs = songs.map(song => ({
          _id: song._id,
          title: song.title,
          audioSource: song.audioSource
        }));
        this.initializeSongs(); // Ensure there are always 4 song slots
      },
      error => {
        console.error('Error loading songs:', error);
      }
    );
  }

  addSong(song: Song, index: number) {
    this.era.songs[index] = {
      _id: song._id,
      title: song.title,
      audioSource: song.audioSource
    };
    this.eraUpdated.emit(this.era);
  }

  removeSong(index: number) {
    this.era.songs[index] = { _id: '', title: '', audioSource: '' };
    this.eraUpdated.emit(this.era);
  }

  updateSurpriseSongs() {
    this.era.songs = [this.guitarSong, this.pianoSong];
    this.eraUpdated.emit(this.era);
  }
  getAlbumCover(era: string): string {
    const albumCovers: { [key: string]: string } = {
      'Debut': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg',
      'Fearless': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg',
      'Speak Now': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg',
      'Red': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg',
      '1989': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg',
      'Reputation': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/reputation.jpg',
      'Lover': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg',
      'Folklore': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg',
      'Evermore': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg',
      'Midnights': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/midnights.jpeg',
      'The Tortured Poets Department': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg',
      'Surprise Songs': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/singles/Singles.svg'
    };
    return albumCovers[era] || '';
  }
}