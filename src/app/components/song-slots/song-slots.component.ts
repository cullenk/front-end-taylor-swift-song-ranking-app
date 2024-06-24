// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AlbumService } from '../../services/album.service';
// import { SongSlotComponent } from '../song-slot/song-slot.component';
// import {MatGridListModule} from '@angular/material/grid-list';

// @Component({
//   selector: 'app-song-slots',
//   standalone: true,
//   imports: [CommonModule, SongSlotComponent, MatGridListModule],
//   templateUrl: './song-slots.component.html',
//   styleUrl: './song-slots.component.scss'
// })
// export class SongSlotsComponent {
//   viewMode: 'list' | 'grid' = 'list';
//   slots = Array(13).fill(0);
//   // selectedSongs: any[] = [];

//   constructor(private albumService: AlbumService) {}

//   toggleView(mode: 'list' | 'grid') {
//     this.viewMode = mode;
//   }

//   // onSongSelected(song: any, slotIndex: number) {
//   //   this.selectedSongs[slotIndex] = song;
//   // }

//   // getAlbumCover(album: any) {
//   //   return album.albumCover;
//   // }
// }
