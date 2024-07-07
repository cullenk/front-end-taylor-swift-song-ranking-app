import { Song } from "./Song";

export interface SongWithAlbum extends Song {
    album: string;
  }

  export interface EraSetList {
    order: number;
    era: string;
    songs: (SongWithAlbum | null)[];
  }