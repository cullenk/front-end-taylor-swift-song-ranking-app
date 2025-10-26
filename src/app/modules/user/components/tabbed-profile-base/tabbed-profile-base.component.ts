import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Top13TabComponent } from '../shared-profile-tabs/top-13-tab/top-13-tab.component';
import { AlbumRankingsTabComponent } from '../shared-profile-tabs/album-rankings-tab/album-rankings-tab.component';
import { QuestionnaireTabComponent } from '../shared-profile-tabs/questionnaire-tab/questionnaire-tab.component';
import { ErasTourTabComponent } from '../shared-profile-tabs/eras-tour-tab/eras-tour-tab.component';
import { UserProfile } from '../../../../interfaces/userProfile';
import { AlbumRanking } from '../../../../interfaces/AlbumRanking';
import { CountryFlagsService } from '../../../../services/country-flags.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tabbed-profile-base',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Top13TabComponent,
    AlbumRankingsTabComponent,
    QuestionnaireTabComponent,
    ErasTourTabComponent,
  ],
  templateUrl: './tabbed-profile-base.component.html',
  styleUrl: './tabbed-profile-base.component.scss',
})
export class TabbedProfileBaseComponent {
  @Input() userProfile!: UserProfile;
  @Input() isEditable: boolean = false;
  @Input() isOwner: boolean = false;
  @Input() topFiveAlbums: AlbumRanking[] = [];
  @Input() hasErasTour: boolean = false;

  // Theme and styling inputs
  @Input() themeClass: string = 'Fearless';
  @Input() themeBackground: string = '';

  @Output() editImage = new EventEmitter<void>();
  @Output() tabChanged = new EventEmitter<string>();
  @Output() questionUpdated = new EventEmitter<{
    index: number;
    answer: string;
  }>();
  @Output() saveAnswers = new EventEmitter<void>();
  @Output() editingChanged = new EventEmitter<boolean>();

  activeTab = 'top13';
  defaultImage =
    'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.webp';
  isEditing = false;
  shelfImage = 'https://d3e29z0m37b0un.cloudfront.net/graphics/shelf.webp';

  // Theme mappings
  themeClassMap: { [key: string]: string } = {
    Debut: 'Debut',
    Fearless: 'Fearless',
    'Speak Now': 'SpeakNow',
    Red: 'Red',
    '1989': '_1989',
    Reputation: 'Reputation',
    Lover: 'Lover',
    Folklore: 'Folklore',
    Evermore: 'Evermore',
    Midnights: 'Midnights',
    'The Tortured Poets Department': 'TorturedPoets',
    'The Life of a Showgirl': 'LifeOfAShowgirl',
  };

  availableTabs = [
    { key: 'top13', label: 'Top 13 Songs', icon: 'fas fa-music' },
    { key: 'albums', label: 'Album Rankings', icon: 'fas fa-compact-disc' },
    {
      key: 'questionnaire',
      label: 'Questionnaire',
      icon: 'fas fa-question-circle',
    },
    { key: 'eras', label: 'Dream Eras Tour', icon: 'fas fa-microphone' },
  ];

  constructor(
    public countryFlagsService: CountryFlagsService,
    private toastr: ToastrService 
  ) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
  }

  onEditImage() {
    this.editImage.emit();
  }

  getThemeClass(): string {
    return this.themeClassMap[this.userProfile?.theme] || 'Fearless';
  }

  getThemeBackground(): string {
    return this.themeBackground;
  }

  getLoginCountDisplay(): string {
    if (!this.userProfile.loginCount || this.userProfile.loginCount === 0) {
      return 'First time here!';
    }
    return `${this.userProfile.loginCount}`;
  }

  shouldShowCountry(): boolean {
    return !!(
      this.userProfile?.country &&
      this.userProfile.country.trim() !== '' &&
      this.userProfile.country !== 'Select your country'
    );
  }

  getCountryFlag(): string {
    return this.countryFlagsService.getCountryFlag(this.userProfile?.country);
  }

  // Pass through events from child components
  onQuestionUpdated(data: { index: number; answer: string }) {
    this.questionUpdated.emit(data);
  }

  onSaveAnswers() {
    this.isEditing = false;
    this.editingChanged.emit(this.isEditing);
    this.saveAnswers.emit();
  }

  onEditingChanged(editing: boolean) {
    this.isEditing = editing;
    this.editingChanged.emit(editing);
  }

  getProfileShareReasons(): string[] {
    const reasons: string[] = [];
    if (!this.userProfile?.rankings?.topThirteen?.length) {
      reasons.push('Add at least one song to your Top 13');
    }
    if (
      !this.userProfile?.profileQuestions?.some(
        (q) => q.answer && q.answer !== ''
      )
    ) {
      reasons.push('Answer at least one question in the Swiftie Questionnaire');
    }
    if (this.topFiveAlbums.length < 5) {
      reasons.push('Rank your top 5 albums');
    }
    return reasons;
  }

  isProfileShareable(): boolean {
    const hasTopThirteenSong =
      this.userProfile?.rankings?.topThirteen?.length > 0;
    const hasAnsweredQuestion = this.userProfile?.profileQuestions?.some(
      (q) => q.answer && q.answer !== ''
    );
    const hasTopFiveAlbums = this.topFiveAlbums.length === 5;
    return !!hasTopThirteenSong && !!hasAnsweredQuestion && hasTopFiveAlbums;
  }

  shareProfile() {
    if (!this.isProfileShareable()) {
      this.toastr.warning(
        'Please add at least one song to your Top 13 and answer at least one question before sharing your profile.',
        'Cannot Share Yet',
        {
          timeOut: 5000,
        }
      );
      return;
    }

    const shareUrl = `${window.location.origin}/public-profile/${this.userProfile.username}`;
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        this.toastr.success('Profile link copied to clipboard!', 'Success', {
          timeOut: 3000,
        });
      },
      (err) => {
        this.toastr.error('Could not copy profile link', 'Error', {
          timeOut: 3000,
        });
      }
    );
  }
}
