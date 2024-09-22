import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../../../services/album.service';
import { TopThirteenService } from '../../../../services/top-thirteen.service';
import { TopThirteenStateService } from '../../../../services/top-thirteen-state.service';
import { SearchResult } from '../../../../interfaces/SearchResult';
import { Song } from '../../../../interfaces/Song';
import { TopThirteenItem } from '../../../../interfaces/Top13Item';
import { ToastrService } from 'ngx-toastr';
import { AlbumThemeService } from '../../../../services/album-theme.service';
import { AlbumTheme } from '../../../../interfaces/AlbumTheme';
import { CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-top-13-song-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDragHandle],
  templateUrl: './top-13-song-slot.component.html',
  styleUrls: ['./top-13-song-slot.component.scss']
})
export class Top13SongSlotComponent implements OnInit {
  @Input() slotIndex!: number;
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  selectedSong: Song | null = null;
  topThirteenItem: TopThirteenItem | null = null;
  albumTheme: AlbumTheme;
  topThirteenList: TopThirteenItem[] = [];

  constructor(
    private albumService: AlbumService,
    private topThirteenService: TopThirteenService,
    private topThirteenStateService: TopThirteenStateService,
    private toastr: ToastrService,
    private albumThemeService: AlbumThemeService
  ) {
    this.albumTheme = this.albumThemeService.getTheme(undefined);
  }

  ngOnInit() {
    this.topThirteenStateService.topThirteen$.subscribe(
      list => this.topThirteenList = list
    );
    this.loadTopThirteenList();
    this.disableAudioRightClick();
  }

  updateAlbumTheme() {
    if (this.selectedSong) {
      this.albumTheme = this.albumThemeService.getTheme(this.selectedSong.album);
    } else {
      this.albumTheme = this.albumThemeService.getTheme(undefined);
    }
  }

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
        e.preventDefault();
      }
    }, false);
  }

  loadTopThirteenList() {
    this.topThirteenService.getTopThirteen().subscribe(
      (topThirteen: TopThirteenItem[]) => {
        this.topThirteenStateService.updateTopThirteen(topThirteen);
        this.loadExistingSong();
      },
      error => {
        console.error('Error loading top thirteen:', error);
        this.toastr.error('Error loading top 13 list', 'Error');
      }
    );
  }

  loadExistingSong() {
    const existingSong = this.topThirteenList.find(item => item.slot === this.slotIndex);
    if (existingSong) {
      this.albumService.getSongById(existingSong.songId).subscribe(
        (song: Song) => {
          this.selectedSong = song;
          this.topThirteenItem = {
            slot: this.slotIndex,
            albumName: existingSong.albumName,
            songId: existingSong.songId,
            songTitle: existingSong.songTitle,
            albumCover: existingSong.albumCover
          };
          this.updateAlbumTheme();
        },
        error => {
          console.error('Error loading song:', error);
          this.toastr.error('Error loading song details', 'Error');
        }
      );
    } else {
      this.updateAlbumTheme();
    }
  }

  searchSongs() {
    const trimmedQuery = this.searchQuery.trim().replace(/\s+/g, ' ');
    if (trimmedQuery.length === 0) {
      this.searchResults = [];
      return;
    }
    this.albumService.searchSongs(trimmedQuery).subscribe(
      (results: SearchResult[]) => {
        this.searchResults = results;
      },
      error => {
        console.error('Error searching songs:', error);
        this.toastr.error('Error searching songs', 'Error');
      }
    );
  }

  selectSong(song: SearchResult) {
    this.selectedSong = {
      _id: song._id,
      title: song.title,
      album: song.album,
      albumImageSource: song.albumImageSource,
      audioSource: song.audioSource
    };
    
    this.topThirteenItem = {
      slot: this.slotIndex,
      albumName: song.album,
      songId: song._id,
      songTitle: song.title,
      albumCover: song.albumImageSource
    };
  
    this.updateTopThirteen();
  }
  
  resetSong() {
    this.selectedSong = null;
    this.topThirteenItem = {
      slot: this.slotIndex,
      albumName: '',
      songId: '',
      songTitle: '',
      albumCover: ''
    };
    this.updateTopThirteen();
  }

  handleAudioError(event: any) {
    console.error('Audio failed to load:', event);
    this.toastr.error('Failed to load audio. Please try again later.', 'Error');
  }

  fetchSongDetails(songId: string) {
    this.albumService.getSongById(songId).subscribe(
      (song: Song) => {
        this.checkAndUpdateTopThirteen(song);
      },
      error => {
        console.error('Error fetching song:', error);
        this.toastr.error('Error fetching song', 'Error');
      }
    );
  }

  checkAndUpdateTopThirteen(song: Song) {
    // Check if the song is already in the top 13 list
    const duplicateSong = this.topThirteenList.find(item => item.songTitle === song.title && item.slot !== this.slotIndex);
    if (duplicateSong) {
      this.toastr.error('This song is already in your top 13 list!', 'Duplicate Song');
      this.resetSelection();
      return; // Prevent adding the duplicate song
    }

    // If not a duplicate, update the selection and the top 13 list
    this.selectedSong = song;
    this.updateAlbumTheme();
    this.updateTopThirteen();
  }

  updateTopThirteen() {
    if (this.topThirteenItem) {
      this.topThirteenService.updateSong(
        this.topThirteenItem.slot,
        this.topThirteenItem.albumName,
        this.topThirteenItem.songId,
        this.topThirteenItem.songTitle,
        this.topThirteenItem.albumCover
      ).subscribe(
        (updatedList) => {
          console.log('Top 13 list updated successfully', updatedList);
          this.topThirteenStateService.updateTopThirteen(updatedList);
          this.toastr.success('Song added to your top 13 list!', 'Success');
        },
        (error) => {
          console.error('Error updating top 13 list:', error);
          this.toastr.error('Error updating top 13 list', 'Error');
          this.resetSelection();
        }
      );
    }
  }

  resetSelection() {
    this.selectedSong = null;
    this.searchQuery = '';
    this.searchResults = [];
  }

  handleImageError(event: any) {
    event.target.src = 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.jpg'; // Set a fallback image
    console.error('Failed to load album image');
  }
}