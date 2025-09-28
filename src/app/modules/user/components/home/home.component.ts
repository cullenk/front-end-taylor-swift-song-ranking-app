import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopUsersComponent } from '../top-users/top-users.component';
import { UserFavoriteSongsComponent } from '../user-favorite-songs/user-favorite-songs.component';
import { PopularErasTourSongsComponent } from '../popular-eras-tour-songs/popular-eras-tour-songs.component';
import { AlbumPopularityComponent } from '../album-popularity/album-popularity.component';
import { SurpriseSongsSliderComponent } from '../surprise-songs-slider/surprise-songs-slider.component';
import { Meta, Title } from '@angular/platform-browser';

interface Song {
  title: string;
  albumName: string;
  albumCover: string;
  overlay: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TopUsersComponent,
    UserFavoriteSongsComponent,
    PopularErasTourSongsComponent,
    AlbumPopularityComponent,
    SurpriseSongsSliderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  allSongs: Song[] = [
    {
      title: 'Red',
      albumName: "Red (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))',
    },
    {
      title: 'Teardrops On My Guitar',
      albumName: 'Taylor Swift',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 177, 210, 0.7), rgba(0, 177, 210, 0.3))',
    },
    {
      title: 'Fifteen',
      albumName: "Fearless (Taylor's Version)",
      albumCover:
        'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      overlay:
        'linear-gradient(to right, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))',
    },
    {
      title: 'Cruel Summer',
      albumName: 'Lover',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      overlay:
        'linear-gradient(to right, rgba(255, 153, 204, 0.7), rgba(255, 153, 204, 0.3))',
    },
    {
      title: 'ivy',
      albumName: 'evermore',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      overlay:
        'linear-gradient(to right, rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.3))',
    },
    {
      title: 'Love Story',
      albumName: "Fearless (Taylor's Version)",
      albumCover:
        'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      overlay:
        'linear-gradient(to right, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))',
    },
    {
      title: 'Enchanted',
      albumName: "Speak Now (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(153, 0, 153, 0.7), rgba(153, 0, 153, 0.3))',
    },
    {
      title: 'Blank Space',
      albumName: "1989 (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 204, 204, 0.7), rgba(0, 204, 204, 0.3))',
    },
    {
      title: 'Cornelia Street',
      albumName: 'Lover',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      overlay:
        'linear-gradient(to right, rgba(255, 153, 204, 0.7), rgba(255, 153, 204, 0.3))',
    },
    {
      title: 'tolerate it',
      albumName: 'evermore',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      overlay:
        'linear-gradient(to right, rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.3))',
    },
    {
      title: "Should've Said No",
      albumName: 'Taylor Swift',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 177, 210, 0.7), rgba(0, 177, 210, 0.3))',
    },
    {
      title: 'Getaway Car',
      albumName: 'Reputation',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
    },
    {
      title: 'Delicate',
      albumName: 'Reputation',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
    },
    {
      title: 'Tell Me Why',
      albumName: "Fearless (Taylor's Version)",
      albumCover:
        'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
      overlay:
        'linear-gradient(to right, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))',
    },
    {
      title: 'Clean',
      albumName: "1989 (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 204, 204, 0.7), rgba(0, 204, 204, 0.3))',
    },
    {
      title: 'All Too Well',
      albumName: "Red (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))',
    },
    {
      title: 'Picture To Burn',
      albumName: 'Taylor Swift',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 177, 210, 0.7), rgba(0, 177, 210, 0.3))',
    },
    {
      title: 'You Are In Love',
      albumName: "1989 (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
      overlay:
        'linear-gradient(to right, rgba(0, 204, 204, 0.7), rgba(0, 204, 204, 0.3))',
    },
    {
      title: 'Down Bad',
      albumName: 'The Tortured Poets Department',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      overlay:
        'linear-gradient(to right, rgba(245, 245, 220, 0.7), rgba(245, 245, 220, 0.3))',
    },
    {
      title: 'Maroon',
      albumName: 'Midnights',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
      overlay:
        'linear-gradient(to right, rgba(25, 25, 112, 0.7), rgba(25, 25, 112, 0.3))',
    },
    {
      title: 'Dear John',
      albumName: "Speak Now (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(153, 0, 153, 0.7), rgba(153, 0, 153, 0.3))',
    },
    {
      title: 'this is me trying',
      albumName: 'folklore',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      overlay:
        'linear-gradient(to right, rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.3))',
    },
    {
      title: 'Treacherous',
      albumName: "Red (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))',
    },
    {
      title: 'Sparks Fly',
      albumName: "Speak Now (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(153, 0, 153, 0.7), rgba(153, 0, 153, 0.3))',
    },
    {
      title: 'The Archer',
      albumName: 'Lover',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
      overlay:
        'linear-gradient(to right, rgba(255, 153, 204, 0.7), rgba(255, 153, 204, 0.3))',
    },
    {
      title: 'Better Man',
      albumName: "Red (Taylor's Version)",
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
      overlay:
        'linear-gradient(to right, rgba(179, 0, 0, 0.7), rgba(179, 0, 0, 0.3))',
    },
    {
      title: 'peace',
      albumName: 'folklore',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      overlay:
        'linear-gradient(to right, rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.3))',
    },
    {
      title: 'cardigan',
      albumName: 'folklore',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
      overlay:
        'linear-gradient(to right, rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.3))',
    },
    {
      title: 'champagne problems',
      albumName: 'evermore',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
      overlay:
        'linear-gradient(to right, rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.3))',
    },
    {
      title: 'Labyrinth',
      albumName: 'Midnights',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
      overlay:
        'linear-gradient(to right, rgba(25, 25, 112, 0.7), rgba(25, 25, 112, 0.3))',
    },
    {
      title: 'Mastermind',
      albumName: 'Midnights',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
      overlay:
        'linear-gradient(to right, rgba(25, 25, 112, 0.7), rgba(25, 25, 112, 0.3))',
    },
    {
      title: 'The Black Dog',
      albumName: 'The Tortured Poets Department',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      overlay:
        'linear-gradient(to right, rgba(245, 245, 220, 0.7), rgba(245, 245, 220, 0.3))',
    },
    {
      title: 'Peter',
      albumName: 'The Tortured Poets Department',
      albumCover: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
      overlay:
        'linear-gradient(to right, rgba(245, 245, 220, 0.7), rgba(245, 245, 220, 0.3))',
    },
  ];

  displayedSongs: Song[] = [];
  private songRotationInterval: any;

  timeRemaining: TimeRemaining = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  private countdownInterval: any;
  private releaseDate = new Date('2025-10-03T00:00:00');

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.initializeSongs();
    this.startSongRotation();
    this.updateMetaTags();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopSongRotation();
    this.stopCountdown();
  }

  private updateMetaTags(): void {
    const pageTitle = 'Home - Swiftie Ranking Hub';
    const description = 'Rank your favorite Taylor Swift songs, build your own Eras Tour and share your profile with friends!';
    const imageUrl = 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp';
    const pageUrl = 'https://swiftierankinghub.com/user/userHome';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: 'Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  /**
   * Initializes the song display with random songs
   */
  private initializeSongs(): void {
    this.displayedSongs = this.getRandomSongs(5);
  }

  /**
   * Starts the song rotation animation
   */
  private startSongRotation(): void {
    this.songRotationInterval = setInterval(() => {
      this.rotateSongs();
    }, 3000);
  }

  /**
   * Stops the song rotation animation
   */
  private stopSongRotation(): void {
    if (this.songRotationInterval) {
      clearInterval(this.songRotationInterval);
      this.songRotationInterval = null;
    }
  }

  /**
   * Rotates songs by replacing a random song with a new one
   */
  private rotateSongs(): void {
    const newSong = this.getRandomSongs(1, this.displayedSongs)[0];
    if (newSong) {
      const removeIndex = Math.floor(Math.random() * this.displayedSongs.length);
      this.displayedSongs.splice(removeIndex, 1, newSong);
    }
  }

  /**
   * Gets random songs from the collection
   */
  private getRandomSongs(count: number, exclude: Song[] = []): Song[] {
    const availableSongs = this.allSongs.filter(song => !exclude.includes(song));
    const randomSongs: Song[] = [];
    
    while (randomSongs.length < count && availableSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      randomSongs.push(availableSongs.splice(randomIndex, 1)[0]);
    }
    
    return randomSongs;
  }

  /**
   * Starts the countdown timer
   */
  private startCountdown(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  /**
   * Stops the countdown timer
   */
  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  /**
   * Updates the countdown display
   */
  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.releaseDate.getTime() - now;

    if (distance > 0) {
      this.timeRemaining = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    } else {
      // Countdown finished
      this.timeRemaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      this.stopCountdown();
    }
  }

  /**
   * Navigates to the specified route
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * TrackBy function for ngFor performance optimization
   */
  trackBySong(index: number, song: Song): string {
    return `${song.title}-${song.albumName}`;
  }
}
