import { Album } from './Album'
import { Song } from './Song';

export interface SearchResult {
  _id: string;  // Assuming each song has an _id
  title: string;
  // duration: string;
  audioSource: string;
  }