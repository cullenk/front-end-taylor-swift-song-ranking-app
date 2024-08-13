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
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/eras-arlington.jpeg',
      caption: 'Arlington, TX - March 31st, 2023'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/eras-kansas.jpg',
      caption: 'Kansas City, KS - July 8th, 2023'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/eras-museum.jpeg',
      caption: 'Eras Tour Collection Museum - Arlington, TX'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/shirt-signing.png',
      caption: 'Gelsenkirchen, Germany - July 19th, 2024'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/swiftkirchen.jpeg',
      caption: 'Official city renaming to Swiftkirchen!'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/poster.jpeg',
      caption: 'Swiftkirchen Block Party - July 19th, 2024'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/gelsenkirchen.jpeg',
      caption: 'Veltins Arena in Gelsenkirchen'
    },
    {
      src: 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/funko.jpg',
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
