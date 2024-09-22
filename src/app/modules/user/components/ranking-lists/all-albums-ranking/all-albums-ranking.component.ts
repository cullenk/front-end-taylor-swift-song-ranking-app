import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RankingsService } from "../../../../../services/rankings.service";
import { AlbumService } from "../../../../../services/album.service";
import { Album } from "../../../../../interfaces/Album";
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AlbumRanking } from "../../../../../interfaces/AlbumRanking";
import { Router } from "@angular/router";

@Component({
  selector: 'app-all-albums-ranking',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './all-albums-ranking.component.html',
  styleUrls: ['./all-albums-ranking.component.scss']
})
export class AllAlbumsRankingComponent implements OnInit {
  albums: Album[] = [];
  albumRankings: AlbumRanking[] = [];

  constructor(
    private rankingsService: RankingsService,
    private albumService: AlbumService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.albumService.getAlbums().subscribe(
      (albums: Album[]) => {
        this.albums = albums.filter(album => album.title !== 'Singles');
        this.albums.sort((a, b) => a.releaseYear - b.releaseYear);
        // console.log('Fetched albums:', albums);
        this.loadAlbumRankings();
      },
      error => {
        console.error('Error fetching albums:', error);
      }
    );
  }

  loadAlbumRankings() {
    this.rankingsService.getUserRankings().subscribe(
      (rankings) => {
        // console.log('Fetched rankings:', rankings);
        if (
          rankings &&
          rankings.albumRankings &&
          rankings.albumRankings['allAlbums'] &&
          rankings.albumRankings['allAlbums'].length > 0
        ) {
          this.albumRankings = rankings.albumRankings['allAlbums'].map((ranking: any) => ({
            rank: ranking.rank,
            albumName: ranking.albumName.toString(),
            albumCover: ranking.albumCover.toString(),
          }));
          // console.log('Processed album rankings:', this.albumRankings);
          this.applyRankingsToAlbums();
        } else {
          // console.log('No album rankings found, using default order');
          this.cd.detectChanges();
        }
      },
      error => {
        console.error('Error fetching album rankings:', error);
        this.cd.detectChanges();
      }
    );
  }

  applyRankingsToAlbums() {
    if (this.albumRankings.length > 0) {
      const rankMap = new Map(this.albumRankings.map(r => [r.albumName, r.rank]));
      this.albums.sort((a, b) => {
        const rankA = rankMap.get(a.title) ?? Infinity;
        const rankB = rankMap.get(b.title) ?? Infinity;
        return rankA - rankB;
      });
    }
    // console.log('Albums after applying rankings:', this.albums);
    this.cd.detectChanges();
  }

  onDrop(event: CdkDragDrop<Album[]>) {
    moveItemInArray(this.albums, event.previousIndex, event.currentIndex);
    this.updateAlbumRankings();
  }

  goBackToAlbumRankings() {
    this.router.navigate(['user/rankings']); 
  }

  updateAlbumRankings() {
    const newRankings: AlbumRanking[] = this.albums.map((album, index) => ({
      rank: index + 1,
      albumName: album.title,
      albumCover: album.albumCover,
    }));
  
    // console.log('Updating album rankings:', newRankings);
  
    this.rankingsService.updateAlbumRanking(newRankings).subscribe(
      response => {
        // console.log('Album rankings updated:', response); // Log the response
        this.albumRankings = response; // Update local rankings with response
        // Verify that the response is correctly assigned
        // console.log('Updated albumRankings:', this.albumRankings);
      },
      error => console.error('Error updating album rankings:', error)
    );
  }
}