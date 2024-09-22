import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Top13SongSlotComponent } from '../top-13-song-slot/top-13-song-slot.component';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { TopThirteenStateService } from '../../../../services/top-thirteen-state.service';
import { TopThirteenService } from '../../../../services/top-thirteen.service';
import { TopThirteenItem } from '../../../../interfaces/Top13Item';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-top-13-song-slot-list',
  standalone: true,
  imports: [CommonModule, Top13SongSlotComponent, DragDropModule],
  templateUrl: './top-13-song-slot-list.component.html',
  styleUrl: './top-13-song-slot-list.component.scss'
})
export class Top13SongSlotListComponent implements OnInit {
  slots: TopThirteenItem[] = [];

  constructor(
    private topThirteenStateService: TopThirteenStateService,
    private topThirteenService: TopThirteenService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initializeSlots();
    this.loadUserTopThirteen();
  }

  initializeSlots() {
    this.slots = Array(13).fill(null).map((_, index) => ({
      slot: index + 1,
      albumName: '',
      songId: '',
      songTitle: '',
      albumCover: ''
    }));
  }

  loadUserTopThirteen() {
    this.topThirteenService.getTopThirteen().subscribe(
      (userList: TopThirteenItem[]) => {
        userList.forEach(item => {
          const index = item.slot - 1;
          if (index >= 0 && index < 13) {
            this.slots[index] = item;
          }
        });
        this.topThirteenStateService.updateTopThirteen(this.slots);
      },
      error => {
        console.error('Error loading top thirteen:', error);
        // Handle error (e.g., show a toast message)
      }
    );
  }

  onDrop(event: CdkDragDrop<TopThirteenItem[]>) {
    moveItemInArray(this.slots, event.previousIndex, event.currentIndex);
    this.updateSlotIndexes();
    this.saveReorderedList();
  }

  updateSlotIndexes() {
    this.slots.forEach((item, index) => {
      item.slot = index + 1;
    });
  }

  saveReorderedList() {
    this.topThirteenService.updateEntireList(this.slots).subscribe({
      next: (updatedList) => {
        this.topThirteenStateService.updateTopThirteen(updatedList);
        this.toastr.success('Top 13 list updated successfully', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating top 13 list:', error);
        if (error.status === 500 && error.error && error.error.message) {
          this.toastr.error(error.error.message, 'Error');
        } else {
          this.toastr.error('An unexpected error occurred while updating the list', 'Error');
        }
        // Optionally, revert the changes in the UI
        this.loadUserTopThirteen();
      }
    });
  }
}