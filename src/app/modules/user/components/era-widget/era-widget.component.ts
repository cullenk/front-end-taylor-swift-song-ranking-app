import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EraSetList, SongWithAlbum } from '../../../../interfaces/EraSetList';
import { CommonModule } from '@angular/common';
import { ErasSongSearchComponent } from '../eras-song-search/eras-song-search.component';
import { Song } from '../../../../interfaces/Song';

@Component({
  selector: 'app-era-widget',
  template: `
    <div class="era-widget">
      <h2>{{ era.era }}</h2>
      <div class="song-slots">
        <div *ngFor="let song of era.songs; let i = index" class="song-slot">
          <ng-container *ngIf="song; else searchSlot">
            <p>{{ song.title }}</p>
            <button (click)="removeSong(i)">Remove</button>
          </ng-container>
          <ng-template #searchSlot>
            <app-eras-song-search 
              [albumName]="era.era" 
              (songSelected)="addSong($event, i)">
            </app-eras-song-search>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ErasSongSearchComponent]
})
export class EraWidgetComponent {
  @Input() era!: EraSetList;
  @Output() eraUpdated = new EventEmitter<EraSetList>();

  addSong(song: Song, index: number) {
    const songWithAlbum: SongWithAlbum = {
      ...song,
      album: this.era.era  // Assuming the era name is the album name
    };
    this.era.songs[index] = songWithAlbum;
    this.eraUpdated.emit(this.era);
  }

  removeSong(index: number) {
    this.era.songs[index] = null;
    this.eraUpdated.emit(this.era);
  }
}
