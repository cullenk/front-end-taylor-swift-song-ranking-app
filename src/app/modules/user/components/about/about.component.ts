import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  lightboxVisible = false;
  lightboxImage = '';
  lightboxCaption = '';
  currentIndex = 0;

  images = [
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/arlington.webp',
      caption: 'Arlington, TX - March 31st, 2023'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/kansas-city.webp',
      caption: 'Kansas City, KS - July 8th, 2023'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/eras-museum.webp',
      caption: 'Eras Tour Collection Museum - Arlington, TX'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/shirt-signing.webp',
      caption: 'Gelsenkirchen, Germany - July 19th, 2024'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/swiftkirchen.webp',
      caption: 'Official city renaming to Swiftkirchen!'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/poster.webp',
      caption: 'Swiftkirchen Block Party - July 19th, 2024'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/gelsenkirchen.webp',
      caption: 'Veltins Arena in Gelsenkirchen'
    },
    {
      src: 'https://d3e29z0m37b0un.cloudfront.net/graphics/About+Photos/funko.webp',
      caption: 'I created a custom Taylor Funko Pop and display case :)'
    }
  ];

  openLightbox(index: number): void {
    this.currentIndex = index;
    this.lightboxImage = this.images[index].src;
    this.lightboxCaption = this.images[index].caption;
    this.lightboxVisible = true;
  }

  closeLightbox(event: Event): void {
    event.stopPropagation();
    this.lightboxVisible = false;
  }

  navigate(direction: number): void {
    this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
    this.lightboxImage = this.images[this.currentIndex].src;
    this.lightboxCaption = this.images[this.currentIndex].caption;
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    if (this.lightboxVisible) {
      this.navigate(1);
    }
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    if (this.lightboxVisible) {
      this.navigate(-1);
    }
  }
}
