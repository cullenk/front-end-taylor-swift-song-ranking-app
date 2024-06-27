export interface Ranking {
  songId: string;
  rank: number;
  songTitle?: string;
  albumId?: string;
}

export interface Rankings {
  topThirteen: Ranking[];
  albumRankings: {
    [key: string]: Ranking[];
  };
}
