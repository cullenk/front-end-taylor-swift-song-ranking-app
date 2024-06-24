import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../../../services/album.service';
import { TopThirteenService } from '../../../../services/top-thirteen.service';
import { SearchResult } from '../../../../interfaces/SearchResult';
import { Album } from '../../../../interfaces/Album';
import { Song } from '../../../../interfaces/Song';
import { TopThirteenItem } from '../../../../interfaces/Top13Item';


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

  constructor(
    private albumService: AlbumService,
    private topThirteenService: TopThirteenService
  ) {}

  ngOnInit() {
    this.loadExistingSong();
  }

  loadExistingSong() {
    this.topThirteenService.getTopThirteen().subscribe(
      (topThirteen: TopThirteenItem[]) => {
        const existingSong = topThirteen.find(item => item.slot === this.slotIndex);
        if (existingSong) {
          this.albumService.getAlbumBySong(existingSong.songTitle).subscribe(
            (albums: Album[]) => {
              const album = albums.find(a => a._id === existingSong.albumId);
              if (album) {
                this.selectedAlbum = album;
                this.selectedSong = album.songs.find(song => song.title === existingSong.songTitle) || null;
              }
            },
            error => console.error('Error loading album:', error)
          );
        }
      },
      error => console.error('Error loading top thirteen:', error)
    );
  }

  searchSongs() {
    this.albumService.searchSongs(this.searchQuery).subscribe(
      (results: SearchResult[]) => {
        this.searchResults = results;
      },
      error => console.error('Error searching songs:', error)
    );
  }

  selectSong(result: SearchResult) {
    this.selectedSong = result.song;
    this.selectedAlbum = result.album;
    this.updateTopThirteen();
  }

  updateTopThirteen() {
    if (this.selectedSong && this.selectedAlbum) {
      this.topThirteenService.updateSong(
        this.slotIndex,
        this.selectedAlbum._id!,
        this.selectedSong.title
      ).subscribe(
        () => console.log('Top 13 list updated successfully'),
        error => console.error('Error updating top 13 list:', error)
      );
    }
  }

  getColorFromAlbum(albumTitle: string | undefined): string {
    return albumTitle === 'Taylor Swift' ? '#00FF00' : 'red';
  }

  resetSong() {
    this.selectedSong = null;
    this.selectedAlbum = null;
    this.searchQuery = '';
    this.searchResults = [];
    this.topThirteenService.removeSong(this.slotIndex).subscribe(
      () => console.log('Song removed from top 13 list'),
      error => console.error('Error removing song from top 13 list:', error)
    );
  }
}