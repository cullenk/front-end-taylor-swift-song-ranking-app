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

  openLightbox(index: number) {
    this.currentIndex = index;
    this.lightboxVisible = true;
    this.lightboxImage = this.images[index].src;
    this.lightboxCaption = this.images[index].caption;
  }

  closeLightbox(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.lightboxVisible = false;
    }
  }

  navigate(event: Event | KeyboardEvent, direction: number) {
    event.stopPropagation();
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.images.length) {
      this.currentIndex = newIndex;
      this.lightboxImage = this.images[this.currentIndex].src;
      this.lightboxCaption = this.images[this.currentIndex].caption;
    }
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    if (this.lightboxVisible) {
      event.preventDefault(); // Prevent default arrow key behavior
      this.navigate(event, 1);
    }
  }
  
  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    if (this.lightboxVisible) {
      event.preventDefault(); // Prevent default arrow key behavior
      this.navigate(event, -1);
    }
  }
}
