import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../../../services/album.service';
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
  @Output() songUpdated = new EventEmitter<void>();
  @Output() songRemoved = new EventEmitter<void>();
  
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
    private topThirteenStateService: TopThirteenStateService,
    private toastr: ToastrService,
    private albumThemeService: AlbumThemeService
  ) {
    this.albumTheme = this.albumThemeService.getTheme(undefined);
  }

  ngOnInit() {
    
    // Subscribe to state service
    this.topThirteenStateService.topThirteen$.subscribe(
      list => {
        this.topThirteen = list;
        this.loadExistingSong();
      }
    );
    
    this.disableAudioRightClick();
    
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(500),
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
      this.selectedSong = null;
      this.updateAlbumTheme();
    }
  }

  searchSongs() {
    this.searchSubject.next(this.searchQuery);
  }

  selectSong(song: SearchResult) {
    console.log('Selected song:', song.title);
    this.fetchSongDetails(song._id);
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
      return;
    }

    // Update locally without saving to backend
    this.selectedSong = song;
    this.updateAlbumTheme();
    this.updateLocalTopThirteen(song);
  }

  updateLocalTopThirteen(song: Song) {
    // Update the local state only
    const updatedList = [...this.topThirteen];
    const existingItemIndex = updatedList.findIndex(item => item.slot === this.slotIndex);
    
    const newItem: TopThirteenItem = {
      slot: this.slotIndex,
      albumName: song.album,
      songId: song._id!,
      songTitle: song.title,
      albumCover: song.albumImageSource
    };

    if (existingItemIndex !== -1) {
      updatedList[existingItemIndex] = newItem;
    } else {
      updatedList.push(newItem);
    }

    console.log('Updating local top thirteen:', updatedList);
    this.topThirteenStateService.updateTopThirteen(updatedList);
    this.toastr.success('Song added to slot ' + this.slotIndex + '! Remember to save your changes.', 'Success');
    this.songUpdated.emit();
    this.resetSelection();
  }

  resetSelection() {
    this.searchQuery = '';
    this.searchResults = [];
  }

  handleImageError(event: any) {
    event.target.src = 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.jpg';
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
    // Remove from local state only
    const updatedList = this.topThirteen.map(item => {
      if (item.slot === this.slotIndex) {
        return {
          slot: this.slotIndex,
          albumName: '',
          songId: '',
          songTitle: '',
          albumCover: ''
        };
      }
      return item;
    });

    console.log('Removing song from local state:', updatedList);
    this.topThirteenStateService.updateTopThirteen(updatedList);
    this.selectedSong = null;
    this.updateAlbumTheme();
    this.resetSelection();
    this.toastr.success('Song removed from slot ' + this.slotIndex + '! Remember to save your changes.', 'Success');
    this.songRemoved.emit();
  }
}