import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RankingsService } from "../../../../../services/rankings.service";
import { AlbumService } from "../../../../../services/album.service";
import { Album } from "../../../../../interfaces/Album";
import { Song } from "../../../../../interfaces/Song";
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Ranking, Rankings } from '../../../../../interfaces/Rankings';
import { Router } from "@angular/router";

@Component({
  selector: 'app-red-ranking',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './red-ranking.component.html',
  styleUrls: ['./red-ranking.component.scss']
})
export class RedRankingComponent implements OnInit {
  rankings: Ranking[] = [];
  songs: Song[] = [];
  @ViewChildren('audioPlayer') audioPlayers!: QueryList<ElementRef>;
  currentlyPlaying: Song | null = null;

  constructor(
    private rankingsService: RankingsService,
    private albumService: AlbumService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlbumData();
    this.disableAudioRightClick();
  }

  goBackToAlbumRankings() {
    this.router.navigate(['user/rankings']); 
  }

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
        e.preventDefault();
      }
    }, false);
  }

  loadAlbumData() {
    this.albumService.getAlbumByTitle("Red (Taylor's Version)").subscribe(
      (album: Album) => {
        this.songs = album.songs.map(song => ({
          ...song,
          album: album.title
        }));
        // console.log('Loaded album songs:', this.songs);
        this.loadRankings();
      },
      error => {
        console.error('Error fetching album:', error);
      }
    );
  }

  loadRankings() {
    this.rankingsService.getUserRankings().subscribe(
      (rankings: Rankings) => {
        if (rankings && rankings.albumRankings && rankings.albumRankings['red']) {
          this.rankings = rankings.albumRankings['red'].sort((a, b) => a.rank - b.rank);
          // console.log('Loaded rankings:', this.rankings);
        } else {
          this.rankings = [];
          console.log('No rankings found');
        }
        this.applyRankingsToSongs();
      },
      error => {
        console.error('Error fetching rankings:', error);
        this.rankings = [];
        this.applyRankingsToSongs(); // Ensure songs are displayed even if no rankings are found
      }
    );
  }

  applyRankingsToSongs() {
    if (this.songs.length > 0) {
      if (this.rankings.length > 0) {
        // Create a map of songId to rank
        const rankMap = new Map(this.rankings.map(r => [r.songId, r.rank]));
  
        // Sort the songs based on their rank, or keep original order if not ranked
        this.songs.sort((a, b) => {
          const rankA = rankMap.get(a._id!) ?? Infinity;
          const rankB = rankMap.get(b._id!) ?? Infinity;
          return (rankA as number) - (rankB as number);
        });
      } else {
        console.log('No rankings found, displaying all songs in original order');
      }
    } else {
      console.log('No songs found');
    }
    // console.log('Final songs array:', this.songs);
  }
  

  onDrop(event: CdkDragDrop<Song[]>) {
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
    this.updateRankings();
  }

  updateRankings() {
    const newRankings = this.songs.map((song, index) => ({
      slot: index + 1,
      albumName: song.album, 
      songId: song._id!,
      songTitle: song.title,
      albumCover: song.albumImageSource,
      rank: index + 1
    }));
  
    this.rankingsService.updateRanking('red', newRankings).subscribe(
      response => console.log('Rankings updated'),
      error => console.error('Error updating rankings:', error)
    );
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

  handleAudioError(event: any) {
    console.error('Audio failed to load:', event);
    // You can add error handling logic here, e.g., showing a toast message
  }
}
