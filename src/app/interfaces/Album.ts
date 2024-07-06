import { Song } from './Song';

export interface Album {
  _id: string;
  title: string;
  albumImage: string;
  songs: Song[];
}