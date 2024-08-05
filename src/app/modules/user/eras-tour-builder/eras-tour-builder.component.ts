import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { RulesService } from '../../../services/eras-builder-rules.service';
import { EraSetList } from '../../../interfaces/EraSetList';
import { ToastrService } from 'ngx-toastr';
import { RankingsService } from '../../../services/rankings.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { CommonModule } from '@angular/common';
import { EraWidgetComponent } from '../components/era-widget/era-widget.component';

@Component({
  standalone: true,
  imports: [EraWidgetComponent, DragDropModule, CommonModule],
  selector: 'app-eras-tour-builder',
  templateUrl: './eras-tour-builder.component.html',
  styleUrls: ['./eras-tour-builder.component.scss'],
})
export class ErasTourBuilderComponent implements OnInit {
  eras = [
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
  ];
  setList: EraSetList[] = [];
  totalSongs: number = 0;
  totalMashups: number = 0;
  erasAccountedFor: number = 0;
  totalSurpriseSongs: number = 0;
  allChoicesMade: boolean = false;
  isSetListValid: boolean = false;
  showResetDialog: boolean = false;
  username: string | null = null;

  constructor(
    private rankingService: RankingsService,
    private rulesService: RulesService,
    private toastr: ToastrService,
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.loadUsername();
    this.loadSetList();
  }

  loadUsername() {
    this.username = this.authService.getUsername();
    if (!this.username) {
      this.userProfileService.getUserProfile().subscribe(
        (profile) => {
          this.username = profile.username;
          localStorage.setItem('username', this.username);
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
  }

  loadSetList() {
    this.rankingService.getErasTourSetList().subscribe(
      (setList) => {
        this.setList = setList.length > 0 ? setList : this.initializeSetList();
        this.updateCounters();
      },
      (error) => {
        console.error('Error loading set list', error);
        this.setList = this.initializeSetList();
        this.updateCounters();
      }
    );
  }

  initializeSetList(): EraSetList[] {
    return this.eras.map((era, index) => ({
      era,
      songs: [],
      order: index,
    }));
  }

  onDrop(event: CdkDragDrop<EraSetList[]>) {
    moveItemInArray(this.setList, event.previousIndex, event.currentIndex);
    this.updateSetListOrder();
  }

  updateSetListOrder() {
    this.setList.forEach((item, index) => (item.order = index));
    this.updateCounters();
  }

  updateEra(updatedEra: EraSetList) {
    const index = this.setList.findIndex((era) => era.era === updatedEra.era);
    if (index !== -1) {
      this.setList[index] = updatedEra;
      this.updateCounters();
    }
  }

  updateCounters() {
    this.totalSongs = this.setList.reduce((count, era) => {
      if (era.era === 'Surprise Songs') return count;
      return count + era.songs.length;
    }, 0);
    this.totalMashups = this.setList.reduce((count, era) => {
      if (era.era === 'Surprise Songs') return count;
      return count + era.songs.filter((song) => song.isMashup).length;
    }, 0);
    this.erasAccountedFor = this.setList.filter(era => era.era !== 'Surprise Songs' && era.songs.length > 0).length;
    this.totalSurpriseSongs = this.setList.find(era => era.era === 'Surprise Songs')?.songs.length || 0;

    this.allChoicesMade = this.checkAllChoicesMade();
  }

  checkAllChoicesMade(): boolean {
    return this.totalSongs === 45 && this.erasAccountedFor === 11 && this.totalSurpriseSongs === 2;
  }

  saveProgress() {
    // Logic to save user's choices without verification
    this.rankingService.updateErasTourSetList(this.setList).subscribe(
      () => this.toastr.success('Progress saved successfully'),
      (error) => this.toastr.error('Failed to save progress')
    );
  }

  verifySetList() {
    if (this.rulesService.validateSetList(this.setList)) {
      this.isSetListValid = true;
      this.toastr.success('Set list verified successfully!');
    } else {
      this.isSetListValid = false;
      this.toastr.error('Set list does not comply with the rules.');
    }
  }

  generateShareLink() {
    const username = this.getUsername();
    const shareableLink = `${window.location.origin}/share-setlist/${username}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      this.toastr.success('Shareable link copied to clipboard!');
    }).catch(err => {
      this.toastr.error('Failed to copy link to clipboard.');
    });
  }

  getUsername(): string {
    return this.username || 'username-placeholder';
  }

  openResetDialog() {
    this.showResetDialog = true;
  }

  closeResetDialog() {
    this.showResetDialog = false;
  }

  confirmReset() {
    this.setList = this.initializeSetList();
    this.updateCounters();
    this.rankingService.updateErasTourSetList(this.setList).subscribe(
      () => this.toastr.success('Set list reset successfully'),
      (error) => this.toastr.error('Failed to reset set list')
    );
    this.closeResetDialog();
  }
}
