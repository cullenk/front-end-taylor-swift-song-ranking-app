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
    this.albumService.getSongsByAlbum(this.era.era).subscribe(
      (songs: Song[]) => {
        this.allSongs = songs;
      },
      error => console.error('Error loading songs:', error)
    );
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
  }

  closeAddSongDialog() {
    this.showAddSongDialog = false;
    this.selectedSongTitle = '';
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
    if (this.isMashup) {
      if (this.totalMashups >= 3 || this.totalSongs >= 45) {
        return;
      }
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
      if (this.totalSongs >= 45) {
        return;
      }
      const selectedSong = this.allSongs.find(song => song._id === this.selectedSongTitle);
      if (selectedSong && !this.isSongAlreadySelected(selectedSong._id)) {
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
      'Debut': 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.jpg',
      'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.jpg',
      'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.jpg',
      'Red': 'https://d3e29z0m37b0un.cloudfront.net/red-tv.jpeg',
      '1989': 'https://d3e29z0m37b0un.cloudfront.net/1989.jpeg',
      'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/reputation.jpg',
      'Lover': 'https://d3e29z0m37b0un.cloudfront.net/lover.jpg',
      'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/folklore.jpg',
      'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/evermore.jpeg',
      'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/MidnightsNoText.png',
      'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/ttpd.jpg',
      'Surprise Songs': 'https://d3e29z0m37b0un.cloudfront.net/surpriseSongs.png'
    };
    return albumCovers[era] || '';
  }

  canSaveSong(): boolean {
    if (this.era.era === 'Surprise Songs') {
      return this.era.songs.length < 2;
    }
    if (this.isMashup) {
      return this.totalMashups < 3 && this.totalSongs < 45;
    }
    return this.totalSongs < 45 && !this.isSongAlreadySelected(this.selectedSongTitle);
  }

  isSongAlreadySelected(songId: string): boolean {
    return this.era.songs.some(song => song._id === songId);
  }
}
