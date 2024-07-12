
export interface EraSetListSong {
  _id: string;
  title: string;
  audioSource: string;
}

export interface EraSetList {
  era: string;
  songs: EraSetListSong[];
  order: number;
}