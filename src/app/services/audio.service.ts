import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlayingSubject = new BehaviorSubject<boolean>(false);

  isPlaying$ = this.isPlayingSubject.asObservable();

  play(audioElement: HTMLAudioElement) {
    if (this.currentAudio && this.currentAudio !== audioElement) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.currentAudio = audioElement;
    audioElement.play();
    this.isPlayingSubject.next(true);
  }

  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.isPlayingSubject.next(false);
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlayingSubject.next(false);
    }
  }
}