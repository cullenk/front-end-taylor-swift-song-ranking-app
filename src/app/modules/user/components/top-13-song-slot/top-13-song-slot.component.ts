import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-13-song-slot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-13-song-slot.component.html',
  styleUrls: ['./top-13-song-slot.component.scss']
})
export class Top13SongSlotComponent implements OnInit, OnDestroy {
  @Input() slotIndex!: number;
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  selectedSong: Song | null = null;
  topThirteen: TopThirteenItem[] = [];
  albumTheme: AlbumTheme;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  isSearching = false;

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
      list => this.topThirteen = list
    );
    this.loadTopThirteenList();
    this.disableAudioRightClick();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query) {
        this.isSearching = true;
        this.albumService.searchSongs(query).subscribe(
          (results: SearchResult[]) => {
            console.log('Search results:', results);
            this.searchResults = results;
            this.isSearching = false;
          },
          error => {
            console.error('Error searching songs:', error);
            this.toastr.error('Error searching songs', 'Error');
            this.isSearching = false;
          }
        );
      } else {
        this.searchResults = [];
        this.isSearching = false;
      }
    });
  }

ngOnDestroy() {
  // Pause all audio elements when the component is destroyed
  document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
    if (!audio.paused) {
      audio.pause();
    }
  });

  this.destroy$.next();
  this.destroy$.complete();
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
    const existingSong = this.topThirteen.find(item => item.slot === this.slotIndex);
    if (existingSong && existingSong.songId) {
      this.albumService.getSongById(existingSong.songId).subscribe(
        (song: Song | null) => {
          if (song) {
            this.selectedSong = song;
            this.updateAlbumTheme();
          } else {
            console.log(`No song details found for ID: ${existingSong.songId}`);
            this.selectedSong = null;
            this.updateAlbumTheme();
          }
        },
        error => {
          console.error('Error loading song:', error);
          this.toastr.error('Error loading song details', 'Error');
          this.selectedSong = null;
          this.updateAlbumTheme();
        }
      );
    } else {
      console.log(`No song selected for slot ${this.slotIndex}`);
      this.selectedSong = null;
      this.updateAlbumTheme();
    }
  }

  searchSongs() {
    this.searchSubject.next(this.searchQuery);
  }

  // searchSongs() {
  //   this.albumService.searchSongs(this.searchQuery).subscribe(
  //     (results: SearchResult[]) => {
  //       console.log('Search results:', results);
  //       this.searchResults = results;
  //     },
  //     error => {
  //       console.error('Error searching songs:', error);
  //       this.toastr.error('Error searching songs', 'Error');
  //     }
  //   );
  // }

  selectSong(song: SearchResult) {
    console.log('Audio source:', song.audioSource);
    this.fetchSongDetails(song._id);
    this.updateAlbumTheme();
  }

  handleAudioError(event: any) {
    console.error('Audio failed to load:', event);
    this.toastr.error('Failed to load audio. Please try again later.', 'Error');
  }

  fetchSongDetails(songId: string) {
    this.albumService.getSongById(songId).subscribe(
      (song: Song | null) => {
        if (song) {
          this.checkAndUpdateTopThirteen(song);
        } else {
          console.log('No song found with the given ID');
          this.toastr.warning('Song not found', 'Warning');
        }
      },
      error => {
        console.error('Error fetching song:', error);
        this.toastr.error('Error fetching song', 'Error');
      }
    );
  }

  checkAndUpdateTopThirteen(song: Song) {
    // Check if the song is already in the top 13 list
    const duplicateSong = this.topThirteen.find(item => item.songTitle === song.title && item.slot !== this.slotIndex);
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
    if (this.selectedSong) {
      this.topThirteenService.updateSong(
        this.slotIndex,
        this.selectedSong.album,
        this.selectedSong._id!,
        this.selectedSong.title,
        this.selectedSong.albumImageSource
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

  handleAudioPlay(event: Event) {
    const audioElement = event.target as HTMLAudioElement;
  
    // Pause all other audio elements
    document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
      if (audio !== audioElement && !audio.paused) {
        audio.pause();
      }
    });
  
    // Play the clicked audio
    if (audioElement.paused) {
      audioElement.play();
    }
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