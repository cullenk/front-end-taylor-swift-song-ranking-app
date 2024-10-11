import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TrackRankingService } from '../../../../../services/track-ranking-service';
import { TrackRankingItem } from '../../../../../interfaces/TrackRankingItem';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rank-by-track',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './rank-by-track.component.html',
  styleUrls: ['./rank-by-track.component.scss']
})
export class RankByTrackComponent implements OnInit {
  trackRankings: TrackRankingItem[][] = [];
  perfectAlbum: TrackRankingItem[] = [];
  activeTab: 'rankings' | 'perfectAlbum' = 'rankings';

  constructor(
    private trackRankingService: TrackRankingService,
    private toastr: ToastrService,
    ) {}

  ngOnInit() {
    this.trackRankingService.getTrackRankings().subscribe(
      rankings => {
        this.trackRankings = rankings;
        this.updatePerfectAlbum();
      },
      error => console.error('Error fetching rankings:', error)
    );
    this.disableAudioRightClick();
  }

  drop(listIndex: number, event: CdkDragDrop<TrackRankingItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.trackRankings[listIndex], event.previousIndex, event.currentIndex);
      // Update ranks after moving
      this.trackRankings[listIndex].forEach((item, index) => item.rank = index + 1);
      this.updatePerfectAlbum();
    }
  }

  saveRankings() {
    this.trackRankingService.saveTrackRankings(this.trackRankings).subscribe(
      () => {
        console.log('Rankings saved successfully');
        this.toastr.success('Progress saved successfully'),
        this.updatePerfectAlbum();
      },
      error => {
        console.error('Error saving rankings:', error),
      this.toastr.error('Failed to save progress')
      }
    );
  }

  updatePerfectAlbum() {
    this.perfectAlbum = this.trackRankings.map(trackList => 
      trackList.find(song => song.rank === 1)
    ).filter(song => song !== undefined) as TrackRankingItem[];
  }

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
        e.preventDefault();
      }
    }, false);
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