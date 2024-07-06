import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Song {
  title: string;
  albumName: string;
  albumCover: string;
  overlay: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  allSongs: Song[] = [
    {
      title: "Red",
      albumName: "Red (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg",
      overlay: "linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))"
    },
    {
      title: "Teardrops On My Guitar",
      albumName: "Taylor Swift",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg",
      overlay: "linear-gradient(to right, rgba(0, 177, 210, 0.7), rgba(0, 177, 210, 0.3))"
    },
    {
      title: "Fifteen",
      albumName: "Fearless (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg",
      overlay: "linear-gradient(to right, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))"
    },
    {
      title: "Cruel Summer",
      albumName: "Lover",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg",
      overlay: "linear-gradient(to right, rgba(255, 153, 204, 0.7), rgba(255, 153, 204, 0.3))"
    },
    {
      title: "ivy",
      albumName: "evermore",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg",
      overlay: "linear-gradient(to right, rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.3))"
    },
    {
      title: "Love Story",
      albumName: "Fearless (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg",
      overlay: "linear-gradient(to right, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))"
    },
    {
      title: "Enchanted",
      albumName: "Speak Now (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg",
      overlay: "linear-gradient(to right, rgba(153, 0, 153, 0.7), rgba(153, 0, 153, 0.3))"
    },
    {
      title: "Blank Space",
      albumName: "1989 (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg",
      overlay: "linear-gradient(to right, rgba(0, 204, 204, 0.7), rgba(0, 204, 204, 0.3))"
    },
    {
      title: "Cornelia Street",
      albumName: "Lover",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg",
      overlay: "linear-gradient(to right, rgba(255, 153, 204, 0.7), rgba(255, 153, 204, 0.3))"
    },
    {
      title: "tolerate it",
      albumName: "evermore",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg",
      overlay: "linear-gradient(to right, rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.3))"
    },
    {
      title: "Should've Said No",
      albumName: "Taylor Swift",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg",
      overlay: "linear-gradient(to right, rgba(0, 177, 210, 0.7), rgba(0, 177, 210, 0.3))"
    },
    {
      title: "Getaway Car",
      albumName: "Reputation",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/reputation.jpg",
      overlay: "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))"
    },
    {
      title: "Delicate",
      albumName: "Reputation",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/reputation.jpg",
      overlay: "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))"
    },
    {
      title: "Tell Me Why",
      albumName: "Fearless (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg",
      overlay: "linear-gradient(to right, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))"
    },
    {
      title: "Clean",
      albumName: "1989 (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg",
      overlay: "linear-gradient(to right, rgba(0, 204, 204, 0.7), rgba(0, 204, 204, 0.3))"
    },
    {
      title: "All Too Well",
      albumName: "Red (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg",
      overlay: "linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))"
    },
    {
      title: "Picture To Burn",
      albumName: "Taylor Swift",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg",
      overlay: "linear-gradient(to right, rgba(0, 177, 210, 0.7), rgba(0, 177, 210, 0.3))"
    },
    {
      title: "You Are In Love",
      albumName: "1989 (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg",
      overlay: "linear-gradient(to right, rgba(0, 204, 204, 0.7), rgba(0, 204, 204, 0.3))"
    },
    {
      title: "Down Bad",
      albumName: "The Tortured Poets Department",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg",
      overlay: "linear-gradient(to right, rgba(245, 245, 220, 0.7), rgba(245, 245, 220, 0.3))"
    },
    {
      title: "Maroon",
      albumName: "Midnights",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/midnights.jpeg",
      overlay: "linear-gradient(to right, rgba(25, 25, 112, 0.7), rgba(25, 25, 112, 0.3))"
    },
    {
      title: "Dear John",
      albumName: "Speak Now (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg",
      overlay: "linear-gradient(to right, rgba(153, 0, 153, 0.7), rgba(153, 0, 153, 0.3))"
    },
    {
      title: "this is me trying",
      albumName: "folklore",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg",
      overlay: "linear-gradient(to right, rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.3))"
    },
    {
      title: "Treacherous",
      albumName: "Red (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg",
      overlay: "linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))"
    },
    {
      title: "Sparks Fly",
      albumName: "Speak Now (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg",
      overlay: "linear-gradient(to right, rgba(153, 0, 153, 0.7), rgba(153, 0, 153, 0.3))"
    },
    {
      title: "The Archer",
      albumName: "Lover",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg",
      overlay: "linear-gradient(to right, rgba(255, 153, 204, 0.7), rgba(255, 153, 204, 0.3))"
    },
    {
      title: "Better Man",
      albumName: "Red (Taylor's Version)",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg",
      overlay: "linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))"
    },
    {
      title: "peace",
      albumName: "folklore",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg",
      overlay: "linear-gradient(to right, rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.3))"
    },
    {
      title: "cardigan",
      albumName: "folklore",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg",
      overlay: "linear-gradient(to right, rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.3))"
    },
    {
      title: "champagne problems",
      albumName: "evermore",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg",
      overlay: "linear-gradient(to right, rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.3))"
    },
    {
      title: "Labyrinth",
      albumName: "Midnights",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/midnights.jpeg",
      overlay: "linear-gradient(to right, rgba(25, 25, 112, 0.7), rgba(25, 25, 112, 0.3))"
    },
    {
      title: "Mastermind",
      albumName: "Midnights",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/midnights.jpeg",
      overlay: "linear-gradient(to right, rgba(25, 25, 112, 0.7), rgba(25, 25, 112, 0.3))"
    },
    {
      title: "The Black Dog",
      albumName: "The Tortured Poets Department",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg",
      overlay: "linear-gradient(to right, rgba(245, 245, 220, 0.7), rgba(245, 245, 220, 0.3))"
    },
    {
      title: "Peter",
      albumName: "The Tortured Poets Department",
      albumCover: "https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg",
      overlay: "linear-gradient(to right, rgba(245, 245, 220, 0.7), rgba(245, 245, 220, 0.3))"
    },
  ];

  displayedSongs: Song[] = [];
  private intervalId: any;

  ngOnInit() {
    this.initializeSongs();
    this.startRotation();
  }

  ngOnDestroy() {
    this.stopRotation();
  }

  private initializeSongs() {
    this.displayedSongs = this.getRandomSongs(5);
  }

  private startRotation() {
    this.intervalId = setInterval(() => {
      this.rotateSongs();
    }, 3000); // Change songs every 3 seconds
  }

  private stopRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private rotateSongs() {
    const newSong = this.getRandomSongs(1, this.displayedSongs)[0];
    const removeIndex = Math.floor(Math.random() * this.displayedSongs.length);
    this.displayedSongs.splice(removeIndex, 1, newSong);
  }

  private getRandomSongs(count: number, exclude: any[] = []): any[] {
    const availableSongs = this.allSongs.filter(song => !exclude.includes(song));
    const randomSongs = [];
    while (randomSongs.length < count && availableSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      randomSongs.push(availableSongs.splice(randomIndex, 1)[0]);
    }
    return randomSongs;
  }
}
