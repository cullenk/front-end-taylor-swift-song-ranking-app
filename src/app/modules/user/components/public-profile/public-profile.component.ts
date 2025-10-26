import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../services/user-profile.service';
import { AlbumService } from '../../../../services/album.service';
import { forkJoin } from 'rxjs';
import { Song } from '../../../../interfaces/Song';
import { UserProfile } from '../../../../interfaces/userProfile';
import { RankingsService } from '../../../../services/rankings.service';
import { Meta, Title } from '@angular/platform-browser';
import { AlbumRanking } from '../../../../interfaces/AlbumRanking';
import { TabbedProfileBaseComponent } from '../tabbed-profile-base/tabbed-profile-base.component';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, TabbedProfileBaseComponent],
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  userProfile: UserProfile = {
    theme: '',
    profileImage: '',
    username: '',
    rankings: { topThirteen: [] },
    profileQuestions: [],
  };
  
  isLoading = true;
  error: string | null = null;
  isAuthenticated = false;
  currentUsername: string | null = null;
  topFiveAlbums: AlbumRanking[] = [];
  hasErasTourSetlist: boolean = false;
  defaultProfileImage = 'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.webp';

  themeBackgrounds: { [key: string]: string } = {
    Debut: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/debut-profile-bg.webp',
    Fearless: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/fearless-profile-bg.webp',
    'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/speak-now-profile-bg.webp',
    Red: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/red-profile-bg.webp',
    '1989': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/1989-profile-bg.webp',
    Reputation: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/reputation-profile-bg.webp',
    Lover: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/lover-profile-bg.webp',
    Folklore: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/folklore-profile-bg.webp',
    Evermore: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/evermore-profile-bg.webp',
    Midnights: 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/midnights-profile-bg.webp',
    'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/ttpd-profile-bg.webp',
    'The Life of a Showgirl': 'https://d3e29z0m37b0un.cloudfront.net/profile+backgrounds/life-of-a-showgirl-bg.webp',
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
    'Dream artist collaboration with Taylor?',
  ];

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private rankingsService: RankingsService,
    private albumService: AlbumService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

ngOnInit() {
  const username = this.route.snapshot.paramMap.get('username');
  // console.log(`🔍 [PUBLIC-PROFILE] Initializing public profile for: ${username}`);
  
  if (username) {
    this.userProfileService.getPublicProfile(username).subscribe(
      (data: UserProfile) => {
        // console.log(`✅ [PUBLIC-PROFILE] Received user profile data for ${username}:`, data);
        // console.log(`📊 [PUBLIC-PROFILE] User profile rankings structure:`, {
        //   hasRankings: !!data.rankings,
        //   hasAlbumRankings: !!(data.rankings?.albumRankings),
        //   hasAllAlbums: !!(data.rankings?.albumRankings?.allAlbums),
        //   hasTrackRankings: !!(data.rankings?.trackRankings),
        //   hasAllSongsRanking: !!(data.rankings?.allSongsRanking),
        //   allAlbumsCount: data.rankings?.albumRankings?.allAlbums?.length || 0,
        //   trackRankingsCount: data.rankings?.trackRankings?.length || 0,
        //   allSongsRankingCount: data.rankings?.allSongsRanking?.length || 0
        // });
        
        this.userProfile = this.setDefaultsIfNeeded(data);
        this.sortProfileQuestions();
        this.loadTopThirteenDetails();
        this.loadTopFiveAlbums(username);
        this.checkErasTourSetlist(username);
        this.updateMetaTags(username);
      },
      (error) => {
        console.error(`💥 [PUBLIC-PROFILE] Error fetching public profile for ${username}`, error);
        this.error = 'Failed to load profile. Please try again.';
        this.isLoading = false;
      }
    );
  } else {
    console.error(`❌ [PUBLIC-PROFILE] No username provided`);
    this.error = 'No username provided';
    this.isLoading = false;
  }
}

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
        if (!audio.paused) {
          audio.pause();
        }
      });
    }
  }

 loadTopFiveAlbums(username: string) {
  // console.log(`🔍 [PUBLIC-PROFILE] Loading top 5 albums for: ${username}`);
  this.rankingsService.getTopFiveAlbums(username).subscribe(
    (albums) => {
      // console.log(`✅ [PUBLIC-PROFILE] Received top 5 albums for ${username}:`, albums);
      this.topFiveAlbums = albums;
    },
    (error) => {
      console.error(`💥 [PUBLIC-PROFILE] Error loading top 5 albums for ${username}:`, error);
    }
  );
}

  checkErasTourSetlist(username: string) {
    this.userProfileService.hasCompletedErasTourSetlist(username).subscribe(
      (hasSetlist) => {
        this.hasErasTourSetlist = hasSetlist;
      },
      (error) => {
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
      profileQuestions: profile.profileQuestions || this.getDefaultProfileQuestions(),
    };
  }

  getDefaultProfileQuestions(): { question: string; answer: string }[] {
    return this.orderedQuestions.map((question) => ({ question, answer: '' }));
  }

  loadTopThirteenDetails() {
    if (this.userProfile?.rankings?.topThirteen?.length > 0) {
      const songRequests = this.userProfile.rankings.topThirteen.map((song) =>
        this.albumService.getSongById(song.songId)
      );

      forkJoin(songRequests).subscribe(
        (songs: (Song | null)[]) => {
          if (this.userProfile?.rankings?.topThirteen) {
            this.userProfile.rankings.topThirteen = this.userProfile.rankings.topThirteen.map((song, index) => {
              const songDetails = songs[index];
              if (songDetails) {
                return {
                  ...song,
                  albumImage: songDetails.albumImageSource,
                  audioSource: songDetails.audioSource,
                };
              }
              return song;
            });
            this.userProfile.rankings.topThirteen.sort((a, b) => a.slot - b.slot);
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading song details', error);
          this.error = 'Failed to load song details. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  private sortProfileQuestions() {
    if (this.userProfile?.profileQuestions) {
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

  updateMetaTags(username: string) {
    const title = `${username}'s Profile - Swiftie Ranking Hub`;
    const description = `Check out ${username}'s Taylor Swift rankings and profile on Swiftie Ranking Hub!`;
    const imageUrl = this.userProfile.profileImage || 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({
      property: 'og:url',
      content: `https://swiftierankinghub.com/public-profile/${username}`,
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  disableAudioRightClick() {
    if (isPlatformBrowser(this.platformId)) {
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
  }
}