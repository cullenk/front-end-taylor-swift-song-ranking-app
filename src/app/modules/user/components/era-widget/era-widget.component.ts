// era-widget.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EraSetList, EraSetListSong } from '../../../../interfaces/EraSetList';
import { Song } from '../../../../interfaces/Song';
import { AlbumService } from '../../../../services/album.service';

@Component({
  selector: 'app-era-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './era-widget.component.html',
  styleUrls: ['./era-widget.component.scss']
})
export class EraWidgetComponent implements OnInit {
  @Input() era!: EraSetList;
  @Input() totalSongs!: number;
  @Input() totalMashups!: number;
  @Output() eraUpdated = new EventEmitter<EraSetList>();
  allSongs: Song[] = [];
  showAddSongDialog: boolean = false;
  isMashup: boolean = false;
  selectedSongTitle: string = '';
  firstSongId: string = '';
  secondSongId: string = '';
  guitarSong: EraSetListSong = { _id: '', title: '', audioSource: '' };
  pianoSong: EraSetListSong = { _id: '', title: '', audioSource: '' };
  songType: 'guitar' | 'piano' | null = null;

  constructor(private albumService: AlbumService) {}

  ngOnInit() {
    if (this.era.era !== 'Surprise Songs') {
      this.loadSongs();
    } else {
      this.initializeSurpriseSongs();
    }
  }

  loadSongs() {
    if (this.allSongs.length === 0) {
      this.albumService.getSongsByAlbum(this.era.era).subscribe(
        (songs: Song[]) => {
          this.allSongs = songs;
        },
        error => console.error('Error loading songs:', error)
      );
    }
  }

  initializeSurpriseSongs() {
    if (this.era.songs.length >= 1) {
      this.guitarSong = this.era.songs[0] || { _id: '', title: '', audioSource: '' };
      this.pianoSong = this.era.songs[1] || { _id: '', title: '', audioSource: '' };
    }
  }

  openAddSongDialog(songType: 'guitar' | 'piano' | null = null) {
    this.songType = songType;
    this.showAddSongDialog = true;
    this.isMashup = false;
    this.selectedSongTitle = '';
    this.firstSongId = '';
    this.secondSongId = '';
    // Ensure allSongs is populated
    if (this.allSongs.length === 0) {
      this.loadSongs();
    }
  }

  onMashupToggle() {
    this.selectedSongTitle = '';
    this.firstSongId = '';
    this.secondSongId = '';
    console.log('Mashup toggled, isMashup:', this.isMashup);
  }

  closeAddSongDialog() {
    this.showAddSongDialog = false;
    this.selectedSongTitle = '';
    this.isMashup = false;
  }

  saveSurpriseSong() {
    if (this.songType === 'guitar') {
      this.guitarSong.title = this.selectedSongTitle;
    } else if (this.songType === 'piano') {
      this.pianoSong.title = this.selectedSongTitle;
    }
    this.era.songs = [this.guitarSong, this.pianoSong].filter(song => song.title);
    this.eraUpdated.emit(this.era);
    this.closeAddSongDialog();
  }

  removeSurpriseSong(songType: 'guitar' | 'piano') {
    if (songType === 'guitar') {
      this.guitarSong = { _id: '', title: '', audioSource: '' };
    } else if (songType === 'piano') {
      this.pianoSong = { _id: '', title: '', audioSource: '' };
    }
    this.era.songs = [this.guitarSong, this.pianoSong].filter(song => song.title);
    this.eraUpdated.emit(this.era);
  }

  saveSong() {
    if (!this.canSaveSong()) {
      return;
    }
  
    if (this.isMashup) {
      const firstSong = this.allSongs.find(song => song._id === this.firstSongId);
      const secondSong = this.allSongs.find(song => song._id === this.secondSongId);
      if (firstSong && secondSong) {
        this.era.songs.push({
          _id: `${firstSong._id}/${secondSong._id}`,
          title: `${firstSong.title} / ${secondSong.title}`,
          audioSource: '',
          isMashup: true
        });
      }
    } else {
      const selectedSong = this.allSongs.find(song => song._id === this.selectedSongTitle);
      if (selectedSong) {
        this.era.songs.push({
          _id: selectedSong._id,
          title: selectedSong.title,
          audioSource: selectedSong.audioSource,
          isMashup: false
        });
      }
    }
    this.eraUpdated.emit(this.era);
    this.closeAddSongDialog();
  }

  removeSong(index: number) {
    this.era.songs.splice(index, 1);
    this.eraUpdated.emit(this.era);
  }

  getAlbumCover(era: string): string {
    const albumCovers: { [key: string]: string } = {
      'Debut': 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      'Red': 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      '1989': 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
      'Lover': 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/MidnightsNoText.webp',
      'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      'Surprise Songs': 'https://d3e29z0m37b0un.cloudfront.net/surpriseSongs.webp'
    };
    return albumCovers[era] || '';
  }

  canSaveSong(): boolean {
    if (this.era.era === 'Surprise Songs') {
      return this.era.songs.length < 2;
    }
    if (this.isMashup) {
      return this.totalMashups < 3 && this.totalSongs < 45 && 
             !this.isSongAlreadySelected(this.firstSongId) && 
             !this.isSongAlreadySelected(this.secondSongId);
    }
    return this.totalSongs < 45 && !this.isSongAlreadySelected(this.selectedSongTitle);
  }

  isSongAlreadySelected(songId: string): boolean {
    return this.era.songs.some(song => {
      if (song.isMashup) {
        // For mashups, check if the songId is part of the mashup
        if (typeof song._id === 'string' && song._id.includes('/')) {
          const [firstId, secondId] = song._id.split('/');
          return songId === firstId || songId === secondId;
        }
        // If the _id is not in the expected format, log an error and return false
        console.error('Unexpected mashup _id format:', song._id);
        return false;
      }
      return song._id === songId;
    });
  }
}
