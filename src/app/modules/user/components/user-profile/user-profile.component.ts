import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserProfileService } from '../../../../services/user-profile.service';
import { AlbumService } from '../../../../services/album.service';
import { RankingsService } from '../../../../services/rankings.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Album } from '../../../../interfaces/Album';
import { Song } from '../../../../interfaces/Song';
import { UserProfile } from '../../../../interfaces/userProfile';
import { UserProfileSong } from '../../../../interfaces/userProfile';
import { AlbumRanking } from '../../../../interfaces/AlbumRanking';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  defaultImage = 'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.png';
  defaultQuestions = [
    { question: 'What is your cry in the car song?', answer: 'Not answered yet' },
    { question: 'What are your dream surprise songs?', answer: 'Not answered yet' },
    { question: 'What album made you a Swiftie?', answer: 'Not answered yet' },
  ];
  themes = ['Debut', 'Fearless', 'Speak Now', 'Red', '1989', 'Reputation', 'Lover', 'Folklore', 'Evermore', 'Midnights', 'The Tortured Poets Department'];
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
  themeBackgrounds: { [key: string]: string } = {
    'Debut': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/debut-profile-bg.jpeg',
    'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/fearless-profile-bg.jpeg',
    'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/speak-now-profile-bg.jpeg',
    'Red': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/red-profile-bg.jpeg',
    '1989': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/1989-profile-bg.jpeg',
    'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/rep-profile-bg.jpeg',
    'Lover': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/lover-profile-bg.jpeg',
    'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/folklore-profile-bg.jpeg',
    'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/evermore-profile-bg.jpeg',
    'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/midnights-profile-bg.jpeg',
    'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/ttpd-profile-bg.jpeg'
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
  isEditing: boolean = false;
  showProfileImageDialog: boolean = false;
  topFiveAlbums: AlbumRanking[] = [];

  constructor(
    private userProfileService: UserProfileService,
    private RankingsService: RankingsService,
    private albumService: AlbumService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
    this.disableAudioRightClick();
    this.loadTopFiveAlbums();
  }
  
  loadUserProfile() {
    this.isLoading = true;
    this.loadingError = null;
    this.userProfileService.getUserProfile().subscribe(
      profile => {
        this.userProfile = this.setDefaultsIfNeeded(profile);
        console.log('Loaded user profile:', this.userProfile); // Add this log
        this.loadTopThirteenDetails();
      },
      error => {
        console.error('Error loading user profile', error);
        this.loadingError = 'Failed to load user profile. Please try again.';
        this.isLoading = false;
      }
    );
  }

  loadTopFiveAlbums() {
    this.RankingsService.getTopFiveAlbums().subscribe(
      (albums) => {
        this.topFiveAlbums = albums;
      },
      (error) => {
        console.error('Error loading top 5 albums:', error);
      }
    );
  }
  
  setDefaultsIfNeeded(profile: any): UserProfile {
    if (!profile) {
      return {
        username: 'New Swiftie',
        theme: this.defaultTheme,
        profileImage: this.defaultImage,
        rankings: { topThirteen: [] },
        profileQuestions: this.questions.map(question => ({
          question,
          answer: ''
        }))
      };
    }
  
    return {
      ...profile,
      theme: profile.theme || this.defaultTheme,
      profileImage: profile.profileImage || this.defaultImage, 
      rankings: profile.rankings || { topThirteen: [] },
      profileQuestions: this.questions.map(question => {
        const existingAnswer = profile.profileQuestions?.find((pq: { question: string; answer: string }) => pq.question === question);
        return existingAnswer || { question, answer: '' };
      })
    };
  }

  loadTopThirteenDetails() {
    if (this.userProfile.rankings && this.userProfile.rankings.topThirteen && this.userProfile.rankings.topThirteen.length > 0) {
      const songRequests = this.userProfile.rankings.topThirteen.map(song =>
        this.albumService.getSongById(song.songId)
      );
      forkJoin(songRequests).subscribe(
        (songs: Song[]) => {
          this.userProfile.rankings.topThirteen = this.userProfile.rankings.topThirteen.map((song, index) => {
            const songDetails = songs[index];
            return {
              ...song,
              albumImage: songDetails.albumImageSource,
              audioSource: songDetails.audioSource,
              albumCover: song.albumCover || songDetails.albumImageSource, // Add this line
            };
          });
          this.userProfile.rankings.topThirteen.sort((a, b) => a.slot - b.slot);
          this.isLoading = false;
        },
        error => {
          console.error('Error loading song details', error);
          this.loadingError = 'Failed to load song details. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      console.log('No top thirteen songs, setting isLoading to false');
      this.userProfile.rankings = this.userProfile.rankings || {};
      this.userProfile.rankings.topThirteen = [];
      this.isLoading = false;
    }
  }

  disableAudioRightClick() {
    document.addEventListener('contextmenu', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
        e.preventDefault();
      }
    }, false);
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
    return this.themeClassMap[this.userProfile?.theme] || '';
  }

  getThemeBackground(): string {
    return this.userProfile?.theme ? this.themeBackgrounds[this.userProfile.theme] : '';
  }

  startEditing() {
    this.isEditing = true;
  }

  saveAnswers() {
    this.isEditing = false;
    this.updateProfileQuestions();
  }

  updateTheme(theme: string) {
    if (this.userProfile) {
      this.userProfile.theme = theme;
      this.userProfileService.updateTheme(theme).subscribe(
        () => this.loadUserProfile(),
        error => console.error('Error updating theme', error)
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

  isProfileShareable(): boolean {
    const hasTopThirteenSong = this.userProfile?.rankings?.topThirteen?.length > 0;
    const hasAnsweredQuestion = this.userProfile?.profileQuestions?.some(q => q.answer && q.answer !== '');
    const hasTopFiveAlbums = this.topFiveAlbums.length === 5;
    return !!hasTopThirteenSong && !!hasAnsweredQuestion && hasTopFiveAlbums;
  }
  
  shareProfile() {
    if (!this.isProfileShareable()) {
      this.toastr.warning('Please add at least one song to your Top 13 and answer at least one question before sharing your profile.', 'Cannot Share Yet', {
        timeOut: 5000
      });
      return;
    }

    const shareUrl = `${window.location.origin}/public-profile/${this.userProfile.username}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.toastr.success('Profile link copied to clipboard!', 'Success', {
        timeOut: 3000
      });
    }, (err) => {
      this.toastr.error('Could not copy profile link', 'Error', {
        timeOut: 3000
      });
    });
  }
}