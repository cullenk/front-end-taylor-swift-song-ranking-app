import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReleaseNote {
  version: string;
  date: string;
  features: string[];
  type?: 'major' | 'minor' | 'patch';
}

@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseNotesComponent {
  
  readonly releaseNotes: ReleaseNote[] = [
      {
      version: '2.0.1',
      date: 'October 14th, 2025',
      type: 'minor',
      features: [
        'Added "The Life of a Showgirl" songs and content'
      ]
    },
    {
      version: '2.0.0',
      date: 'September 28th, 2025',
      type: 'major',
      features: [
        'Major design and performance enhancements',
        'Profile page redesign now shows all user rankings and features',
        'Added home screen for Google Adsense discoverability',
      ]
    },
    {
      version: '1.1.3',
      date: 'September 14th, 2025',
      type: 'minor',
      features: [
        'New profile image options with improved selection',
        'Added login count data to user profile analytics',
        'Added country option to user profile and global stats card in User Explorer',
        'Image refactoring to WebP files for better performance',
        'Top 13 List redesign with drag and drop functionality'
      ]
    },
    {
      version: '1.1.2',
      date: 'August 13th, 2025',
      type: 'minor',
      features: [
        'Replaced Sendgrid email service with MailerSend for better reliability',
        'Added comprehensive "Users\' Favorite Songs" analytics page',
        'Created countdown to "The Life of a Showgirl" album release!'
      ]
    },
    {
      version: '1.1.1',
      date: 'March 1st, 2025',
      type: 'minor',
      features: [
        'Added debouncing in search inputs for better performance',
        'Implemented input sanitization for questionnaire form security',
        'Updated user explorer logic and enhanced styling across the app'
      ]
    },
    {
      version: '1.1.0',
      date: 'November 13th, 2024',
      type: 'patch',
      features: [
        'Implemented optimized database querying to handle increased traffic',
        'Added homepage data caching to significantly improve load times',
        'Added pagination to the user explorer page for better navigation'
      ]
    },
    {
      version: '1.0.2',
      date: 'October 10th, 2024',
      type: 'minor',
      features: [
        'Added "Rank By Track" feature with personal album builder',
        'Introduced "Rank All Songs" comprehensive ranking system',
        'Added 11 new songs featuring Taylor Swift by other artists',
        'Significantly improved mobile UI and responsive design'
      ]
    },
    {
      version: '1.0.1',
      date: 'October 1st, 2024',
      type: 'minor',
      features: [
        'Implemented Eras Tour vs Popular songs chart data visualization',
        'Fixed critical bugs in username/password creation and reset functionality',
        'Added User Explorer page to discover and view other user profiles'
      ]
    },
    {
      version: '1.0.0',
      date: 'September 28th, 2024',
      type: 'major',
      features: [
        '🎉 Initial release of Swiftie Ranking Hub',
        'Core album ranking functionality with intuitive interface',
        'Top 13 List building with drag-and-drop capabilities',
        'Interactive Eras Tour Builder for concert setlists',
        'User profile creation and comprehensive management system'
      ]
    }
  ];

  /**
   * Track by function for ngFor performance
   */
  trackByVersion(index: number, release: ReleaseNote): string {
    return release.version;
  }

  /**
   * Get CSS class for release type
   */
  getReleaseTypeClass(type: string | undefined): string {
    switch (type) {
      case 'major': return 'major-release';
      case 'minor': return 'minor-release';
      case 'patch': return 'patch-release';
      default: return 'minor-release';
    }
  }

  /**
   * Get release type label
   */
  getReleaseTypeLabel(type: string | undefined): string {
    switch (type) {
      case 'major': return 'Major Release';
      case 'minor': return 'Feature Update';
      case 'patch': return 'Bug Fix';
      default: return 'Update';
    }
  }

  trackByFeature(index: number, feature: string): string {
  return feature;
}
}