import { Song } from "./Song"

export interface Album {
  _id: string;
  title: string;
  releaseYear: number;
  albumCover: string;
  songs: Song[];
}