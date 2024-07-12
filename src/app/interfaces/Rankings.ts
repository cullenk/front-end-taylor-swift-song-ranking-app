export interface Ranking {
  slot: number,
  albumName: String;
  songId: String;
  songTitle: String;
  albumCover: String,
  rank: number;
}

export interface Rankings {
  topThirteen: Ranking[];
  albumRankings: {
    [key: string]: Ranking[];
  };
}
