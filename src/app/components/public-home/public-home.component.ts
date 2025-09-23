import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

interface FloatingAlbum {
  src: string;
  top: string;
  left: string;
  delay: string;
}

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss']
})
export class PublicHomeComponent implements AfterViewInit {
  @ViewChild('randomSquares') randomSquaresElement!: ElementRef;
  @ViewChild('albumCovers') albumCoversElement!: ElementRef;

  albumCovers: string[] = [
    'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
    'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
    'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
    'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
    'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
    'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
    'https://d3e29z0m37b0un.cloudfront.net/ttpd1.webp',
    'https://d3e29z0m37b0un.cloudfront.net/ttpd.webp',
    'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
    'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
    'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
    'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
    'https://d3e29z0m37b0un.cloudfront.net/life-of-a-showgirl.webp'
  ];

  floatingAlbums: FloatingAlbum[] = [];

  constructor(private meta: Meta, private title: Title, private renderer: Renderer2) {
    this.updateMetaTags();
    this.generateFloatingAlbums();
  }

  ngAfterViewInit() {
    this.generateRandomSquares();
  }

  generateFloatingAlbums() {
    this.floatingAlbums = this.albumCovers.map((cover, index) => ({
      src: cover,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 5}s`
    }));
  }

  generateRandomSquares() {
    if (!this.randomSquaresElement) return;

    const container = this.randomSquaresElement.nativeElement;
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32', '#9370DB', '#FF1493'];
    const numSquares = 20;

    for (let i = 0; i < numSquares; i++) {
      const square = this.renderer.createElement('div');
      this.renderer.addClass(square, 'random-square');

      const size = Math.floor(Math.random() * 40) + 15;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.renderer.setStyle(square, 'width', `${size}px`);
      this.renderer.setStyle(square, 'height', `${size}px`);
      this.renderer.setStyle(square, 'top', `${top}%`);
      this.renderer.setStyle(square, 'left', `${left}%`);
      this.renderer.setStyle(square, 'background-color', color);
      this.renderer.setStyle(square, 'opacity', '0.4');
      this.renderer.setStyle(square, 'animation-delay', `${Math.random() * 3}s`);

      this.renderer.appendChild(container, square);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.albumCoversElement) return;

    const albums = document.querySelectorAll('.floating-album');
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;

    albums.forEach((album: Element, index: number) => {
      const htmlAlbum = album as HTMLElement;
      const movementX = (index % 2 === 0 ? 1 : -1) * 20 * (mouseX - 0.5);
      const movementY = (index % 3 === 0 ? 1 : -1) * 15 * (mouseY - 0.5);
      this.renderer.setStyle(htmlAlbum, 'transform', `translate(${movementX}px, ${movementY}px)`);
    });
  }

 updateMetaTags() {
  this.title.setTitle('Swiftie Ranking Hub - Rank Your Favorite Taylor Swift Songs');
  
  // Basic meta tags
  this.meta.updateTag({ 
    name: 'description', 
    content: 'Join hundreds of Taylor Swift fans ranking their favorite songs, building Eras Tour setlists, and connecting with fellow Swifties. Free to join!' 
  });
  this.meta.updateTag({ 
    name: 'keywords', 
    content: 'Taylor Swift, song rankings, Eras Tour, Swiftie, music ranking, setlist builder' 
  });
  
  // Open Graph tags for social media sharing
  this.meta.updateTag({ 
    property: 'og:title', 
    content: 'Swiftie Ranking Hub - Rank Your Favorite Taylor Swift Songs' 
  });
  this.meta.updateTag({ 
    property: 'og:description', 
    content: 'Join hundreds of Taylor Swift fans ranking their favorite songs, building Eras Tour setlists, and connecting with fellow Swifties. Free to join!' 
  });
  this.meta.updateTag({ 
    property: 'og:image', 
    content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' 
  });
  this.meta.updateTag({ 
    property: 'og:image:width', 
    content: '1200' 
  });
  this.meta.updateTag({ 
    property: 'og:image:height', 
    content: '630' 
  });
  this.meta.updateTag({ 
    property: 'og:url', 
    content: 'https://swiftierankinghub.com' 
  });
  this.meta.updateTag({ 
    property: 'og:type', 
    content: 'website' 
  });
  this.meta.updateTag({ 
    property: 'og:site_name', 
    content: 'Swiftie Ranking Hub' 
  });
  
  // Twitter Card tags
  this.meta.updateTag({ 
    name: 'twitter:card', 
    content: 'summary_large_image' 
  });
  this.meta.updateTag({ 
    name: 'twitter:title', 
    content: 'Swiftie Ranking Hub - Rank Your Favorite Taylor Swift Songs' 
  });
  this.meta.updateTag({ 
    name: 'twitter:description', 
    content: 'Join hundreds of Taylor Swift fans ranking their favorite songs, building Eras Tour setlists, and connecting with fellow Swifties. Free to join!' 
  });
  this.meta.updateTag({ 
    name: 'twitter:image', 
    content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' 
  });
  
  // Additional SEO tags
  this.meta.updateTag({ 
    name: 'author', 
    content: 'Swiftie Ranking Hub' 
  });
  this.meta.updateTag({ 
    name: 'robots', 
    content: 'index, follow' 
  });
  this.meta.updateTag({ 
    name: 'viewport', 
    content: 'width=device-width, initial-scale=1' 
  });
  
  // Canonical URL
  this.meta.updateTag({ 
    rel: 'canonical', 
    href: 'https://swiftierankinghub.com' 
  });
}
}