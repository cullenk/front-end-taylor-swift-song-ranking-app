import { Album } from './Album'
import { Song } from './Song';

export interface SearchResult {
    album: Album;
    song: Song;
  }