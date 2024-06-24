import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss'
})

export class AlbumsComponent implements OnInit {
  "albums": any[];

  constructor(private albumService: AlbumService) {}

  ngOnInit() {
    this.getAlbums();
  }

  getAlbums() {
    this.albumService.getAlbums().subscribe(
      (data) => {
        this.albums = data;
        console.log('Albums: ', this.albums)
      },
      (error) => {
        console.error('Error fetching albums:', error);
      }
    );
  }
}
