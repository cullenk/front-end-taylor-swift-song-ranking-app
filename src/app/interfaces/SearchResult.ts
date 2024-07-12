export interface SearchResult {
  _id: string;
  title: string;
  audioSource: string;
  albumImageSource: string;
  album: string; // This can be the album ID or name, depending on your backend structure
}