import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RankingsService } from "../../../../../services/rankings.service";
import { AlbumService } from "../../../../../services/album.service";
import { Album } from "../../../../../interfaces/Album";
import { Song } from "../../../../../interfaces/Song";
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Ranking, Rankings } from '../../../../../interfaces/Rankings';

@Component({
  selector: 'app-fearless-ranking',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './fearless-ranking.component.html',
  styleUrls: ['./fearless-ranking.component.scss']
})
export class FearlessRankingComponent implements OnInit {
  rankings: Ranking[] = [];
  album: Album | null = null;
  songs: Song[] = [];
  @ViewChildren('audioPlayer') audioPlayers!: QueryList<ElementRef>;
  currentlyPlaying: Song | null = null;

  constructor(
    private rankingsService: RankingsService,
    private albumService: AlbumService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.albumService.getAlbumBySong('Fearless').subscribe(
      (album: Album) => {
        this.album = album;
        this.songs = [...album.songs];
        console.log('Loaded album songs:', this.songs);
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
        if (rankings && rankings.albumRankings && rankings.albumRankings['fearless']) {
          this.rankings = rankings.albumRankings['fearless'].sort((a, b) => a.rank - b.rank);
          console.log('Loaded rankings:', this.rankings);
        } else {
          this.rankings = [];
          console.log('No rankings found');
        }
        this.applyRankingsToSongs();
      },
      error => console.error('Error fetching rankings:', error)
    );
  }

  applyRankingsToSongs() {
    if (this.songs.length > 0) {
      if (this.rankings.length > 0) {
        // Create a map of songId to rank
        const rankMap = new Map(this.rankings.map(r => [r.songId, r.rank]));
        
        // Sort the songs based on their rank, or keep original order if not ranked
        this.songs.sort((a, b) => {
          const rankA = rankMap.get(a._id) || Infinity;
          const rankB = rankMap.get(b._id) || Infinity;
          return rankA - rankB;
        });
      } else {
        console.log('No rankings found, displaying all songs in original order');
      }
    } else {
      console.log('No songs found in the album');
    }
    console.log('Final songs array:', this.songs);
  }
  

  onDrop(event: CdkDragDrop<Song[]>) {
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
    this.updateRankings();
  }

  updateRankings() {
    const newRankings = this.songs.map((song, index) => ({
      songId: song._id,
      rank: index + 1
    }));
  
    this.rankingsService.updateRanking('fearless', newRankings).subscribe(
      response => console.log('Rankings updated'),
      error => console.error('Error updating rankings:', error)
    );
  }

  //Audio Player Behavior
  // togglePlay(song: Song, audioElement: HTMLAudioElement) {
  //   if (this.currentlyPlaying && this.currentlyPlaying !== song) {
  //     // Stop the currently playing song
  //     this.stopCurrentSong();
  //   }

  //   if (this.currentlyPlaying === song) {
  //     // Pause the current song
  //     audioElement.pause();
  //     this.currentlyPlaying = null;
  //   } else {
  //     // Play the selected song
  //     audioElement.play();
  //     this.currentlyPlaying = song;
  //   }
  // }

  // stopCurrentSong() {
  //   if (this.currentlyPlaying) {
  //     const audioElement = this.audioPlayers.find(player => 
  //       player.nativeElement.src === this.currentlyPlaying?.audioSource
  //     )?.nativeElement;
  //     if (audioElement) {
  //       audioElement.pause();
  //       audioElement.currentTime = 0;
  //     }
  //     this.currentlyPlaying = null;
  //   }
  // }

  // isPlaying(song: Song): boolean {
  //   return this.currentlyPlaying === song;
  // }

  handleAudioError(event: any) {
    console.error('Audio failed to load:', event);
    // You can add error handling logic here, e.g., showing a toast message
  }
}
