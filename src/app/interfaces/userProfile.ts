export interface UserProfileSong {
    slot: number;
    albumId: string;
    songTitle: string;
    albumImage?: string;
    audioSource?: string;
  }
  
  export interface UserProfile {
    username: string;
    theme: string;
    rankings: {
      topThirteen: UserProfileSong[];
    };
    profileQuestions: Array<{ question: string; answer: string }>;
  }