import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserProfileService } from '../../../../services/user-profile.service';
import { AlbumService } from '../../../../services/album.service';
import { RankingsService } from '../../../../services/rankings.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Song } from '../../../../interfaces/Song';
import { UserProfile } from '../../../../interfaces/userProfile';
import { AlbumRanking } from '../../../../interfaces/AlbumRanking';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TabbedProfileBaseComponent } from '../tabbed-profile-base/tabbed-profile-base.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TabbedProfileBaseComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile = {
    theme: '',
    profileImage: '',
    username: '',
    rankings: { topThirteen: [] },
    profileQuestions: []
  };
  
  defaultTheme = 'Fearless';
  defaultImage = 'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.webp';

  themes = [
    'Debut',
    'Fearless', 
    'Speak Now',
    'Red',
    '1989',
    'Reputation',
    'Lover',
    'Folklore',
    'Evermore',
    'Midnights',
    'The Tortured Poets Department',
    'The Life of a Showgirl'
  ];

  profileImages: string[] = [
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/1989-2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/1989.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/benjaminButton.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/cats.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/chiefs.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/crazy.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/evermore.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/fearless.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/folklore.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/fortnite.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/london.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/lover.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/meredithGrey.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/midnights.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/midnights2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/oliviaBenson.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/red.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/red2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/reputation.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/silly.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/speakNow.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/travis.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/ttpd.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/youBelong.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/folklore2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/koi.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/lover2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/willow.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/masters.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/red3.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/engagement.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/rep2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/cardigan.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/alltoowell.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/rep3.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/loveStory.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/swift.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/grammys.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/loasg1.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/loasg2.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/loasg3.webp',
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/newheights.webp',
  ];

  themeBackgrounds: { [key: string]: string } = {
    'Debut': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/debut-profile-bg.webp',
    'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/fearless-profile-bg.webp',
    'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/speak-now-profile-bg.webp',
    'Red': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/red-profile-bg.webp',
    '1989': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/1989-profile-bg.webp',
    'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/reputation-profile-bg.webp',
    'Lover': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/lover-profile-bg.webp',
    'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/folklore-profile-bg.webp',
    'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/evermore-profile-bg.webp',
    'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/midnights-profile-bg.webp',
    'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/ttpd-profile-bg.webp',
    'The Life of a Showgirl': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/life-of-a-showgirl-bg.webp',

  };

  questions = [
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

  isLoading: boolean = false;
  loadingError: string | null = null;
  showProfileImageDialog: boolean = false;
  topFiveAlbums: AlbumRanking[] = [];
  hasErasTour: boolean = false;
  countries: string[] = [];
  selectedCountry: string | null = null;

  constructor(
    private userProfileService: UserProfileService,
    private RankingsService: RankingsService,
    private albumService: AlbumService,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserProfile();
    this.disableAudioRightClick();
    this.loadTopFiveAlbums();   
    this.checkErasTour();
    this.loadCountries();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.loadingError = null;
    this.userProfileService.getUserProfile().subscribe(
      profile => {
        this.userProfile = this.setDefaultsIfNeeded(profile);
        this.loadTopThirteenDetails();
        this.checkErasTour(); 
        this.isLoading = false;
        
        // Force change detection after profile is loaded
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading user profile', error);
        this.loadingError = 'Failed to load user profile. Please try again.';
        this.isLoading = false;
      }
    );
  }

  private loadCountries(): void {
    this.userProfileService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  getLoginCountDisplay(): string {
    if (!this.userProfile.loginCount || this.userProfile.loginCount === 0) {
      return 'First time here!';
    }
    return `${this.userProfile.loginCount}`;
  }

  loadTopFiveAlbums() {
    this.RankingsService.getTopFiveAlbums().subscribe(
      albums => {
        this.topFiveAlbums = albums;
      },
      error => {
        console.error('Error loading top 5 albums:', error);
      }
    );
  }

  setDefaultsIfNeeded(profile: any): UserProfile {
    if (!profile) {
      const newProfile = {
        username: 'New Swiftie',
        theme: this.defaultTheme,
        profileImage: this.defaultImage,
        rankings: { topThirteen: [] },
        profileQuestions: this.questions.map(question => ({
          question,
          answer: ''
        }))
      };
      
      return newProfile;
    }

    const updatedProfile = {
      ...profile,
      theme: profile.theme || this.defaultTheme,
      profileImage: profile.profileImage || this.defaultImage, 
      rankings: profile.rankings || { topThirteen: [] },
      profileQuestions: this.questions.map(question => {
        const existingAnswer = profile.profileQuestions?.find((pq: { question: string; answer: string }) => pq.question === question);
        return existingAnswer || { question, answer: '' };
      })
    };

    // If theme was missing, save the default to backend
    if (!profile.theme) {
      setTimeout(() => {
        this.userProfileService.updateTheme(this.defaultTheme).subscribe({
          next: (response) => {
            console.log('Default theme saved:', this.defaultTheme);
            this.userProfile.theme = this.defaultTheme;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error saving default theme:', error);
          }
        });
      }, 100);
    }

    return updatedProfile;
  }

  checkErasTour() {
    if (this.userProfile && this.userProfile.username) {
      this.userProfileService.hasCompletedErasTourSetlist(this.userProfile.username).subscribe(
        (hasErasTour: boolean) => {
          this.hasErasTour = hasErasTour;
        },
        error => {
          console.error('Error checking Eras Tour:', error);
        }
      );
    }
  }

  navigateToErasTour() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/share-setlist', this.userProfile.username])
    );
    window.open(url, '_blank');
  }

  loadTopThirteenDetails() {
    if (this.userProfile.rankings?.topThirteen?.length > 0) {
      const songRequests = this.userProfile.rankings.topThirteen.map(song =>
        this.albumService.getSongById(song.songId)
      );
      forkJoin(songRequests).subscribe(
        (songs: (Song | null)[]) => {
          this.userProfile.rankings.topThirteen = this.userProfile.rankings.topThirteen.map((song, index) => {
            const songDetails = songs[index];
            if (songDetails) {
              return {
                ...song,
                albumImage: songDetails.albumImageSource,
                audioSource: songDetails.audioSource,
                albumCover: song.albumCover || songDetails.albumImageSource
              };
            }
            return song;
          });
          this.userProfile.rankings.topThirteen.sort((a, b) => a.slot - b.slot);
        },
        error => {
          console.error('Error loading Top 13 song details', error);
        }
      );
    }
  }

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'audio') {
        event.preventDefault();
      }
    });
  }

  handleAudioPlay(event: Event) {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      if (audio !== event.target) {
        audio.pause();
      }
    });
  }

  openProfileImageDialog() {
    this.showProfileImageDialog = true;
  }

  closeProfileImageDialog() {
    this.showProfileImageDialog = false;
  }

  selectProfileImage(image: string) {
    this.userProfileService.updateProfileImage(image).subscribe(
      (updatedProfile: UserProfile) => {
        this.userProfile = {
          ...this.userProfile,
          profileImage: updatedProfile.profileImage || this.defaultImage
        };
        this.closeProfileImageDialog();
        this.toastr.success('Profile image updated successfully!', 'Success');
      },
      error => {
        console.error('Error updating profile image', error);
        this.toastr.error('Failed to update profile image. Please try again.', 'Error');
      }
    );
  }

  getThemeClass(): string {
    return this.userProfile?.theme ? 
      this.getThemeClassMapping()[this.userProfile.theme] || 'Fearless' : 'Fearless';
  }

  private getThemeClassMapping(): { [key: string]: string } {
    return {
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
      'The Tortured Poets Department': 'TorturedPoets',
      'The Life of a Showgirl': 'LifeOfAShowgirl'
    };
  }

  getThemeBackground(): string {
    if (this.userProfile?.theme && this.themeBackgrounds[this.userProfile.theme]) {
      return this.themeBackgrounds[this.userProfile.theme];
    }
    return this.themeBackgrounds[this.defaultTheme];
  }

  updateTheme(theme: string) {
    if (this.userProfile) {
      this.userProfile.theme = theme;
      this.userProfileService.updateTheme(theme).subscribe(
        () => {
          this.toastr.success('Theme updated successfully!', 'Success');
        },
        error => {
          console.error('Error updating theme', error);
          this.toastr.error('Failed to update theme. Please try again.', 'Error');
        }
      );
    }
  }

  updateProfileQuestions() {
    if (this.userProfile && this.userProfile.profileQuestions) {
      this.userProfileService.updateProfileQuestions(this.userProfile.profileQuestions).subscribe(
        () => this.loadUserProfile(),
        error => console.error('Error updating profile questions', error)
      );
    }
  }

  updateQuestionAnswer(index: number, event: any) {
    const answer = (event.target as HTMLElement)?.textContent ?? '';
    if (!this.userProfile.profileQuestions) {
      this.userProfile.profileQuestions = [];
    }
    if (!this.userProfile.profileQuestions[index]) {
      this.userProfile.profileQuestions[index] = { question: this.questions[index], answer: '' };
    }
    this.userProfile.profileQuestions[index].answer = answer || '';
  }

  onCountryChange(country: string): void {
    if (country === '') {
      return;
    }

    this.userProfileService.updateCountry(country).subscribe({
      next: (updatedProfile) => {
        this.userProfile = {
          ...this.userProfile,
          country: updatedProfile.country,
          loginCount: updatedProfile.loginCount
        };
        this.selectedCountry = country;
        console.log('Country updated successfully');
      },
      error: (error) => {
        console.error('Error updating country:', error);
        this.selectedCountry = this.userProfile.country || null;
      }
    });
  }

  // Event handlers for tabbed profile base
  onQuestionUpdated(data: { index: number; answer: string }) {
    this.updateQuestionAnswer(data.index, { target: { textContent: data.answer } });
  }

  onSaveAnswers() {
    this.updateProfileQuestions();
  }
}