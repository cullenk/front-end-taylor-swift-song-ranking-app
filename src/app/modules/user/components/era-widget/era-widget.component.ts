import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, catchError, of, finalize } from 'rxjs';

import { EraSetList, EraSetListSong } from '../../../../interfaces/EraSetList';
import { Song } from '../../../../interfaces/Song';
import { AlbumService } from '../../../../services/album.service';

type SongType = 'guitar' | 'piano' | null;

@Component({
  selector: 'app-era-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './era-widget.component.html',
  styleUrls: ['./era-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EraWidgetComponent implements OnInit, OnDestroy {
  @Input() era!: EraSetList;
  @Input() totalSongs!: number;
  @Input() totalMashups!: number;
  @Output() eraUpdated = new EventEmitter<EraSetList>();
  
  // Component State
  allSongs: Song[] = [];
  isLoadingSongs = false;
  loadingError = false;
  
  // Dialog State
  showAddSongDialog = false;
  isMashup = false;
  selectedSongTitle = '';
  firstSongId = '';
  secondSongId = '';
  songType: SongType = null;
  
  // Surprise Songs State
  guitarSong: EraSetListSong = { _id: '', title: '', audioSource: '' };
  pianoSong: EraSetListSong = { _id: '', title: '', audioSource: '' };
  
  // Subscriptions
  private subscriptions = new Subscription();

  // Album Cover URLs
  private readonly albumCovers: { [key: string]: string } = {
    'Debut': 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
    'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
    'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
    'Red': 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
    '1989': 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
    'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
    'Lover': 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
    'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
    'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
    'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
    'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
    'Surprise Songs': 'https://d3e29z0m37b0un.cloudfront.net/surpriseSongs.webp'
  };

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Initialize component based on era type
   */
  private initializeComponent(): void {
    if (this.era.era === 'Surprise Songs') {
      this.initializeSurpriseSongs();
    } else {
      this.loadSongs();
    }
  }

  /**
   * Initialize surprise songs from existing data
   */
private initializeSurpriseSongs(): void {
  // Reset to empty songs first
  this.guitarSong = this.createEmptySong();
  this.pianoSong = this.createEmptySong();
  
  // Then populate from existing data
  // Note: We need to determine which song is which based on some logic
  // For now, let's assume first song is guitar, second is piano
  if (this.era.songs.length >= 1 && this.era.songs[0]) {
    this.guitarSong = { ...this.era.songs[0] };
  }
  
  if (this.era.songs.length >= 2 && this.era.songs[1]) {
    this.pianoSong = { ...this.era.songs[1] };
  }
}

  /**
   * Create empty song object
   */
  private createEmptySong(): EraSetListSong {
    return { _id: '', title: '', audioSource: '' };
  }

  /**
   * Load songs for the current era
   */
  loadSongs(): void {
    if (this.era.era === 'Surprise Songs' || this.allSongs.length > 0) {
      return;
    }

    this.isLoadingSongs = true;
    this.loadingError = false;

    const songsSub = this.albumService.getSongsByAlbum(this.era.era).pipe(
      catchError((error) => {
        console.error(`Error loading songs for ${this.era.era}:`, error);
        this.loadingError = true;
        return of([]);
      }),
      finalize(() => {
        this.isLoadingSongs = false;
      })
    ).subscribe({
      next: (songs: Song[]) => {
        this.allSongs = songs;
      }
    });

    this.subscriptions.add(songsSub);
  }

  /**
   * Open dialog to add a song
   */
  openAddSongDialog(songType: SongType = null): void {
    this.songType = songType;
    this.showAddSongDialog = true;
    this.resetDialogState();
    
    // Load songs if needed for non-surprise eras
    if (this.era.era !== 'Surprise Songs' && this.allSongs.length === 0) {
      this.loadSongs();
    }
  }

  /**
   * Close the add song dialog
   */
  closeAddSongDialog(): void {
    this.showAddSongDialog = false;
    this.resetDialogState();
    this.songType = null;
  }

  /**
   * Reset dialog form state
   */
  private resetDialogState(): void {
    this.selectedSongTitle = '';
    this.isMashup = false;
    this.firstSongId = '';
    this.secondSongId = '';
    
  }

  /**
   * Handle mashup toggle
   */
  onMashupToggle(): void {
    this.selectedSongTitle = '';
    this.firstSongId = '';
    this.secondSongId = '';
  }

  /**
   * Save surprise song
   */
saveSurpriseSong(): void {
  if (!this.canSaveSurpriseSong()) {
    console.log('Cannot save surprise song:', {
      selectedSongTitle: this.selectedSongTitle,
      songType: this.songType,
      canSave: this.canSaveSurpriseSong()
    });
    return;
  }

  const newSong: EraSetListSong = {
    _id: '',
    title: this.selectedSongTitle.trim(),
    audioSource: '',
    isMashup: this.selectedSongTitle.includes('/')
  };

  if (this.songType === 'guitar') {
    this.guitarSong = newSong;
  } else if (this.songType === 'piano') {
    this.pianoSong = newSong;
  }

  this.updateSurpriseSongsArray();
  this.closeAddSongDialog();
}

  /**
   * Remove surprise song
   */
  removeSurpriseSong(songType: 'guitar' | 'piano'): void {
    if (songType === 'guitar') {
      this.guitarSong = this.createEmptySong();
    } else if (songType === 'piano') {
      this.pianoSong = this.createEmptySong();
    }
    
    this.updateSurpriseSongsArray();
  }

  /**
   * Update surprise songs array and emit changes
   */
private updateSurpriseSongsArray(): void {
  const songs: EraSetListSong[] = [];
  
  // Always maintain the order: guitar first, piano second
  // But only include songs that have actual titles
  if (this.guitarSong.title.trim()) {
    songs.push({ ...this.guitarSong });
  }
  if (this.pianoSong.title.trim()) {
    // If guitar song doesn't exist but piano does, we need to handle the array positioning
    if (songs.length === 0) {
      // Piano song goes in first position if no guitar song
      songs.push({ ...this.pianoSong });
    } else {
      // Piano song goes in second position
      songs.push({ ...this.pianoSong });
    }
  }

  this.era.songs = songs;
  this.eraUpdated.emit({ ...this.era });
}

  /**
   * Save regular album song
   */
  saveSong(): void {
    if (!this.canSaveRegularSong()) {
      return;
    }
  
    if (this.isMashup) {
      this.saveMashupSong();
    } else {
      this.saveRegularSong();
    }
    
    this.eraUpdated.emit({ ...this.era });
    this.closeAddSongDialog();
  }

  /**
   * Save mashup song
   */
  private saveMashupSong(): void {
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
  }

  /**
   * Save regular song
   */
  private saveRegularSong(): void {
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

  /**
   * Remove song from era
   */
  removeSong(index: number): void {
    if (index >= 0 && index < this.era.songs.length) {
      this.era.songs.splice(index, 1);
      this.eraUpdated.emit({ ...this.era });
    }
  }

  /**
   * Get album cover URL for era
   */
  getAlbumCover(era: string): string {
    return this.albumCovers[era] || '';
  }

  /**
   * Check if surprise song can be saved
   */
  private canSaveSurpriseSong(): boolean {
    return this.selectedSongTitle.trim().length > 0;
  }

  /**
   * Check if regular song can be saved
   */
  private canSaveRegularSong(): boolean {
    if (this.isMashup) {
      return this.canSaveMashup();
    }
    
    return this.totalSongs < 45 && 
           this.selectedSongTitle !== '' &&
           !this.isSongAlreadySelected(this.selectedSongTitle);
  }

  /**
   * Check if mashup can be saved
   */
  private canSaveMashup(): boolean {
    return this.totalMashups < 3 && 
           this.totalSongs < 45 && 
           this.firstSongId !== '' && 
           this.secondSongId !== '' &&
           this.firstSongId !== this.secondSongId &&
           !this.isSongAlreadySelected(this.firstSongId) && 
           !this.isSongAlreadySelected(this.secondSongId);
  }

  /**
   * Check if can save any song (unified method for template)
   */
  canSaveSong(): boolean {
    if (this.era.era === 'Surprise Songs') {
      return this.canSaveSurpriseSong();
    }
    return this.canSaveRegularSong();
  }

  /**
   * Check if song is already selected in this era
   */
  isSongAlreadySelected(songId: string): boolean {
    return this.era.songs.some(song => {
      if (song.isMashup && typeof song._id === 'string' && song._id.includes('/')) {
        const [firstId, secondId] = song._id.split('/');
        return songId === firstId || songId === secondId;
      }
      return song._id === songId;
    });
  }

  /**
   * Get surprise song by type
   */
  getSurpriseSong(type: 'guitar' | 'piano'): EraSetListSong {
    return type === 'guitar' ? this.guitarSong : this.pianoSong;
  }

  /**
   * Check if surprise song exists
   */
  hasSurpriseSong(type: 'guitar' | 'piano'): boolean {
    const song = this.getSurpriseSong(type);
    return song.title.trim() !== '';
  }

  /**
   * Check if era can accept more songs
   */
  canAddMoreSongs(): boolean {
    if (this.era.era === 'Surprise Songs') {
      return this.era.songs.length < 2;
    }
    return this.era.songs.length < 6;
  }

  /**
   * Get remaining song slots for this era
   */
  getRemainingSlots(): number {
    const maxSlots = this.era.era === 'Surprise Songs' ? 2 : 6;
    return maxSlots - this.era.songs.length;
  }

  /**
   * Get era progress percentage
   */
  getEraProgress(): number {
    if (this.era.era === 'Surprise Songs') {
      return (this.era.songs.length / 2) * 100;
    }
    return Math.min((this.era.songs.length / 6) * 100, 100);
  }

  /**
   * Check if era has minimum required songs
   */
  hasMinimumSongs(): boolean {
    if (this.era.era === 'Surprise Songs') {
      return this.era.songs.length >= 2;
    }
    return this.era.songs.length >= 1;
  }

  /**
   * Get button disabled tooltip
   */
  getButtonTooltip(): string {
    if (this.era.era === 'Surprise Songs') {
      return this.era.songs.length >= 2 ? 'Maximum 2 surprise songs allowed!' : '';
    }
    return this.era.songs.length >= 6 ? 'Maximum 6 songs allowed per era!' : '';
  }

  /**
   * Get available songs (excluding already selected ones)
   */
  getAvailableSongs(): Song[] {
    return this.allSongs.filter(song => !this.isSongAlreadySelected(song._id));
  }

  /**
   * Track by function for song lists
   */
  trackBySongId(index: number, song: Song): string {
    return song._id;
  }

  /**
   * Track by function for era songs
   */
  trackByEraSong(index: number, song: EraSetListSong): string {
    return song._id || `${index}-${song.title}`;
  }
}