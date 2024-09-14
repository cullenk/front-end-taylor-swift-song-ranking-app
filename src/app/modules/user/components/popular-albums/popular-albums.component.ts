import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../../services/album.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-popular-albums',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-albums.component.html',
  styleUrl: './popular-albums.component.scss'
})
export class PopularAlbumsComponent implements OnInit {
  popularAlbums: any[] = [];

  constructor(private albumService: AlbumService) {}

  ngOnInit() {
    // this.getPopularAlbums();
  }

  // getPopularAlbums() {
  //   this.albumService.getPopularAlbums().subscribe(
  //     (albums: any[]) => {
  //       this.popularAlbums = albums.slice(0, 5); // Get top 5 albums
  //     },
  //     error => {
  //       console.error('Error fetching popular albums', error);
  //     }
  //   );
  // }
}
