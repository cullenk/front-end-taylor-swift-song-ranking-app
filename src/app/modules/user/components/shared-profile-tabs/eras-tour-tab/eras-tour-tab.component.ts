// src/app/modules/user/components/shared-profile-tabs/eras-tour-tab/eras-tour-tab.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserProfileService } from '../../../../../services/user-profile.service';
import { UserProfile } from '../../../../../interfaces/userProfile';
import { EraSetList } from '../../../../../interfaces/EraSetList';

interface EraSetListSong {
  _id: string;
  title: string;
  audioSource: string;
  isMashup?: boolean;
}

@Component({
  selector: 'app-eras-tour-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eras-tour-tab.component.html',
  styleUrls: ['./eras-tour-tab.component.scss']
})
export class ErasTourTabComponent implements OnInit {
  @Input() userProfile!: UserProfile;
  @Input() isEditable: boolean = false; 
  @Input() isOwner: boolean = false;
  @Input() hasErasTour: boolean = false;
  
  setList: EraSetList[] = [];
  isLoading: boolean = false;
  loadingError: string | null = null;

  constructor(private userProfileService: UserProfileService, private router: Router) {}

  ngOnInit() {
    if (this.hasErasTour && this.userProfile?.username) {
      this.loadSetList();
    }
  }

  loadSetList() {
    this.isLoading = true;
    this.loadingError = null;
    
    this.userProfileService.getErasTourSetListByUsername(this.userProfile.username).subscribe(
      (setList) => {
        this.setList = setList;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading set list:', error);
        this.loadingError = 'Failed to load your Dream Eras Tour setlist.';
        this.isLoading = false;
      }
    );
  }

  getAlbumCover(era: string): string {
    const albumCovers: { [key: string]: string } = {
      'Debut': 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      'Fearless': 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      'Speak Now': 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      'Red': 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      '1989': 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      'Reputation': 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
      'Lover': 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      'Folklore': 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      'Evermore': 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      'Midnights': 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
      'The Tortured Poets Department': 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      'Surprise Songs': 'https://d3e29z0m37b0un.cloudfront.net/surpriseSongs.webp'
    };
    return albumCovers[era] || 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp';
  }

  getSurpriseSongs(songs: EraSetListSong[]): { guitar: EraSetListSong, piano: EraSetListSong } {
    return {
      guitar: songs[0] || { _id: '', title: 'Not selected', audioSource: '' },
      piano: songs[1] || { _id: '', title: 'Not selected', audioSource: '' }
    };
  }

  getNoSetlistMessage(): string {
    if (this.isOwner) {
      return `${this.userProfile?.username || 'This user'} hasn't created their dream Eras Tour setlist yet.`;
    } else {
      return `${this.userProfile?.username || 'This user'} hasn't created their dream Eras Tour setlist yet.`;
    }
  }

  navigateToCreateSetlist() {
    // Use Angular Router to navigate in the same tab
    this.router.navigate(['/user/erasTourBuilder']);
  }
}