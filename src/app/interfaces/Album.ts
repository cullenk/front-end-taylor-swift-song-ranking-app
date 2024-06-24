import { Song } from './Song'

export interface Album {
    _id?: string;  // MongoDB ObjectId
    title: string;
    releaseYear: number;
    songs: Song[];
    albumImage: string;
  }