import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Top13SongSlotComponent } from '../top-13-song-slot/top-13-song-slot.component';

@Component({
  selector: 'app-top-13-song-slot-list',
  standalone: true,
  imports: [CommonModule, Top13SongSlotComponent],
  templateUrl: './top-13-song-slot-list.component.html',
  styles: []
})
export class Top13SongSlotListComponent implements OnInit {
  slots: number[] = Array(13).fill(0);

  ngOnInit() {
    // Any initialization logic if needed
  }
}
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AlbumService } from '../../../../services/album.service';
// import { Top13SongSlotComponent } from '../top-13-song-slot/top-13-song-slot.component';
// import { TopThirteenService } from '../../../../services/top-thirteen.service';

// @Component({
//   selector: 'app-top-13-song-slot-list',
//   standalone: true,
//   imports: [CommonModule, Top13SongSlotComponent],
//   templateUrl: './top-13-song-slot-list.component.html',
//   styleUrl: './top-13-song-slot-list.component.scss'
// })
// export class Top13SongSlotListComponent implements OnInit {
//   viewMode: 'list' | 'grid' = 'list';
//   slots = Array(13).fill(0);
//   // selectedSongs: any[] = [];

//   constructor(private albumService: AlbumService, private topThirteenService: TopThirteenService) {}

//   ngOnInit() {
//     this.loadTopThirteen();
//   }

//   toggleView(mode: 'list' | 'grid') {
//     this.viewMode = mode;
//   }

//   loadTopThirteen() {
//     this.topThirteenService.getTopThirteen().subscribe(
//       data => this.slots = data,
//       error => console.error('Error loading top thirteen', error)
//     );
//   }

//   removeSong(slot: number) {
//     this.topThirteenService.removeSong(slot).subscribe(
//       () => this.loadTopThirteen(),
//       error => console.error('Error removing song', error)
//     );
//   }

//   // onSongSelected(song: any, slotIndex: number) {
//   //   this.selectedSongs[slotIndex] = song;
//   // }

//   // getAlbumCover(album: any) {
//   //   return album.albumCover;
//   // }
// }
