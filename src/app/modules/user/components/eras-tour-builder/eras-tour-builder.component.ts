import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { finalize, catchError, of, Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

import { RulesService } from '../../../../services/eras-builder-rules.service';
import { EraSetList } from '../../../../interfaces/EraSetList';
import { ToastrService } from 'ngx-toastr';
import { RankingsService } from '../../../../services/rankings.service';
import { AuthService } from '../../../../services/auth.service';
import { UserProfileService } from '../../../../services/user-profile.service';
import { EraWidgetComponent } from '../era-widget/era-widget.component';

interface SetListCounters {
  totalSongs: number;
  totalMashups: number;
  erasAccountedFor: number;
  totalSurpriseSongs: number;
}

interface SetListRules {
  maxSongs: number;
  maxMashups: number;
  maxEras: number;
  maxSurpriseSongs: number;
  maxSongsPerEra: number;
}

@Component({
  standalone: true,
  imports: [EraWidgetComponent, DragDropModule, CommonModule],
  selector: 'app-eras-tour-builder',
  templateUrl: './eras-tour-builder.component.html',
  styleUrls: ['./eras-tour-builder.component.scss'],
})
export class ErasTourBuilderComponent implements OnInit, OnDestroy {
  // Constants
  readonly ERAS_LIST = [
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
    'Surprise Songs',
  ] as const;

  readonly RULES: SetListRules = {
    maxSongs: 45,
    maxMashups: 3,
    maxEras: 11,
    maxSurpriseSongs: 2,
    maxSongsPerEra: 6
  };

  // Component State
  setList: EraSetList[] = [];
  counters: SetListCounters = {
    totalSongs: 0,
    totalMashups: 0,
    erasAccountedFor: 0,
    totalSurpriseSongs: 0
  };
  
  // UI State
  isLoading = false;
  isSaving = false;
  isResetting = false;
  showResetDialog = false;
  allChoicesMade = false;
  isSetListValid = false;
  
  // User Data
  username: string | null = null;
  
  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private rankingService: RankingsService,
    private rulesService: RulesService,
    private toastr: ToastrService,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Updates SEO meta tags for the component
   */
  private updateMetaTags(): void {
    const pageTitle = 'Eras Tour Builder - Swiftie Ranking Hub';
    const description = 'Build your dream Taylor Swift Eras Tour setlist! Select 45 songs, arrange eras, and create the perfect show with our interactive builder.';
    const imageUrl = 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp';
    const pageUrl = 'https://swiftierankinghub.com/user/erasTourBuilder';

    // Set page title
    this.title.setTitle(pageTitle);
    
    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: description });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  /**
   * Initialize component data
   */
  private initializeComponent(): void {
    this.isLoading = true;
    this.loadUsername();
    this.loadSetList();
  }

  /**
   * Load current user's username
   */
  private loadUsername(): void {
    this.username = this.authService.getUsername();
    
    if (!this.username) {
      const profileSub = this.userProfileService.getUserProfile().pipe(
        catchError((error) => {
          console.error('Error fetching user profile:', error);
          this.toastr.warning('Unable to load user profile');
          return of(null);
        })
      ).subscribe({
        next: (profile) => {
          if (profile?.username) {
            this.username = profile.username;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('username', this.username);
            }
          }
        }
      });
      
      this.subscriptions.add(profileSub);
    }
  }

  /**
   * Load existing setlist or initialize new one
   */
  private loadSetList(): void {
    const setListSub = this.rankingService.getErasTourSetList().pipe(
      catchError((error) => {
        console.error('Error loading set list:', error);
        this.toastr.info('Starting with a fresh setlist');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (setList) => {
        this.setList = setList.length > 0 ? setList : this.initializeSetList();
        this.updateCounters();
      }
    });
    
    this.subscriptions.add(setListSub);
  }

  /**
   * Initialize empty setlist with all eras
   */
  private initializeSetList(): EraSetList[] {
    return this.ERAS_LIST.map((era, index) => ({
      era,
      songs: [],
      order: index,
    }));
  }

  /**
   * Handle drag and drop reordering
   */
  onDrop(event: CdkDragDrop<EraSetList[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.setList, event.previousIndex, event.currentIndex);
      this.updateSetListOrder();
      this.toastr.info('Era order updated');
    }
  }

  /**
   * Update the order property after drag and drop
   */
  private updateSetListOrder(): void {
    this.setList.forEach((item, index) => {
      item.order = index;
    });
    this.updateCounters();
  }

  /**
   * Handle era updates from child components
   */
  updateEra(updatedEra: EraSetList): void {
    const index = this.setList.findIndex((era) => era.era === updatedEra.era);
    
    if (index !== -1) {
      this.setList[index] = { ...updatedEra };
      this.updateCounters();
    }
  }

  /**
   * Update all counters and validation status
   */
  private updateCounters(): void {
    // Calculate totals
    this.counters.totalSongs = this.setList.reduce((count, era) => {
      return era.era === 'Surprise Songs' ? count : count + era.songs.length;
    }, 0);

    this.counters.totalMashups = this.setList.reduce((count, era) => {
      if (era.era === 'Surprise Songs') return count;
      return count + era.songs.filter((song) => song.isMashup).length;
    }, 0);

    this.counters.erasAccountedFor = this.setList.filter(
      era => era.era !== 'Surprise Songs' && era.songs.length > 0
    ).length;

    const surpriseEra = this.setList.find(era => era.era === 'Surprise Songs');
    this.counters.totalSurpriseSongs = surpriseEra?.songs.length || 0;

    // Check completion status
    this.allChoicesMade = this.checkAllChoicesMade();
  }

  /**
   * Check if all requirements are met
   */
  private checkAllChoicesMade(): boolean {
    return (
      this.counters.totalSongs === this.RULES.maxSongs &&
      this.counters.erasAccountedFor === this.RULES.maxEras &&
      this.counters.totalSurpriseSongs === this.RULES.maxSurpriseSongs &&
      this.counters.totalMashups === this.RULES.maxMashups
    );
  }

  /**
   * Save current progress
   */
  saveProgress(): void {
    if (this.isSaving) return;
    
    this.isSaving = true;
    
    const saveSub = this.rankingService.updateErasTourSetList(this.setList).pipe(
      catchError((error) => {
        console.error('Error saving progress:', error);
        this.toastr.error('Failed to save progress. Please try again.');
        return of(null);
      }),
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (result) => {
        if (result !== null) {
          this.toastr.success('Progress saved successfully!');
        }
      }
    });
    
    this.subscriptions.add(saveSub);
  }

  /**
   * Verify setlist against rules
   */
  verifySetList(): void {
    try {
      if (this.rulesService.validateSetList(this.setList)) {
        this.isSetListValid = true;
        this.toastr.success('🎉 Setlist verified successfully!', 'Perfect Show!');
      } else {
        this.isSetListValid = false;
        this.toastr.error('Setlist does not comply with the rules. Please check the requirements.', 'Validation Failed');
      }
    } catch (error) {
      console.error('Error verifying setlist:', error);
      this.toastr.error('Unable to verify setlist. Please try again.', 'Verification Error');
    }
  }

  /**
   * Get formatted username for display
   */
  getUsername(): string {
    return this.username || 'Swiftie';
  }

  /**
   * Open reset confirmation dialog
   */
  openResetDialog(): void {
    this.showResetDialog = true;
  }

  /**
   * Close reset confirmation dialog
   */
  closeResetDialog(): void {
    this.showResetDialog = false;
  }

  /**
   * Confirm and execute reset
   */
  confirmReset(): void {
    if (this.isResetting) return;
    
    this.isResetting = true;
    this.setList = this.initializeSetList();
    this.updateCounters();
    
    const resetSub = this.rankingService.updateErasTourSetList(this.setList).pipe(
      catchError((error) => {
        console.error('Error resetting setlist:', error);
        this.toastr.error('Failed to reset setlist. Please try again.');
        return of(null);
      }),
      finalize(() => {
        this.isResetting = false;
        this.closeResetDialog();
      })
    ).subscribe({
      next: (result) => {
        if (result !== null) {
          this.toastr.success('Setlist reset successfully!');
        }
      }
    });
    
    this.subscriptions.add(resetSub);
  }

  /**
   * Get progress percentage for visual feedback
   */
  getProgressPercentage(): number {
    const totalProgress = (
      (this.counters.totalSongs / this.RULES.maxSongs) +
      (this.counters.erasAccountedFor / this.RULES.maxEras) +
      (this.counters.totalSurpriseSongs / this.RULES.maxSurpriseSongs) +
      (this.counters.totalMashups / this.RULES.maxMashups)
    ) / 4;
    
    return Math.round(totalProgress * 100);
  }

  /**
   * Check if a specific requirement is complete
   */
  isRequirementComplete(requirement: keyof SetListCounters): boolean {
    switch (requirement) {
      case 'totalSongs':
        return this.counters.totalSongs === this.RULES.maxSongs;
      case 'totalMashups':
        return this.counters.totalMashups === this.RULES.maxMashups;
      case 'erasAccountedFor':
        return this.counters.erasAccountedFor === this.RULES.maxEras;
      case 'totalSurpriseSongs':
        return this.counters.totalSurpriseSongs === this.RULES.maxSurpriseSongs;
      default:
        return false;
    }
  }

  /**
   * Get requirement status class for styling
   */
  getRequirementClass(requirement: keyof SetListCounters): string {
    return this.isRequirementComplete(requirement) ? 'complete' : 'incomplete';
  }

   trackByEra(index: number, era: EraSetList): string {
    return era.era;
   }
}