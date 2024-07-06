import { Component, OnInit, OnDestroy } from "@angular/core";
import { RankingsService } from "../../../../services/rankings.service";
import { Router, RouterModule, RouterOutlet, NavigationStart } from "@angular/router";
import { filter } from 'rxjs/operators';
import { CommonModule } from "@angular/common";

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
  shelfImage = 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/shelf.png'
  albums: Album[] = [
    { id: 'debut', title: 'Taylor Swift', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/debut-sound-clip.mp3', routerLink: './debut' },
    { id: 'fearless', title: 'Fearless', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/fearless-sound-clip.mp3', routerLink: './fearless' },
    { id: 'speak-now', title: 'Speak Now', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/speak-now-sound-clip.mp3', routerLink: './speak-now' },
    { id: 'red', title: 'Red', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/red-sound-clip.mp3', routerLink: './red' },
    { id: '1989', title: '1989', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/1989-sound-clip.mp3', routerLink: './nineteen-eighty-nine' },
    { id: 'reputation', title: 'reputation', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/reputation.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/reputation-sound-clip.mp3', routerLink: './reputation' },
    { id: 'lover', title: 'Lover', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/lover-sound-clip.mp3', routerLink: './lover' },
    { id: 'folklore', title: 'folklore', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/folklore-sound-clip.mp3', routerLink: './folklore' },
    { id: 'evermore', title: 'evermore', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/evermore-sound-clip.mp3', routerLink: './evermore' },
    { id: 'midnights', title: 'Midnights', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/midnights.jpeg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/midnights-sound-clip.mp3', routerLink: './midnights' },
    { id: 'ttpd', title: 'The Tortured Poets Department', coverImage: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg', sampleAudio: 'https://all-taylor-swift-albums.s3.us-east-2.amazonaws.com/Sound+Clips/ttpd-sound-clip.mp3', routerLink: './tortured-poets-department' }
  ];

  private audioElements: { [key: string]: HTMLAudioElement } = {};

  constructor(
    private rankingsService: RankingsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.rankingsService.getUserRankings().subscribe(
      rankings => this.rankings = rankings
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
