import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../services/user-profile.service';
import { AlbumService } from '../../../../services/album.service';
import { forkJoin } from 'rxjs';
import { Song } from '../../../../interfaces/Song';

interface TopThirteenSong {
  songTitle: string;
  slot: number;
  albumName?: string;
  albumImage?: string;
  audioSource?: string;
  songId: string;
}

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  publicProfile: {
    username: string;
    theme: string;
    rankings: {
      topThirteen: TopThirteenSong[];
    };
    profileQuestions: { question: string; answer: string }[];
  } | null = null;
  isLoading = true;
  error: string | null = null;

  themeBackgrounds: { [key: string]: string } = {
    'Debut': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/debut-profile-bg.jpeg',
    'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/fearless-profile-bg.jpeg',
    'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/speak-now-profile-bg.jpeg',
    'Red': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/red-profile-bg.jpeg',
    '1989': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/1989-profile-bg.jpeg',
    'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/reputation-profile-bg.jpeg',
    'Lover': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/lover-profile-bg.jpeg',
    'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/folklore-profile-bg.jpeg',
    'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/evermore-profile-bg.jpeg',
    'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/midnights-profile-bg.jpeg',
    'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/ttpd-profile-bg.jpeg'
  };

  themeClassMap: { [key: string]: string } = {
    'Debut': 'Debut',
    'Fearless': 'Fearless',
    'Speak Now': 'SpeakNow',
    'Red': 'Red',
    '1989': '_1989',
    'Reputation': 'Reputation',
    'Lover': 'Lover',
    'Folklore': 'Folklore',
    'Evermore': 'Evermore',
    'Midnights': 'Midnights',
    'The Tortured Poets Department': 'TorturedPoets'
  };
  

  orderedQuestions = [
    'What album made you a Swiftie?',
    'What are your dream surprise songs? (Mashups allowed!)',
    'What song would you play first for a non-swiftie?',
    'What would be your cry in the car song?',
    'Which song makes you have a dance party in your room?',
    'Which song would you want to walk down the aisle to?',
    'Hot take: What are three songs you usually skip?',
    'Which Eras Tour set is your favorite?',
    'Which album cover is your favorite?',
    'What song has your favorite bridge?',
    'What song has your favorite chorus?',
    'What is your favorite lyric from any song?',
    'Dream artist collaboration with Taylor?'
  ];

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private albumService: AlbumService
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userProfileService.getPublicProfile(username).subscribe(
        (data: any) => {
          this.publicProfile = data;
          this.sortProfileQuestions();
          this.loadTopThirteenDetails();
        },
        error => {
          console.error('Error fetching public profile', error);
          this.error = 'Failed to load profile. Please try again.';
          this.isLoading = false;
        }
      );
    }
    this.disableAudioRightClick();
  }

  loadTopThirteenDetails() {
    // console.log('Entering loadTopThirteenDetails');
    if (this.publicProfile?.rankings?.topThirteen) {
      const songRequests = this.publicProfile.rankings.topThirteen.map(song =>
        this.albumService.getSongById(song.songId)
      );
  
      forkJoin(songRequests).subscribe(
        (songs: Song[]) => {
          this.publicProfile!.rankings.topThirteen = this.publicProfile!.rankings.topThirteen.map((song, index) => {
            const songDetails = songs[index];
            return {
              ...song,
              albumImage: songDetails.albumImageSource,
              audioSource: songDetails.audioSource
            };
          });
          // Ensure the list is sorted by slot
          this.publicProfile!.rankings.topThirteen.sort((a, b) => a.slot - b.slot);
          this.isLoading = false;
        },
        error => {
          console.error('Error loading song details', error);
          this.error = 'Failed to load song details. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  getThemeClass(): string {
    return this.publicProfile?.theme ? this.themeClassMap[this.publicProfile.theme] : '';
  }

  private sortProfileQuestions() {
    if (this.publicProfile && this.publicProfile.profileQuestions) {
      this.publicProfile.profileQuestions.sort((a, b) => {
        const indexA = this.orderedQuestions.indexOf(a.question);
        const indexB = this.orderedQuestions.indexOf(b.question);
        return indexA - indexB;
      });
    }
  }

  getThemeBackground(): string {
    return this.publicProfile?.theme ? this.themeBackgrounds[this.publicProfile.theme] : '';
  }

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
        e.preventDefault();
      }
    }, false);
  }
}