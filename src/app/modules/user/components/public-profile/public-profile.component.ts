import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../services/user-profile.service';
import { AlbumService } from '../../../../services/album.service';
import { forkJoin } from 'rxjs';
import { Song } from '../../../../interfaces/Song';
import { UserProfile } from '../../../../interfaces/userProfile';
import { RankingsService } from '../../../../services/rankings.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  userProfile: UserProfile = {
    theme: '',
    profileImage: '',
    username: '',
    rankings: { topThirteen: [] },
    profileQuestions: []
  };
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

  profileImages: string[] = [
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/1989-2.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/1989.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/benjaminButton.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/cats.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/chiefs.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/crazy.png',    
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/evermore.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/fearless.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/folklore.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/fortnite.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/london.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/lover.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/meredithGrey.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/midnights.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/midnights2.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/oliviaBenson.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/red.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/red2.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/reputation.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/silly.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/speakNow.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/travis.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/ttpd.png',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/youBelong.png',
  ];
  defaultProfileImage = 'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.png';

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
  topFiveAlbums: any[] = [];
  hasErasTourSetlist: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private rankingsService: RankingsService,
    private albumService: AlbumService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userProfileService.getPublicProfile(username).subscribe(
        (data: UserProfile) => {
          this.userProfile = this.setDefaultsIfNeeded(data);
          this.sortProfileQuestions();
          this.loadTopThirteenDetails();
          this.loadTopFiveAlbums(username);
          this.checkErasTourSetlist(username);
          this.updateMetaTags(username);
        },
        error => {
          console.error(`Error fetching public profile for ${username}`, error);
          this.error = 'Failed to load profile. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      this.error = 'No username provided';
      this.isLoading = false;
    }
    this.disableAudioRightClick();
  }

  ngOnDestroy() {
    // Pause all audio elements when the component is destroyed
    document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }

  updateMetaTags(username: string) {
    const title = `${username}'s Profile - Swiftie Ranking Hub`;
    const description = `Check out ${username}'s Taylor Swift rankings and profile on Swiftie Ranking Hub!`;
    const imageUrl = this.userProfile.profileImage || 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: `https://swiftierankinghub.com/public-profile/${username}` });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  loadTopFiveAlbums(username: string) {
    this.rankingsService.getTopFiveAlbums(username).subscribe(
      albums => {
        this.topFiveAlbums = albums;
      },
      error => {
        console.error('Error loading top 5 albums:', error);
      }
    );
  }

  checkErasTourSetlist(username: string) {
    this.userProfileService.hasCompletedErasTourSetlist(username).subscribe(
      hasSetlist => {
        this.hasErasTourSetlist = hasSetlist;
      },
      error => {
        console.error('Error checking Eras Tour setlist:', error);
      }
    );
  }

  setDefaultsIfNeeded(profile: UserProfile): UserProfile {
    return {
      ...profile,
      theme: profile.theme || 'Fearless',
      profileImage: profile.profileImage || this.defaultProfileImage,
      rankings: profile.rankings || { topThirteen: [] },
      profileQuestions: profile.profileQuestions || this.getDefaultProfileQuestions()
    };
  }
  
  getDefaultProfileQuestions(): { question: string, answer: string }[] {
    return this.orderedQuestions.map(question => ({ question, answer: '' }));
  }

  loadTopThirteenDetails() {
    if (this.userProfile?.rankings?.topThirteen?.length > 0) {
      const songRequests = this.userProfile.rankings.topThirteen.map(song =>
        this.albumService.getSongById(song.songId)
      );
  
      forkJoin(songRequests).subscribe(
        (songs: (Song | null)[]) => {
          if (this.userProfile && this.userProfile.rankings && this.userProfile.rankings.topThirteen) {
            this.userProfile.rankings.topThirteen = this.userProfile.rankings.topThirteen.map((song, index) => {
              const songDetails = songs[index];
              if (songDetails) {
                return {
                  ...song,
                  albumImage: songDetails.albumImageSource,
                  audioSource: songDetails.audioSource
                };
              }
              return song; // Return the original song if no details were found
            });
            // Ensure the list is sorted by slot
            this.userProfile.rankings.topThirteen.sort((a, b) => a.slot - b.slot);
          }
          this.isLoading = false;
        },
        error => {
          console.error('Error loading song details', error);
          this.error = 'Failed to load song details. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      console.log('No top thirteen songs found, setting defaults');
      this.userProfile.rankings = {
        topThirteen: Array(13).fill(null).map((_, index) => ({
          slot: index + 1,
          songId: '',
          songTitle: 'Not selected',
          albumImage: 'path/to/default/album/image.jpg',
          audioSource: '',
          albumName: 'Unknown Album'
        }))
      };
      this.isLoading = false;
    }
  }

  getThemeClass(): string {
    return this.userProfile?.theme ? (this.themeClassMap[this.userProfile.theme] || 'Fearless') : 'Fearless';
  }

  getProfileImage(): string {
    return this.userProfile.profileImage || this.defaultProfileImage;
  }

  private sortProfileQuestions() {
    if (this.userProfile && this.userProfile.profileQuestions) {
      this.userProfile.profileQuestions.sort((a, b) => {
        const indexA = this.orderedQuestions.indexOf(a.question);
        const indexB = this.orderedQuestions.indexOf(b.question);
        return indexA - indexB;
      });
    }
  }

  getThemeBackground(): string {
    const theme = this.userProfile?.theme || 'Fearless';
    return this.themeBackgrounds[theme] || this.themeBackgrounds['Fearless'];
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

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
        e.preventDefault();
      }
    }, false);
  }
}