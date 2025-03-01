import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReleaseNote {
  version: string;
  date: string;
  features: string[];
}

@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent {
  releaseNotes: ReleaseNote[] = [
    {
      version: '1.4.0',
      date: 'March 1st, 2025',
      features: [
        'Added debouncing in search inputs',
        'Handled input sanitization for questionnaire form',
        'Updated user explorer logic and various styling',
      ]
    },
    {
      version: '1.3.0',
      date: 'Nov 13th, 2024',
      features: [
        'Implemented better database querying to handle more traffic',
        'Cached homepage data to improve load times',
        'Added pagination to the user explorer page',
      ]
    },
    {
      version: '1.2.0',
      date: 'Oct 10th, 2024',
      features: [
        'Added "Rank By Track" feature with personal album builder',
        'Added "Rank All Songs" feature',
        'Added 11 new songs to choose from (songs featuring Taylor by other artists)',
        'Improved UI for mobile devices'
      ]
    },
    {
      version: '1.1.0',
      date: 'Oct 1st, 2024',
      features: [
        'Implemented top Eras Tour vs Popular songs chart data',
        'Fixed bugs in username/password creation and reset',
        'Added User Explorer page to view other user profiles'
      ]
    },
    {
      version: '1.0.0',
      date: 'Sept 28th, 2024',
      features: [
        'Initial release of Swiftie Ranking Hub',
        'Basic album ranking functionality',
        'Top 13 List Building',
        'Eras Tour Builder',
        'User profile creation and management'
      ]
    }
  ];
}