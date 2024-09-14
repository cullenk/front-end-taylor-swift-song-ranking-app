import { Component, OnInit, OnDestroy } from "@angular/core";
import { RankingsService } from "../../../../services/rankings.service";
import { Router, RouterModule, RouterOutlet, NavigationStart } from "@angular/router";
import { filter } from 'rxjs/operators';
import { CommonModule } from "@angular/common";
import { ToastrService } from 'ngx-toastr';

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
  shelfImage = 'https://d3e29z0m37b0un.cloudfront.net/graphics/shelf.png'
  albums: Album[] = [
    { id: 'debut', title: 'Taylor Swift', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/debut-sound-clip.mp3', routerLink: './debut' },
    { id: 'fearless', title: 'Fearless', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/fearless-sound-clip.mp3', routerLink: './fearless' },
    { id: 'speak-now', title: 'Speak Now', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/speak-now-sound-clip.mp3', routerLink: './speak-now' },
    { id: 'red', title: 'Red', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/red-tv.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/red-sound-clip.mp3', routerLink: './red' },
    { id: '1989', title: '1989', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/1989.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/1989-sound-clip.mp3', routerLink: './nineteen-eighty-nine' },
    { id: 'reputation', title: 'reputation', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/reputation.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/reputation-sound-clip.mp3', routerLink: './reputation' },
    { id: 'lover', title: 'Lover', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/lover.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/lover-sound-clip.mp3', routerLink: './lover' },
    { id: 'folklore', title: 'folklore', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/folklore.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/folklore-sound-clip.mp3', routerLink: './folklore' },
    { id: 'evermore', title: 'evermore', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/evermore.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/evermore-sound-clip.mp3', routerLink: './evermore' },
    { id: 'midnights', title: 'Midnights', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/midnights.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/midnights-sound-clip.mp3', routerLink: './midnights' },
    { id: 'ttpd', title: 'The Tortured Poets Department', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/ttpd.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/ttpd-sound-clip.mp3', routerLink: './tortured-poets-department' },
    { id: 'singles', title: 'Singles', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/singles/Singles.svg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/singles-sound-clip.mp3', routerLink: './singles' },
    { id: 'allAlbums', title: 'All Albums', coverImage: 'https://d3e29z0m37b0un.cloudfront.net/All-Albums.svg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/allAlbumsClip.mp3', routerLink: './allAlbums' },
  ];

  private audioElements: { [key: string]: HTMLAudioElement } = {};

  constructor(
    private rankingsService: RankingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
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