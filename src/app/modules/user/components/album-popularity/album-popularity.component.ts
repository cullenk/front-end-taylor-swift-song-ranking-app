import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../../../../services/rankings.service';
import { HomePageAlbumRanking } from '../../../../interfaces/HomePageAlbumRanking';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-album-popularity',
  templateUrl: './album-popularity.component.html',
  styleUrls: ['./album-popularity.component.scss']
})
export class AlbumPopularityComponent implements OnInit {
  albums: HomePageAlbumRanking[] = [];

  constructor(private rankingsService: RankingsService) {}

  ngOnInit() {
    this.loadAlbumPopularity();
  }

  loadAlbumPopularity() {
    this.rankingsService.getAlbumPopularity().subscribe(
      (albums) => {
        this.albums = albums;
        console.log(albums)
      },
      (error) => {
        console.error('Error loading album popularity:', error);
      }
    );
  }
}