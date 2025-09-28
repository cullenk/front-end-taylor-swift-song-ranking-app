import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TrackRankingService } from '../../../../../services/track-ranking-service';
import { TrackRankingItem } from '../../../../../interfaces/TrackRankingItem';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

@Component({
  selector: 'app-rank-by-track',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './rank-by-track.component.html',
  styleUrls: ['./rank-by-track.component.scss']
})
export class RankByTrackComponent implements OnInit, OnDestroy {
  trackRankings: TrackRankingItem[][] = [];
  perfectAlbum: TrackRankingItem[] = [];
  activeTab: 'rankings' | 'perfectAlbum' = 'rankings';
  isLoading = true;

  constructor(
    private trackRankingService: TrackRankingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTrackRankings();
    this.disableAudioRightClick();
  }

  ngOnDestroy() {
    // Clean up audio event listeners
    document.removeEventListener('contextmenu', this.handleContextMenu);
  }

  // Add trackBy function for better performance
  trackBySongId(index: number, song: TrackRankingItem): string {
    return song.songId;
  }

  loadTrackRankings() {
    this.isLoading = true;
    
    this.trackRankingService.getTrackRankings().subscribe({
      next: (rankings) => {
        this.trackRankings = rankings;
        this.updatePerfectAlbum();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching rankings:', error);
        this.toastr.error('Failed to load track rankings. Please try again.');
        this.isLoading = false;
      }
    });
  }

  drop(listIndex: number, event: CdkDragDrop<TrackRankingItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.trackRankings[listIndex], event.previousIndex, event.currentIndex);
      
      // Update ranks after moving
      this.trackRankings[listIndex].forEach((item, index) => {
        item.rank = index + 1;
      });
      
      this.updatePerfectAlbum();
    }
  }

  saveRankings() {
    this.isLoading = true;
    
    this.trackRankingService.saveTrackRankings(this.trackRankings).subscribe({
      next: () => {
        console.log('Rankings saved successfully');
        this.toastr.success('Progress saved successfully!');
        this.updatePerfectAlbum();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving rankings:', error);
        this.toastr.error('Failed to save progress. Please try again.');
        this.isLoading = false;
      }
    });
  }

  updatePerfectAlbum() {
    this.perfectAlbum = this.trackRankings
      .map(trackList => trackList.find(song => song.rank === 1))
      .filter(song => song !== undefined) as TrackRankingItem[];
  }

  private handleContextMenu = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
      e.preventDefault();
    }
  };

  disableAudioRightClick() {
    document.addEventListener('contextmenu', this.handleContextMenu, false);
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
  }

  goBackToAlbumRankings() {
    this.router.navigate(['user/rankings']);
  }
}