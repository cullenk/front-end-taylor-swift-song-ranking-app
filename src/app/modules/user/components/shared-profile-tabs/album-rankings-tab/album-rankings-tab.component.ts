import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumRanking } from '../../../../../interfaces/AlbumRanking';
import {
  UserProfile,
  AlbumSongRanking,
  TrackRankingSummary,
} from '../../../../../interfaces/userProfile';
import { RankingsService } from '../../../../../services/rankings.service';
import { RouterModule } from '@angular/router';

interface AlbumInfo {
  id: string;
  name: string;
  coverImage: string;
  dbKey: string;
}

@Component({
  selector: 'app-album-rankings-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './album-rankings-tab.component.html',
  styleUrl: './album-rankings-tab.component.scss',
})
export class AlbumRankingsTabComponent implements OnInit {
  @Input() topFiveAlbums: AlbumRanking[] = [];
  @Input() userProfile!: UserProfile;
  @Input() isEditable: boolean = false;
  @Input() isOwner: boolean = false;

  selectedView: 'allAlbums' | string = 'allAlbums';
  selectedAlbumRankings: AlbumSongRanking[] = [];
  selectedTrackRankings: TrackRankingSummary[] = [];
  allAlbumRankings: AlbumRanking[] = [];
  isLoading = false;
  isLoadingAllAlbums = false;

  allSongsPagination = {
    currentPage: 1,
    totalSongs: 0,
    hasMore: false,
    isLoadingMore: false,
  };

  albums: AlbumInfo[] = [
    {
      id: 'allAlbums',
      name: 'All Albums',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/All-Albums.webp',
      dbKey: 'allAlbums',
    },
    {
      id: 'debut',
      name: 'Taylor Swift',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      dbKey: 'taylorSwift',
    },
    {
      id: 'fearless',
      name: 'Fearless (TV)',
      coverImage:
        'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      dbKey: 'fearless',
    },
    {
      id: 'speakNow',
      name: 'Speak Now (TV)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      dbKey: 'speakNow',
    },
    {
      id: 'red',
      name: 'Red (TV)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      dbKey: 'red',
    },
    {
      id: '1989',
      name: '1989 (TV)',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      dbKey: 'nineteenEightyNine',
    },
    {
      id: 'reputation',
      name: 'reputation',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
      dbKey: 'reputation',
    },
    {
      id: 'lover',
      name: 'Lover',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      dbKey: 'lover',
    },
    {
      id: 'folklore',
      name: 'folklore',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      dbKey: 'folklore',
    },
    {
      id: 'evermore',
      name: 'evermore',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      dbKey: 'evermore',
    },
    {
      id: 'midnights',
      name: 'Midnights',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
      dbKey: 'midnights',
    },
    {
      id: 'ttpd',
      name: 'TTPD',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      dbKey: 'theTorturedPoetsDepartment',
    },
    {
      id: 'singles',
      name: 'Singles',
      coverImage:
        'https://d3e29z0m37b0un.cloudfront.net/SinglesAndFeatures.svg',
      dbKey: 'standaloneSingles',
    },
    {
      id: 'byTrackNumber',
      name: 'Perfect Album',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/byTrackNumber.svg',
      dbKey: 'trackRankings',
    },
    {
      id: 'allSongs',
      name: 'All Songs Ranking',
      coverImage: 'https://d3e29z0m37b0un.cloudfront.net/AllSongs.svg',
      dbKey: 'allSongsRanking',
    },
  ];

  constructor(private rankingsService: RankingsService) {}

  ngOnInit() {
    this.loadAllAlbumRankings();
    this.selectAlbum('allAlbums');
  }

  selectAlbum(albumId: string) {
    this.selectedView = albumId;
    this.selectedAlbumRankings = [];
    this.selectedTrackRankings = [];

    // Reset pagination when switching albums
    this.allSongsPagination = {
      currentPage: 1,
      totalSongs: 0,
      hasMore: false,
      isLoadingMore: false,
    };

    if (albumId === 'allAlbums') {
      return;
    }

    if (albumId === 'byTrackNumber') {
      this.loadPerfectAlbum();
      return;
    }

    if (albumId === 'allSongs') {
      this.loadAllSongsSummary(1, false); // Start fresh
      return;
    }

    // Handle regular album rankings
    const albumInfo = this.albums.find((album) => album.id === albumId);
    if (!albumInfo) return;

    const dbKey = albumInfo.dbKey as keyof NonNullable<
      UserProfile['rankings']['albumRankings']
    >;
    if (this.userProfile?.rankings?.albumRankings?.[dbKey]) {
      const rawRankings = this.userProfile.rankings.albumRankings[
        dbKey
      ] as any[];
      this.selectedAlbumRankings = this.convertToAlbumSongRankings(rawRankings);
      return;
    }

    this.loadAlbumRankings(albumInfo.dbKey);
  }

  get shouldShowLoadMore(): boolean {
    return (
      this.selectedView === 'allSongs' &&
      this.allSongsPagination.hasMore &&
      !this.isLoading
    );
  }

  get paginationInfo(): string {
    if (
      this.selectedView !== 'allSongs' ||
      this.allSongsPagination.totalSongs === 0
    ) {
      return '';
    }

    const showing = this.selectedTrackRankings.length;
    const total = this.allSongsPagination.totalSongs;
    return `Showing ${showing} of ${total} songs`;
  }

  // Helper method to convert any ranking data to AlbumSongRanking[]
  private convertToAlbumSongRankings(rawRankings: any[]): AlbumSongRanking[] {
    if (!Array.isArray(rawRankings)) return [];

    return rawRankings
      .filter((ranking: any) => ranking && ranking.songTitle)
      .map(
        (ranking: any) =>
          ({
            slot: Number(ranking.slot || ranking.rank || 0),
            albumName: String(ranking.albumName || ''),
            songId: String(ranking.songId || ''),
            songTitle: String(ranking.songTitle || ''),
            albumCover: String(ranking.albumCover || ''),
            rank: Number(ranking.rank || ranking.slot || 0),
          } as AlbumSongRanking)
      )
      .sort((a, b) => a.rank - b.rank);
  }

  // Load perfect album (first song from each track position)
    loadPerfectAlbum() {
    this.isLoading = true;
    
    if (this.isOwner) {
      // Use authenticated endpoint
      this.rankingsService.getPerfectAlbum().subscribe(
        (perfectAlbum: TrackRankingSummary[]) => {
          this.selectedTrackRankings = perfectAlbum;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading perfect album:', error);
          this.selectedTrackRankings = [];
          this.isLoading = false;
        }
      );
    } else {
      // Use public endpoint
      if (this.userProfile?.username) {
        this.rankingsService.getPublicPerfectAlbum(this.userProfile.username).subscribe(
          (perfectAlbum: TrackRankingSummary[]) => {
            this.selectedTrackRankings = perfectAlbum;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error loading public perfect album:', error);
            this.selectedTrackRankings = [];
            this.isLoading = false;
          }
        );
      }
    }
  }

  // Load top songs summary
  loadAllSongsSummary(page: number = 1, append: boolean = false) {
    if (page === 1) {
      this.isLoading = true;
      this.selectedTrackRankings = [];
    } else {
      this.allSongsPagination.isLoadingMore = true;
    }

    // Determine username for public profiles
    const username = this.isOwner ? undefined : this.userProfile?.username;

    this.rankingsService.getAllSongsSummary(page, 20, username).subscribe(
      (response) => {
        if (append && page > 1) {
          // Append new songs to existing list
          this.selectedTrackRankings = [
            ...this.selectedTrackRankings,
            ...response.songs,
          ];
        } else {
          // Replace with new songs (first load)
          this.selectedTrackRankings = response.songs;
        }

        // Update pagination metadata
        this.allSongsPagination = {
          currentPage: response.currentPage,
          totalSongs: response.totalSongs,
          hasMore: response.hasMore,
          isLoadingMore: false,
        };

        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading all songs summary:', error);
        this.selectedTrackRankings = append ? this.selectedTrackRankings : [];
        this.allSongsPagination.isLoadingMore = false;
        this.isLoading = false;
      }
    );
  }

  loadAlbumRankings(albumKey: string) {
    this.isLoading = true;
    
    if (this.isOwner) {
      // Use authenticated endpoint for user's own profile
      this.rankingsService.getUserRankings().subscribe(
        (rankings: any) => {
          if (rankings?.albumRankings?.[albumKey]) {
            const albumRankings = rankings.albumRankings[albumKey];
            this.selectedAlbumRankings = this.convertToAlbumSongRankings(albumRankings);
          } else {
            this.selectedAlbumRankings = [];
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading album rankings:', error);
          this.selectedAlbumRankings = [];
          this.isLoading = false;
        }
      );
    } else {
      // Use public endpoint for public profiles
      if (this.userProfile?.username) {
        this.rankingsService.getPublicUserRankings(this.userProfile.username).subscribe(
          (rankings: any) => {
            if (rankings?.albumRankings?.[albumKey]) {
              const albumRankings = rankings.albumRankings[albumKey];
              this.selectedAlbumRankings = this.convertToAlbumSongRankings(albumRankings);
            } else {
              this.selectedAlbumRankings = [];
            }
            this.isLoading = false;
          },
          (error) => {
            console.error('Error loading public album rankings:', error);
            this.selectedAlbumRankings = [];
            this.isLoading = false;
          }
        );
      }
    }
  }

  loadMoreSongs() {
    if (
      this.allSongsPagination.hasMore &&
      !this.allSongsPagination.isLoadingMore
    ) {
      const nextPage = this.allSongsPagination.currentPage + 1;
      this.loadAllSongsSummary(nextPage, true);
    }
  }

loadAllAlbumRankings() {
  // console.log(`🔍 [FRONTEND] Loading all album rankings. isOwner: ${this.isOwner}, username: ${this.userProfile?.username}`);
  this.isLoadingAllAlbums = true;
  
  // Use different endpoints based on whether this is a public profile
  if (this.isOwner) {
    // For user's own profile, use authenticated endpoint
    this.rankingsService.getUserRankings().subscribe(
      (rankings: any) => {
        // console.log(`✅ [FRONTEND-OWNER] Received rankings:`, rankings);
        if (rankings?.albumRankings?.allAlbums) {
          // console.log(`📋 [FRONTEND-OWNER] Processing allAlbums:`, rankings.albumRankings.allAlbums);
          this.allAlbumRankings = rankings.albumRankings.allAlbums.sort(
            (a: AlbumRanking, b: AlbumRanking) => a.rank - b.rank
          );
        } else {
          // console.log(`❌ [FRONTEND-OWNER] No allAlbums found in rankings`);
          this.allAlbumRankings = [];
        }
        // console.log(`🏆 [FRONTEND-OWNER] Final allAlbumRankings:`, this.allAlbumRankings);
        this.isLoadingAllAlbums = false;
      },
      (error) => {
        console.error(`💥 [FRONTEND-OWNER] Error loading all album rankings:`, error);
        this.allAlbumRankings = [];
        this.isLoadingAllAlbums = false;
      }
    );
  } else {
    // For public profiles, use the public endpoint
    if (this.userProfile?.username) {
      // console.log(`🔍 [FRONTEND-PUBLIC] Fetching public rankings for: ${this.userProfile.username}`);
      this.rankingsService.getPublicUserRankings(this.userProfile.username).subscribe(
        (rankings: any) => {
          // console.log(`✅ [FRONTEND-PUBLIC] Received public rankings for ${this.userProfile?.username}:`, rankings);
          if (rankings?.albumRankings?.allAlbums) {
            // console.log(`📋 [FRONTEND-PUBLIC] Processing allAlbums:`, rankings.albumRankings.allAlbums);
            this.allAlbumRankings = rankings.albumRankings.allAlbums.sort(
              (a: AlbumRanking, b: AlbumRanking) => a.rank - b.rank
            );
          } else {
            // console.log(`❌ [FRONTEND-PUBLIC] No allAlbums found in public rankings`);
            this.allAlbumRankings = [];
          }
          // console.log(`🏆 [FRONTEND-PUBLIC] Final allAlbumRankings:`, this.allAlbumRankings);
          this.isLoadingAllAlbums = false;
        },
        (error) => {
          console.error(`💥 [FRONTEND-PUBLIC] Error loading public album rankings for ${this.userProfile?.username}:`, error);
          this.allAlbumRankings = [];
          this.isLoadingAllAlbums = false;
        }
      );
    }
  }
}

  getSelectedAlbumInfo() {
    return this.albums.find((album) => album.id === this.selectedView);
  }

hasRankings(albumId: string): boolean {
  
  if (albumId === 'allAlbums') {
    const result = this.allAlbumRankings && this.allAlbumRankings.length > 0;
    // console.log(`📊 [FRONTEND] allAlbums hasRankings result: ${result}, count: ${this.allAlbumRankings?.length || 0}`);
    return result;
  }

  if (albumId === 'byTrackNumber') {
    // Check if trackRankings exists and has content
    const trackRankings = this.userProfile?.rankings?.trackRankings;
    // console.log(`🎵 [FRONTEND] Checking trackRankings:`, {
    //   hasTrackRankings: !!trackRankings,
    //   isArray: Array.isArray(trackRankings),
    //   length: trackRankings?.length || 0
    // });
    
    if (!trackRankings || !Array.isArray(trackRankings)) {
      console.log(`❌ [FRONTEND] byTrackNumber: No trackRankings or not array`);
      return false;
    }
    
    // Check if any track position has ranked songs
    const result = trackRankings.some(
      (trackList) => Array.isArray(trackList) && trackList.length > 0
    );
    // console.log(`📊 [FRONTEND] byTrackNumber hasRankings result: ${result}`);
    return result;
  }

  if (albumId === 'allSongs') {
    // Check if allSongsRanking exists and has content
    const allSongsRanking = this.userProfile?.rankings?.allSongsRanking;
    // console.log(`🎶 [FRONTEND] Checking allSongsRanking:`, {
    //   hasAllSongs: !!allSongsRanking,
    //   isArray: Array.isArray(allSongsRanking),
    //   length: allSongsRanking?.length || 0
    // });
    
    if (
      !allSongsRanking ||
      !Array.isArray(allSongsRanking) ||
      allSongsRanking.length === 0
    ) {
      // console.log(`❌ [FRONTEND] allSongs: No allSongsRanking or empty`);
      return false;
    }

    // Simply check if there are valid songs in the ranking
    const result = (
      allSongsRanking.length > 0 &&
      allSongsRanking.some(
        (song) =>
          song &&
          song.songTitle &&
          song.songTitle.trim() !== '' &&
          typeof song.rank === 'number'
      )
    );
    // console.log(`📊 [FRONTEND] allSongs hasRankings result: ${result}`);
    return result;
  }

  const albumInfo = this.albums.find((album) => album.id === albumId);
  if (!albumInfo) {
    console.log(`❌ [FRONTEND] Album info not found for: ${albumId}`);
    return false;
  }

  const dbKey = albumInfo.dbKey as keyof NonNullable<
    UserProfile['rankings']['albumRankings']
  >;
  const rankings = this.userProfile?.rankings?.albumRankings?.[dbKey];
  const result = Boolean(rankings && Array.isArray(rankings) && rankings.length > 0);
  
  return result;
}

  get isTrackRankingsView(): boolean {
    return (
      this.selectedView === 'byTrackNumber' || this.selectedView === 'allSongs'
    );
  }

  navigateToRanking(albumId: string): string {
    const routes: { [key: string]: string } = {
      debut: '/user/rankings/debut',
      fearless: '/user/rankings/fearless',
      speakNow: '/user/rankings/speak-now',
      red: '/user/rankings/red',
      '1989': '/user/rankings/nineteen-eighty-nine',
      reputation: '/user/rankings/reputation',
      lover: '/user/rankings/lover',
      folklore: '/user/rankings/folklore',
      evermore: '/user/rankings/evermore',
      midnights: '/user/rankings/midnights',
      ttpd: '/user/rankings/tortured-poets-department',
      singles: '/user/rankings/singles',
      allAlbums: '/user/rankings/allAlbums',
      byTrackNumber: '/user/rankings/byTrackNumber',
      allSongs: '/user/rankings/allSongs',
    };

    return routes[albumId] || '/user/rankings';
  }
}
