import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Top13SongSlotComponent } from '../top-13-song-slot/top-13-song-slot.component';
import { Meta, Title } from '@angular/platform-browser';
import { TopThirteenStateService } from '../../../../services/top-thirteen-state.service';
import { TopThirteenService } from '../../../../services/top-thirteen.service';
import { TopThirteenItem } from '../../../../interfaces/Top13Item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-top-13-song-slot-list',
  standalone: true,
  imports: [CommonModule, Top13SongSlotComponent, DragDropModule],
  templateUrl: './top-13-song-slot-list.component.html',
  styleUrl: './top-13-song-slot-list.component.scss',
})
export class Top13SongSlotListComponent implements OnInit {
  topThirteen: TopThirteenItem[] = [];
  hasUnsavedChanges = false;
  isSaving = false;

  constructor(
    private meta: Meta,
    private title: Title,
    private topThirteenStateService: TopThirteenStateService,
    private topThirteenService: TopThirteenService,
    private toastr: ToastrService
  ) {
    console.log('Top13SongSlotListComponent constructor called');
  }

  ngOnInit() {
    console.log('Top13SongSlotListComponent.ngOnInit() called');
    this.updateMetaTags();
    this.loadTopThirteen();
    this.loadFreshData();
  }

  loadFreshData() {
    console.log('Loading fresh data from backend');
    this.topThirteenService.getTopThirteen().subscribe(
      (data) => {
        console.log('Fresh data loaded:', data);
        const paddedData = this.padTopThirteenList(data);
        this.topThirteen = paddedData;
        this.topThirteenStateService.updateTopThirteen(paddedData);
        this.hasUnsavedChanges = false;
      },
      (error) => {
        console.error('ERROR loading fresh data:', error);
        this.toastr.error('Failed to load top 13 data from server', 'Error');
      }
    );
  }

  loadTopThirteen() {
    this.topThirteenStateService.topThirteen$.subscribe((list) => {
      this.topThirteen = this.padTopThirteenList(list);
    });
  }

  padTopThirteenList(list: TopThirteenItem[]): TopThirteenItem[] {
    const paddedList = [...list];

    // Fill empty slots up to 13
    for (let i = 1; i <= 13; i++) {
      if (!paddedList.find((item) => item.slot === i)) {
        paddedList.push({
          slot: i,
          albumName: '',
          songId: '',
          songTitle: '',
          albumCover: '',
        });
      }
    }

    return paddedList.sort((a, b) => a.slot - b.slot);
  }

  onDrop(event: CdkDragDrop<TopThirteenItem[]>) {
    if (event.previousIndex !== event.currentIndex) {
      // Create a copy of the array for manipulation
      const updatedList = [...this.topThirteen];

      // Move the item in the array
      moveItemInArray(updatedList, event.previousIndex, event.currentIndex);

      // Reassign slot numbers based on new positions
      const reorderedList = updatedList.map((item, index) => ({
        ...item,
        slot: index + 1,
      }));


      // Update locally and mark as changed
      this.topThirteen = reorderedList;
      this.topThirteenStateService.updateTopThirteen(reorderedList);
      this.hasUnsavedChanges = true;
    }
  }

  // Called when a child component updates a song
  onSongUpdated() {
    this.hasUnsavedChanges = true;
  }

  // Called when a child component removes a song
  onSongRemoved() {
    this.hasUnsavedChanges = true;
  }

  saveChanges() {
    if (!this.hasUnsavedChanges) {
      this.toastr.info('No changes to save', 'Info');
      return;
    }

    this.isSaving = true;

    this.topThirteenService.updateEntireTopThirteen(this.topThirteen).subscribe(
      (updatedList) => {
        this.topThirteenStateService.updateTopThirteen(updatedList);
        this.hasUnsavedChanges = false;
        this.isSaving = false;
        this.toastr.success('Top 13 list saved successfully!', 'Success');
      },
      (error) => {
        console.error('Error saving changes:', error);
        this.isSaving = false;
        this.toastr.error('Error saving top 13 list', 'Error');
      }
    );
  }

  discardChanges() {
    this.loadFreshData();
  }

  updateMetaTags() {
    this.title.setTitle('Top 13 List - Swiftie Ranking Hub');

    this.meta.updateTag({
      name: 'description',
      content: 'Rank your Top 13 Taylor Swift songs.',
    });

    // Open Graph
    this.meta.updateTag({
      property: 'og:title',
      content: 'Swiftie Ranking Hub',
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Rank your Top 13 Taylor Swift songs.',
    });
    this.meta.updateTag({
      property: 'og:image',
      content:
        'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp',
    });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://swiftierankinghub.com/user/top13list',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'Top 13 List - Swiftie Ranking Hub',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: 'Rank your Top 13 Taylor Swift songs.',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content:
        'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp',
    });
  }
}