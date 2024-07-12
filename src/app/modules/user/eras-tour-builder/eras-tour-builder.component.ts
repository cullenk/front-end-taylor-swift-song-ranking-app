import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { RankingsService } from '../../../services/rankings.service';
import { EraSetList } from '../../../interfaces/EraSetList';
import { EraWidgetComponent } from '../components/era-widget/era-widget.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [EraWidgetComponent, DragDropModule, CommonModule],
  selector: 'app-eras-tour-builder',
  template: `
    <div class="eras-tour-builder">
      <h1>Create Your Eras Tour Setlist</h1>
      <section class="rules-section">
        <h2>Eras Tour Builder Rules</h2>
        <ul>
          <li>Drag and drop the eras to reorder them.</li>
          <li>Select up to 4 songs for each era.</li>
          <li>Click the 'x' to remove a song.</li>
          <li>Your changes are saved automatically.</li>
        </ul>
      </section>
      <div cdkDropList class="era-list" (cdkDropListDropped)="onDrop($event)">
        <div *ngFor="let era of setList; let i = index" cdkDrag class="era-item">
          <app-era-widget 
            [era]="era" 
            (eraUpdated)="updateEra($event)">
          </app-era-widget>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./eras-tour-builder.component.scss']
})
export class ErasTourBuilderComponent implements OnInit {
  eras = ['Debut', 'Fearless', 'Speak Now', 'Red', '1989', 'Reputation', 'Lover', 'Folklore', 'Evermore', 'Midnights', 'The Tortured Poets Department', 'Surprise Songs'];
  setList: EraSetList[] = [];

  constructor(private rankingsService: RankingsService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadSetList();
  }

  loadSetList() {
    this.rankingsService.getErasTourSetList().subscribe(
      (setList) => {
        if (setList && setList.length > 0) {
          this.setList = setList;
        } else {
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
      era: era,
      songs: [], // Initialize as an empty array of EraSetListSong objects
      order: index // Initialize the order property
    }));
  }

  onDrop(event: CdkDragDrop<EraSetList[]>) {
    moveItemInArray(this.setList, event.previousIndex, event.currentIndex);
    this.updateSetListOrder();
  }

  updateSetListOrder() {
    this.setList.forEach((item, index) => item.order = index);
  }

  updateEra(updatedEra: EraSetList) {
    const index = this.setList.findIndex(era => era.era === updatedEra.era);
    if (index !== -1) {
      this.setList[index] = updatedEra;
    }
  }
}