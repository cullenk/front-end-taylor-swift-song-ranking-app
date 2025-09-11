import { Component, OnInit, OnDestroy } from "@angular/core";
import { RankingsService } from "../../../../services/rankings.service";
import { Router, RouterModule, RouterOutlet, NavigationStart } from "@angular/router";
import { filter } from 'rxjs/operators';
import { CommonModule } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';

interface Album {
  id: string;
  title: string;
  coverImage: string;
  sampleAudio: string;
  routerLink: string;
}

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit, OnDestroy {
  rankings: any;
  shelfImage = 'https://d3e29z0m37b0un.cloudfront.net/graphics/shelf.webp'
  albums: Album[] = [
    { id: 'debut', title: 'Taylor Swift', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/debut-sound-clip.mp3', routerLink: './debut' },
    { id: 'fearless', title: 'Fearless', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/fearless-sound-clip.mp3', routerLink: './fearless' },
    { id: 'speak-now', title: 'Speak Now', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/speak-now-sound-clip.mp3', routerLink: './speak-now' },
    { id: 'red', title: 'Red', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/red-sound-clip.mp3', routerLink: './red' },
    { id: '1989', title: '1989', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/1989.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/1989-sound-clip.mp3', routerLink: './nineteen-eighty-nine' },
    { id: 'reputation', title: 'reputation', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/reputation.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/reputation-sound-clip.mp3', routerLink: './reputation' },
    { id: 'lover', title: 'Lover', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/lover.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/lover-sound-clip.mp3', routerLink: './lover' },
    { id: 'folklore', title: 'folklore', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/folklore.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/folklore-sound-clip.mp3', routerLink: './folklore' },
    { id: 'evermore', title: 'evermore', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/evermore.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/evermore-sound-clip.mp3', routerLink: './evermore' },
    { id: 'midnights', title: 'Midnights', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/midnights.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/midnights-sound-clip.mp3', routerLink: './midnights' },
    { id: 'ttpd', title: 'The Tortured Poets Department', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/ttpd-sound-clip.mp3', routerLink: './tortured-poets-department' },
    // { id: 'lifeOfAShowgirl', title: 'The Life of a Showgirl', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/life-of-a-showgirl.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/life-of-a-showgirl-sound-clip.mp3', routerLink: './the-life-of-a-showgirl' },
    { id: 'allAlbums', title: 'All Albums', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/All-Albums.webp', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/allAlbumsClip.mp3', routerLink: './allAlbums' },
    { id: 'allSongs', title: 'All Songs', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/AllSongs.svg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/allSongsClip.mp3', routerLink: './allSongs' },
    { id: 'singles', title: 'Singles', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/SinglesAndFeatures.svg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/singles-sound-clip.mp3', routerLink: './singles' },
    { id: 'byTrackNumber', title: 'By Track Number', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/byTrackNumber.svg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/readyForIt.mp3', routerLink: './byTrackNumber' },
  ];

  private audioElements: { [key: string]: HTMLAudioElement } = {};

  constructor(
    private rankingsService: RankingsService,
    private router: Router,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.updateMetaTags();
    this.rankingsService.getUserRankings().subscribe(
      rankings => this.rankings = rankings,
      error => {
        console.error('Error loading rankings:', error);
        this.toastr.error('Failed to load rankings. Please try again.', 'Error');
      }
    );
    this.preloadAudio();
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.stopAllAudio();
    });
  }

  ngOnDestroy() {
    this.stopAllAudio();
  }

  updateMetaTags() {
    this.title.setTitle('Album Rankings - Swiftie Ranking Hub');
    
    this.meta.updateTag({ name: 'description', content: 'Rank your favorite Taylor Swift songs by album.' });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: 'Rank your favorite Taylor Swift songs by album.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/user/rankings' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Album Rankings - Swiftie Ranking Hub' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Rank your favorite Taylor Swift songs by album.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png' });
  }

  private stopAllAudio() {
    Object.values(this.audioElements).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  preloadAudio() {
    this.albums.forEach(album => {
      const audio = new Audio();
      audio.src = album.sampleAudio;
      audio.load();
      this.audioElements[album.id] = audio;
    });
  }

  playSample(album: Album, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  
    this.stopAllAudio();
  
    const audio = this.audioElements[album.id];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.3;
      audio.play();
    }
  }

  stopSample(album: Album) {
    const audio = this.audioElements[album.id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}