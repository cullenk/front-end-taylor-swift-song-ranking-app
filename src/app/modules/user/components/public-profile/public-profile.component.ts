import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../services/user-profile.service';
import { AlbumService } from '../../../../services/album.service';
import { forkJoin } from 'rxjs';

interface TopThirteenSong {
  songTitle: string;
  slot: number;
  albumId?: string;
  albumImage?: string;
  audioSource?: string;
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
    'Debut': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/debut-profile-bg.jpeg',
    'Fearless': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/fearless-profile-bg.jpeg',
    'Speak Now': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/speak-now-profile-bg.jpeg',
    'Red': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/red-profile-bg.jpeg',
    '1989': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/1989-profile-bg.jpeg',
    'Reputation': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/reputation-profile-bg.jpeg',
    'Lover': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/lover-profile-bg.jpeg',
    'Folklore': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/folklore-profile-bg.jpeg',
    'Evermore': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/evermore-profile-bg.jpeg',
    'Midnights': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/midnights-profile-bg.jpeg',
    'The Tortured Poets Department': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/profile+backgrounds/ttpd-profile-bg.jpeg'
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
    if (this.publicProfile?.rankings?.topThirteen) {
      const albumRequests = this.publicProfile.rankings.topThirteen.map((song: TopThirteenSong) => 
        this.albumService.getAlbumBySong(song.songTitle)
      );

      forkJoin(albumRequests).subscribe(
        (albums: any[]) => {
          this.publicProfile!.rankings.topThirteen = this.publicProfile!.rankings.topThirteen.map((song: TopThirteenSong, index: number) => ({
            ...song,
            albumImage: albums[index].albumImage,
            audioSource: albums[index].songs.find((s: { title: string }) => s.title === song.songTitle)?.audioSource
          }));
          // Ensure the list is sorted by slot
          this.publicProfile!.rankings.topThirteen.sort((a: TopThirteenSong, b: TopThirteenSong) => a.slot - b.slot);
          this.isLoading = false;
        },
        error => {
          console.error('Error loading album details', error);
          this.error = 'Failed to load album details. Please try again.';
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