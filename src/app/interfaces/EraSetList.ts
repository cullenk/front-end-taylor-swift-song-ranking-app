
export interface EraSetListSong {
  _id: string;
  title: string;
  audioSource: string;
  isMashup?: boolean; 
}

export interface EraSetList {
  era: string;
  songs: EraSetListSong[];
  order: number;
}