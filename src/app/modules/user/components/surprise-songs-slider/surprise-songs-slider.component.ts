import { Component, OnInit, OnDestroy } from '@angular/core';
import { RankingsService } from '../../../../services/rankings.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SurpriseSong } from '../../../../interfaces/SurpriseSong';

@Component({
  selector: 'app-surprise-songs-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './surprise-songs-slider.component.html',
  styleUrls: ['./surprise-songs-slider.component.scss']
})
export class SurpriseSongsSliderComponent implements OnInit, OnDestroy {
  surpriseSongs: SurpriseSong[] = [];
  currentSong: SurpriseSong | null = null;
  currentIndex = 0;
  private intervalSubscription: Subscription | null = null;

  constructor(private rankingsService: RankingsService) {}

  ngOnInit() {
    this.loadSurpriseSongs();
  }

  loadSurpriseSongs() {
    this.rankingsService.getSurpriseSongs().subscribe(
      songs => {
        this.surpriseSongs = this.shuffleArray(songs.filter(song => song.guitar !== 'Not set' || song.piano !== 'Not set'));
        if (this.surpriseSongs.length > 0) {
          this.startCycling();
        }
      },
      error => console.error('Error loading surprise songs:', error)
    );
  }

  startCycling() {
    this.currentSong = this.surpriseSongs[0];
    this.intervalSubscription = interval(8000).subscribe(() => {
      this.nextSong();
    });
  }

  nextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.surpriseSongs.length;
    this.currentSong = this.surpriseSongs[this.currentIndex];
    this.resetInterval();
  }

  previousSong() {
    this.currentIndex = (this.currentIndex - 1 + this.surpriseSongs.length) % this.surpriseSongs.length;
    this.currentSong = this.surpriseSongs[this.currentIndex];
    this.resetInterval();
  }

  resetInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.intervalSubscription = interval(8000).subscribe(() => {
      this.nextSong();
    });
  }

  shuffleArray(array: SurpriseSong[]): SurpriseSong[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}