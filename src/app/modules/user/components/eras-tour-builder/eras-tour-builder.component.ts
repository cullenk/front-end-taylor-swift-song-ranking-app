// eras-tour-builder.component.ts
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { RankingsService } from '../../../../services/rankings.service';
import { EraSetList } from '../../../../interfaces/EraSetList';
import { EraWidgetComponent } from '../era-widget/era-widget.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [EraWidgetComponent, DragDropModule, CommonModule],
  selector: 'app-eras-tour-builder',
  template: `
    <div class="eras-tour-builder">
      <h1>Create Your Eras Tour Setlist</h1>
      
      <div cdkDropList class="era-list" (cdkDropListDropped)="onDrop($event)">
        <div *ngFor="let era of setList; let i = index" cdkDrag class="era-item">
          <app-era-widget 
            [era]="era" 
            (eraUpdated)="updateEra($event)">
          </app-era-widget>
        </div>
      </div>
      <button (click)="saveSetList()">Save Entire Setlist</button>
    </div>
  `
})
export class ErasTourBuilderComponent implements OnInit {
  eras = ['Debut', 'Fearless', 'Speak Now', 'Red', '1989', 'Reputation', 'Lover', 'Folklore', 'Evermore', 'Midnights', 'The Tortured Poets Department', 'Surprise Songs'];
  setList: EraSetList[] = [];

  constructor(private rankingsService: RankingsService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadSetList();
  }

  loadSetList() {
    console.log('Loading setlist');
    this.rankingsService.getErasTourSetList().subscribe(
      (setList) => {
        console.log('Received setlist:', setList);
        if (setList && setList.length > 0) {
          this.setList = setList;
        } else {
          console.log('Initializing new setlist');
          this.setList = this.initializeSetList();
        }
      },
      (error) => {
        console.error('Error loading set list', error);
        this.setList = this.initializeSetList();
      }
    );
  }

  initializeSetList(): EraSetList[] {
    return this.eras.map((era, index) => ({
      order: index,
      era: era,
      songs: [null, null, null, null]
    }));
  }
  

  onDrop(event: CdkDragDrop<EraSetList[]>) {
    moveItemInArray(this.setList, event.previousIndex, event.currentIndex);
    this.updateSetListOrder();
    this.saveSetList();
  }

  updateSetListOrder() {
    this.setList.forEach((item, index) => item.order = index);
  }

  updateEra(updatedEra: EraSetList) {
    const index = this.setList.findIndex(era => era.era === updatedEra.era);
    if (index !== -1) {
      this.setList[index] = updatedEra;
      this.saveSetList();
    }
  }

  saveSetList() {
    console.log('Saving setlist:', this.setList); // Add this log
    this.rankingsService.updateErasTourSetList(this.setList).subscribe(
      () => {
        console.log('Set list saved successfully');
        this.toastr.success('Setlist saved successfully', 'Success');
      },
      (error) => {
        console.error('Error saving set list', error);
        this.toastr.error('Failed to save setlist', 'Error');
      }
    );
  }
  
}
