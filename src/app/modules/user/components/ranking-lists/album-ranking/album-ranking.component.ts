import { Component, ElementRef, OnInit, QueryList, ViewChildren, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { RankingsService } from "../../../../../services/rankings.service";
import { AlbumService } from "../../../../../services/album.service";
import { Album } from "../../../../../interfaces/Album";
import { Song } from "../../../../../interfaces/Song";
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Ranking, Rankings } from '../../../../../interfaces/Rankings';

interface AlbumConfig {
  title: string;
  displayName: string;
  releaseDate: string;
  coverImage: string;
  backgroundImage: string; 
  dbKey: string;
}

@Component({
  selector: 'app-album-ranking',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './album-ranking.component.html',
  styleUrls: ['./album-ranking.component.scss']
})
export class AlbumRankingComponent implements OnInit, OnDestroy {
  rankings: Ranking[] = [];
  songs: Song[] = [];
  albumConfig: AlbumConfig | null = null;
  currentlyPlaying: Song | null = null;
  
  @ViewChildren('audioPlayer') audioPlayers!: QueryList<ElementRef>;

  // Album configurations mapping
  private albumConfigs: { [key: string]: AlbumConfig } = {
    'debut': {
      title: 'Taylor Swift',
      displayName: 'Taylor Swift',
      releaseDate: 'October 24th, 2006',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/debut-grid.webp',
      dbKey: 'taylorSwift'
    },
    'fearless': {
      title: "Fearless (Taylor's Version)",
      displayName: "Fearless (Taylor's Version)",
      releaseDate: 'April 9th, 2021',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/fearless-grid.webp',
      dbKey: 'fearless'
    },
    'speak-now': {
      title: "Speak Now (Taylor's Version)",
      displayName: "Speak Now (Taylor's Version)",
      releaseDate: 'July 7th, 2023',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/speak-now-grid.webp',
      dbKey: 'speakNow'
    },
    'red': {
      title: "Red (Taylor's Version)",
      displayName: "Red (Taylor's Version)",
      releaseDate: 'November 12th, 2021',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/red-grid.webp',
      dbKey: 'red'
    },
    'nineteen-eighty-nine': {
      title: "1989 (Taylor's Version)",
      displayName: '1989 (Taylor\'s Version)',
      releaseDate: 'October 27th, 2023',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/1989-grid.webp',
      dbKey: 'nineteenEightyNine'
    },
    'reputation': {
      title: 'reputation',
      displayName: 'reputation',
      releaseDate: 'November 10th, 2017',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/reputation-grid.webp',
      dbKey: 'reputation'
    },
    'lover': {
      title: 'Lover',
      displayName: 'Lover',
      releaseDate: 'August 23rd, 2019',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/lover-grid.webp',
      dbKey: 'lover'
    },
    'folklore': {
      title: 'folklore',
      displayName: 'folklore',
      releaseDate: 'July 24th, 2020',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/folklore-grid.webp',
      dbKey: 'folklore'
    },
    'evermore': {
      title: 'evermore',
      displayName: 'evermore',
      releaseDate: 'December 11th, 2020',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/evermore-grid.webp',
      dbKey: 'evermore'
    },
    'midnights': {
      title: 'Midnights',
      displayName: 'Midnights',
      releaseDate: 'October 21st, 2022',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/midnights-grid.webp',
      dbKey: 'midnights'
    },
    'tortured-poets-department': {
      title: 'The Tortured Poets Department',
      displayName: 'The Tortured Poets Department',
      releaseDate: 'April 19th, 2024',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/ttpd-grid.webp',
      dbKey: 'theTorturedPoetsDepartment'
    },
    //  'the-life-of-a-showgirl': {
    //   title: 'The Life of a Showgirl',
    //   displayName: 'The Life of a Showgirl',
    //   releaseDate: 'October 3rd, 2025',
    //   coverImage: 'https://d3e29z0m37b0un.cloudfront.net/life-of-a-showgirl.webp',
    //   backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/lifeofashowgirl-grid.webp',
    //   dbKey: 'theLifeOfAShowgirl'
    // },
    'singles': {
      title: 'Singles',
      displayName: 'Taylor\'s Singles & Features',
      releaseDate: '2006-Present',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/SinglesAndFeatures.svg',
      backgroundImage: 'https://d3e29z0m37b0un.cloudfront.net/photo-grids/singles.webp',
      dbKey: 'standaloneSingles'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rankingsService: RankingsService,
    private albumService: AlbumService
  ) {}

  ngOnInit() {
    // Get album ID from route parameter
    this.route.params.subscribe(params => {
      const albumId = params['albumId'];
      this.albumConfig = this.albumConfigs[albumId];
      
      if (this.albumConfig) {
        this.loadAlbumData();
        this.disableAudioRightClick();
      } else {
        // Handle invalid album ID
        this.router.navigate(['user/rankings']);
      }
    });
  }

  ngOnDestroy() {
    // Clean up audio event listeners
    document.removeEventListener('contextmenu', this.handleContextMenu);
  }

  private handleContextMenu = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName === 'AUDIO') {
      e.preventDefault();
    }
  };

  disableAudioRightClick() {
    document.addEventListener('contextmenu', this.handleContextMenu, false);
  }

  goBackToAlbumRankings() {
    this.router.navigate(['user/rankings']);
  }

  loadAlbumData() {
    if (!this.albumConfig) return;

    this.albumService.getAlbumByTitle(this.albumConfig.title).subscribe(
      (album: Album) => {
        this.songs = album.songs.map(song => ({
          ...song,
          album: album.title
        }));
        this.loadRankings();
      },
      error => {
        console.error('Error fetching album:', error);
      }
    );
  }

  loadRankings() {
    if (!this.albumConfig) return;

    this.rankingsService.getUserRankings().subscribe(
      (rankings: Rankings) => {
        const albumRankings = rankings?.albumRankings?.[this.albumConfig!.dbKey as keyof typeof rankings.albumRankings];
        if (albumRankings && Array.isArray(albumRankings)) {
          this.rankings = albumRankings.sort((a, b) => a.rank - b.rank);
        } else {
          this.rankings = [];
        }
        this.applyRankingsToSongs();
      },
      error => {
        console.error('Error fetching rankings:', error);
        this.rankings = [];
        this.applyRankingsToSongs();
      }
    );
  }

  applyRankingsToSongs() {
    if (this.songs.length > 0) {
      if (this.rankings.length > 0) {
        const rankMap = new Map(this.rankings.map(r => [r.songId, r.rank]));
        
        this.songs.sort((a, b) => {
          const rankA = rankMap.get(a._id!) ?? Infinity;
          const rankB = rankMap.get(b._id!) ?? Infinity;
          return (rankA as number) - (rankB as number);
        });
      }
    }
  }

  onDrop(event: CdkDragDrop<Song[]>) {
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
    this.updateRankings();
  }

  updateRankings() {
    if (!this.albumConfig) return;

    const newRankings = this.songs.map((song, index) => ({
      slot: index + 1,
      albumName: song.album,
      songId: song._id!,
      songTitle: song.title,
      albumCover: song.albumImageSource,
      rank: index + 1
    }));

    this.rankingsService.updateRanking(this.albumConfig.dbKey, newRankings).subscribe(
      response => console.log('Rankings updated'),
      error => console.error('Error updating rankings:', error)
    );
  }

  handleAudioPlay(event: Event) {
    // Stop all other audio players when one starts playing
    const target = event.target as HTMLAudioElement;
    this.audioPlayers.forEach(player => {
      if (player.nativeElement !== target) {
        player.nativeElement.pause();
      }
    });
  }

  handleAudioError(event: any) {
    console.error('Audio failed to load:', event);
  }
}