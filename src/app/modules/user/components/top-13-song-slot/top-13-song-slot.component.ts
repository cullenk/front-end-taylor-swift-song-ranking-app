import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../../../services/album.service';
import { TopThirteenService } from '../../../../services/top-thirteen.service';
import { TopThirteenStateService } from '../../../../services/top-thirteen-state.service';
import { SearchResult } from '../../../../interfaces/SearchResult';
import { Album } from '../../../../interfaces/Album';
import { Song } from '../../../../interfaces/Song';
import { TopThirteenItem } from '../../../../interfaces/Top13Item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-top-13-song-slot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-13-song-slot.component.html',
  styleUrls: ['./top-13-song-slot.component.scss']
})
export class Top13SongSlotComponent implements OnInit {
  @Input() slotIndex!: number;
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  selectedSong: Song | null = null;
  selectedAlbum: Album | null = null;
  topThirteen: TopThirteenItem[] = [];

  constructor(
    private albumService: AlbumService,
    private topThirteenService: TopThirteenService,
    private topThirteenStateService: TopThirteenStateService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.topThirteenStateService.topThirteen$.subscribe(
      list => this.topThirteen = list
    );
    this.loadTopThirteenList();
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
    const existingSong = this.topThirteen.find(item => item.slot === this.slotIndex);
    if (existingSong) {
      this.albumService.getAlbumBySong(existingSong.songTitle).subscribe(
        (album: Album) => {
          this.selectedAlbum = album;
          this.selectedSong = album.songs.find(song => song.title === existingSong.songTitle) || null;
        },
        error => {
          console.error('Error loading album:', error);
          this.toastr.error('Error loading song details', 'Error');
        }
      );
    } else {
      console.log(`No song selected for slot ${this.slotIndex}`);
    }
  }

  searchSongs() {
    this.albumService.searchSongs(this.searchQuery).subscribe(
      (results: SearchResult[]) => {
        console.log('Search results:', results);
        this.searchResults = results;
      },
      error => {
        console.error('Error searching songs:', error);
        this.toastr.error('Error searching songs', 'Error');
      }
    );
  }

  selectSong(song: SearchResult) {
    console.log('Audio source:', song.audioSource);
    this.fetchAlbumForSong(song.title);
  }

  handleAudioError(event: any) {
    console.error('Audio failed to load:', event);
    this.toastr.error('Failed to load audio. Please try again later.', 'Error');
  }
  

  fetchAlbumForSong(songTitle: string) {
    this.albumService.getAlbumBySong(songTitle).subscribe(
      (album: Album) => {
        console.log('Fetched album:', album); // Add this log
        const song = album.songs.find(s => s.title === songTitle);
        if (song) {
          this.checkAndUpdateTopThirteen(album, song);
        } else {
          console.error('Song not found in the album');
          this.toastr.error('Error selecting song', 'Error');
        }
      },
      error => {
        console.error('Error fetching album:', error);
        this.toastr.error('Error fetching album', 'Error');
      }
    );
  }

  checkAndUpdateTopThirteen(album: Album, song: Song) {
    // Check if the song is already in the top 13 list
    const duplicateSong = this.topThirteen.find(item => item.songTitle === song.title && item.slot !== this.slotIndex);
    if (duplicateSong) {
      this.toastr.error('This song is already in your top 13 list!', 'Duplicate Song');
      this.resetSelection();
      return; // Prevent adding the duplicate song
    }
  
    // If not a duplicate, update the selection and the top 13 list
    this.selectedAlbum = album;
    this.selectedSong = song;
    console.log('Selected album:', this.selectedAlbum); // Add this log
    this.updateTopThirteen();
  }
  

  updateTopThirteen() {
    if (this.selectedSong && this.selectedAlbum) {
      this.topThirteenService.updateSong(
        this.slotIndex,
        this.selectedAlbum._id!,
        this.selectedSong.title
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
    this.selectedAlbum = null;
    this.searchQuery = '';
    this.searchResults = [];
  }

  getColorFromAlbum(albumTitle: string | undefined): string {
    return albumTitle === 'Taylor Swift' ? '#00FF00' : 'red';
  }

  handleImageError(event: any) {
    event.target.src = 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg'; // Set a fallback image
    console.error('Failed to load album image');
  }

  resetSong() {
    this.topThirteenService.removeSong(this.slotIndex).subscribe(
      (updatedList) => {
        console.log('Song removed from top 13 list');
        this.topThirteenStateService.updateTopThirteen(updatedList);
        this.toastr.success('Song removed from your top 13 list', 'Success');
        this.resetSelection();
      },
      error => {
        console.error('Error removing song from top 13 list:', error);
        this.toastr.error('Error removing song from top 13 list', 'Error');
      }
    );
  }
}