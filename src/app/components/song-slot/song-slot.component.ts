// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import {MatCardModule} from '@angular/material/card'
// import { CommonModule } from '@angular/common';
// import { AlbumService } from '../../services/album.service';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-song-slot',
//   standalone: true,
//   imports: [CommonModule, FormsModule, MatCardModule],
//   templateUrl: './song-slot.component.html',
//   styleUrl: './song-slot.component.scss'
// })
// export class SongSlotComponent {
//   "searchQuery": string;
//   // searchResults: any[] = [];
//   selectedSong: any;
//   selectedAlbum: any;
//   @Input() "slotIndex": number;


//   constructor(private albumService: AlbumService) {}

//   searchSongs() {
//     this.albumService.searchSongs(this.searchQuery).subscribe(
//       (results) => {
//         console.log(this.searchResults)
//         this.searchResults = results;
//       },
//       (error) => {
//         console.error('Error searching songs:', error);
//       }
//     );
//   }

//   selectSong(song: any) {
//     this.selectedSong = song;
//     this.getAlbumBySong(song.title);
//   }
  
//   getAlbumBySong(songTitle: string) {
//     this.albumService.getAlbumBySong(songTitle).subscribe(
//       (album) => {
//         this.selectedAlbum = album;
//       },
//       (error) => {
//         console.error('Error getting album:', error);
//       }
//     );
//   }

//   getColorFromAlbum(albumTitle: string) {
//     let color;
//     if(albumTitle == 'Taylor Swift'){
//       color = '#00FF00'
//     } else {
//       color = 'red'
//     }
   
//     return color;
//   }

//   resetSong() {
//     if (this.selectedSong) {
//       this.selectedSong = null;
//       this.searchQuery = '';
//       this.searchResults = [];
//       // Clear any other song-related state in your component
//     }
//   }
  
// }
