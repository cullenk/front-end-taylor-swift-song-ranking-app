import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Router, RouterModule, NavigationStart } from "@angular/router";
import { CommonModule, NgOptimizedImage } from "@angular/common"; 
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { filter, takeUntil, timeout, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

import { RankingsService } from "../../../../services/rankings.service";

interface Album {
  id: string;
  title: string;
  displayTitle: string;
  coverImage: string;
  sampleAudio: string;
  routerLink: string;
  category: 'album' | 'special';
}

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [RouterModule, CommonModule, NgOptimizedImage],
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingsComponent implements OnInit, OnDestroy {
  
  // Component State
  rankings: any;
  isLoading = false;
  error: string | null = null;
  
  // Constants
  readonly shelfImage = 'https://d3e29z0m37b0un.cloudfront.net/graphics/shelf.webp';
  readonly backgroundImage = 'https://d3e29z0m37b0un.cloudfront.net/graphics/brick-wall.webp';
  
  // Albums Configuration - same as before
  readonly albums: Album[] = [
    // Your existing albums array...
    { 
      id: 'debut', 
      title: 'Taylor Swift', 
      displayTitle: 'Taylor Swift',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/debut-sound-clip.mp3', 
      routerLink: './album/debut',
      category: 'album'
    },
    { 
      id: 'fearless', 
      title: 'Fearless', 
      displayTitle: 'Fearless (Taylor\'s Version)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/fearless-sound-clip.mp3', 
      routerLink: './album/fearless',
      category: 'album'
    },
    { 
      id: 'speak-now', 
      title: 'Speak Now', 
      displayTitle: 'Speak Now (Taylor\'s Version)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/speak-now-sound-clip.mp3', 
      routerLink: './album/speak-now',
      category: 'album'
    },
    { 
      id: 'red', 
      title: 'Red', 
      displayTitle: 'Red (Taylor\'s Version)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/red-sound-clip.mp3', 
      routerLink: './album/red',
      category: 'album'
    },
    { 
      id: '1989', 
      title: '1989', 
      displayTitle: '1989 (Taylor\'s Version)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/1989-sound-clip.mp3', 
      routerLink: './album/nineteen-eighty-nine',
      category: 'album'
    },
    { 
      id: 'reputation', 
      title: 'reputation', 
      displayTitle: 'reputation',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/reputation-sound-clip.mp3', 
      routerLink: './album/reputation',
      category: 'album'
    },
    { 
      id: 'lover', 
      title: 'Lover', 
      displayTitle: 'Lover',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/lover-sound-clip.mp3', 
      routerLink: './album/lover',
      category: 'album'
    },
    { 
      id: 'folklore', 
      title: 'folklore', 
      displayTitle: 'folklore',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/folklore-sound-clip.mp3', 
      routerLink: './album/folklore',
      category: 'album'
    },
    { 
      id: 'evermore', 
      title: 'evermore', 
      displayTitle: 'evermore',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/evermore-sound-clip.mp3', 
      routerLink: './album/evermore',
      category: 'album'
    },
    { 
      id: 'midnights', 
      title: 'Midnights', 
      displayTitle: 'Midnights',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/midnights-sound-clip.mp3', 
      routerLink: './album/midnights',
      category: 'album'
    },
    { 
      id: 'ttpd', 
      title: 'The Tortured Poets Department', 
      displayTitle: 'The Tortured Poets Department',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/ttpd-sound-clip.mp3', 
      routerLink: './album/tortured-poets-department',
      category: 'album'
    },
    { 
      id: 'thelifeofashowgirl', 
      title: 'The Life of a Showgirl', 
      displayTitle: 'The Life of a Showgirl',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/life-of-a-showgirl.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/showgirl-sound-clip.mp3', 
      routerLink: './album/the-life-of-a-showgirl',
      category: 'album'
    },
    { 
      id: 'singles', 
      title: 'Singles', 
      displayTitle: 'Singles & Features',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/SinglesAndFeatures.svg', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/singles-sound-clip.mp3', 
      routerLink: './album/singles',
      category: 'album'
    },
    
    // Special Categories
    { 
      id: 'allAlbums', 
      title: 'All Albums', 
      displayTitle: 'All Albums',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/All-Albums.webp', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/allAlbumsClip.mp3', 
      routerLink: './allAlbums',
      category: 'special'
    },
    { 
      id: 'allSongs', 
      title: 'All Songs', 
      displayTitle: 'All Songs',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/AllSongs.svg', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/allSongsClip.mp3', 
      routerLink: './allSongs',
      category: 'special'
    },
    { 
      id: 'byTrackNumber', 
      title: 'By Track Number', 
      displayTitle: 'By Track Number',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/byTrackNumber.svg', 
      sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/readyForIt.mp3', 
      routerLink: './byTrackNumber',
      category: 'special'
    }
  ];

  // Audio Management
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private currentlyPlaying: HTMLAudioElement | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private rankingsService: RankingsService,
    private router: Router,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Initialize component
   */
  private initializeComponent(): void {
    this.updateMetaTags();
    this.loadUserRankings();
    this.preloadAudioFiles();
    this.setupNavigationListener();
  }

  /**
   * Load user rankings with proper error handling and timeouts
   */
  loadUserRankings(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges(); // Force change detection

    // Check if RankingsService exists
    if (!this.rankingsService) {
      console.error('RankingsService is not available');
      this.handleRankingsError('Service not available');
      return;
    }

    this.rankingsService.getUserRankings()
      .pipe(
        timeout(10000), // 10 second timeout
        catchError((error) => {
          console.error('Error in getUserRankings:', error);
          return of(null); // Return null on error
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (rankings) => {
          this.rankings = rankings;
          this.isLoading = false;
          this.error = null;
          this.cdr.detectChanges(); // Force change detection
        },
        error: (error) => {
          console.error('Subscription error:', error);
          this.handleRankingsError('Failed to load rankings. Please try again.');
        },
        complete: () => {
          // Ensure loading is false even if we don't get data
          if (this.isLoading) {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        }
      });

    // Backup timeout to ensure loading state is cleared
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('Backup timeout: Clearing loading state');
        this.isLoading = false;
        if (!this.error) {
          this.error = 'Loading took too long. Please refresh the page.';
        }
        this.cdr.detectChanges();
      }
    }, 15000); // 15 second backup timeout
  }

  /**
   * Handle rankings loading errors
   */
  private handleRankingsError(errorMessage: string): void {
    this.error = errorMessage;
    this.isLoading = false;
    this.cdr.detectChanges();
    
    if (this.toastr) {
      this.toastr.error(errorMessage, 'Error');
    }
  }

  /**
   * Skip rankings loading entirely (for debugging)
   */
  skipRankingsLoading(): void {
    console.log('Skipping rankings loading...');
    this.isLoading = false;
    this.error = null;
    this.rankings = null; // or some default value
    this.cdr.detectChanges();
  }

  // ... rest of your existing methods remain the same ...

  /**
   * Preload audio files for better performance
   */
  private preloadAudioFiles(): void {
    this.albums.forEach(album => {
      try {
        const audio = new Audio();
        audio.src = album.sampleAudio;
        audio.preload = 'metadata';
        audio.volume = 0.3;
        
        // Handle loading errors gracefully
        audio.addEventListener('error', () => {
          console.warn(`Failed to load audio for ${album.title}`);
        });

        this.audioElements.set(album.id, audio);
      } catch (error) {
        console.warn(`Error creating audio element for ${album.title}:`, error);
      }
    });
  }

  /**
   * Setup navigation listener to stop audio on route changes
   */
  private setupNavigationListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.stopAllAudio();
      });
  }

  /**
   * Play audio sample on hover
   */
  playSample(album: Album, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Stop any currently playing audio
    this.stopAllAudio();

    const audio = this.audioElements.get(album.id);
    if (!audio) {
      console.warn(`Audio element not found for ${album.title}`);
      return;
    }

    try {
      audio.currentTime = 0;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.currentlyPlaying = audio;
          })
          .catch((error) => {
            console.warn(`Failed to play audio for ${album.title}:`, error);
          });
      }
    } catch (error) {
      console.warn(`Error playing audio for ${album.title}:`, error);
    }
  }

  /**
   * Stop audio sample on mouse leave
   */
  stopSample(album: Album): void {
    const audio = this.audioElements.get(album.id);
    if (audio && audio === this.currentlyPlaying) {
      this.stopAudio(audio);
    }
  }

  /**
   * Stop all audio playback
   */
  private stopAllAudio(): void {
    this.audioElements.forEach(audio => {
      this.stopAudio(audio);
    });
    this.currentlyPlaying = null;
  }

  /**
   * Stop individual audio element
   */
  private stopAudio(audio: HTMLAudioElement): void {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn('Error stopping audio:', error);
    }
  }

  /**
   * Update meta tags for SEO
   */
  private updateMetaTags(): void {
    this.title.setTitle('Album Rankings - Swiftie Ranking Hub');
    
    const description = 'Rank your favorite Taylor Swift songs by album. Choose from all studio albums including Taylor\'s Versions and special collections.';
    
    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'Taylor Swift, album rankings, song rankings, Swiftie, music ranking, Taylor\'s Version' });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Album Rankings - Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/user/rankings' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Swiftie Ranking Hub' });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Album Rankings - Swiftie Ranking Hub' });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
    
    // Additional SEO
    this.meta.updateTag({ name: 'author', content: 'Swiftie Ranking Hub' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  /**
   * Get albums by category for template organization
   */
  getAlbumsByCategory(category: 'album' | 'special'): Album[] {
    return this.albums.filter(album => album.category === category);
  }

  /**
   * Track by function for ngFor performance
   */
  trackByAlbumId(index: number, album: Album): string {
    return album.id;
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event, album: Album): void {
    const img = event.target as HTMLImageElement;
    console.warn(`Failed to load image for ${album.title}`);
    // You could set a fallback image here
    // img.src = 'path/to/fallback-image.webp';
  }

  /**
   * Handle image loading success
   */
  onImageLoad(event: Event, album: Album): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAllAudio();
    this.audioElements.clear();
  }
}