// user-profile.interface.ts
export interface UserProfileSong {
  slot: number;
  albumName: string;
  songTitle: string;
  albumImage?: string;
  audioSource?: string;
  songId: string;
  albumCover?: string; 
  rank?: number; 
}
export interface UserProfile {
  username: string;
  theme: string;
  profileImage: string;
  rankings: {
    topThirteen: UserProfileSong[];
  };
  profileQuestions: {
    question: string;
    answer: string;
  }[];
}