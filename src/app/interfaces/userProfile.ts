// src/app/interfaces/userProfile.ts
import { AlbumRanking } from './AlbumRanking';
import { TrackRankingItem } from './TrackRankingItem';

export interface UserProfileSong {
  slot: number;
  albumName: string;
  songTitle: string;
  albumImage?: string;
  audioSource?: string;
  songId: string;
  albumCover?: string; 
  rank?: number; 
}

export interface AlbumSongRanking {
  slot: number;
  albumName: string;
  songId: string;
  songTitle: string;
  albumCover: string;
  rank: number;
}

export interface TrackRankingSummary {
  songId: string;
  songTitle: string;
  albumName: string;
  audioSource: string;
  rank: number;
  albumImageSource: string;
}

export interface UserProfile {
  username: string;
  theme: string;
  profileImage: string;
  country?: string | null;  
  loginCount?: number;      
  rankings: {
    topThirteen: UserProfileSong[];
    albumRankings?: {
      taylorSwift?: AlbumSongRanking[];
      fearless?: AlbumSongRanking[];
      speakNow?: AlbumSongRanking[];
      red?: AlbumSongRanking[];
      nineteenEightyNine?: AlbumSongRanking[];
      reputation?: AlbumSongRanking[];
      lover?: AlbumSongRanking[];
      folklore?: AlbumSongRanking[];
      evermore?: AlbumSongRanking[];
      midnights?: AlbumSongRanking[];
      theTorturedPoetsDepartment?: AlbumSongRanking[];
      // theLifeOfAShowgirl?: AlbumSongRanking[];
      standaloneSingles?: AlbumSongRanking[];
      allAlbums?: AlbumRanking[];
    };
    trackRankings?: TrackRankingItem[][];
    allSongsRanking?: TrackRankingItem[];
  };
  profileQuestions: {
    question: string;
    answer: string;
  }[];
}