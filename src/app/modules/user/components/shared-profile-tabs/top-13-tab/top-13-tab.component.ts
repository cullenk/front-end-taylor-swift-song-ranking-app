// top-13-tab.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfile } from '../../../../../interfaces/userProfile';

@Component({
  selector: 'app-top-13-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-13-tab.component.html',
  styleUrls: ['./top-13-tab.component.scss'],
})
export class Top13TabComponent implements OnInit {
  @Input() userProfile!: UserProfile;
  @Input() isEditable: boolean = false; 
  @Input() isOwner: boolean = false;

  ngOnInit() {
    this.disableAudioRightClick();
  }

  // Add getter to safely check if top thirteen exists
  get hasTopThirteen(): boolean {
    return !!(this.userProfile?.rankings?.topThirteen?.length && this.userProfile.rankings.topThirteen.length > 0);
  }

  // Add getter to safely get top thirteen songs
  get topThirteenSongs() {
    return this.userProfile?.rankings?.topThirteen || [];
  }

  disableAudioRightClick() {
    document.addEventListener(
      'contextmenu',
      (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
          e.preventDefault();
        }
      },
      false
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
  }
}