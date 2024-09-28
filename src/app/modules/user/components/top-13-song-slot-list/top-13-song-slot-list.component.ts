import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Top13SongSlotComponent } from '../top-13-song-slot/top-13-song-slot.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-top-13-song-slot-list',
  standalone: true,
  imports: [CommonModule, Top13SongSlotComponent],
  templateUrl: './top-13-song-slot-list.component.html',
  styleUrl: './top-13-song-slot-list.component.scss'
})
export class Top13SongSlotListComponent {
  slots: number[] = Array(13).fill(0);

  constructor(
    private meta: Meta,
    private title: Title
  ){}

  ngOnInit() {
    this.updateMetaTags();
  }

  updateMetaTags() {
    this.title.setTitle('Top 13 List - Swiftie Ranking Hub');
    
    this.meta.updateTag({ name: 'description', content: 'Rank your Top 13 Taylor Swift songs.' });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: 'Rank your Top 13 Taylor Swift songs.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/user/top13list' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Top 13 List - Swiftie Ranking Hub' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Rank your Top 13 Taylor Swift songs.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png' });
  }
}

