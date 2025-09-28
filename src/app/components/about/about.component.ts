import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

interface GalleryImage {
  src: string;
  caption: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  // Lightbox properties
  lightboxVisible = false;
  lightboxImage = '';
  lightboxCaption = '';
  currentIndex = 0;

  // Gallery images
  readonly images: GalleryImage[] = [
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

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  /**
   * Updates SEO meta tags for the about page
   */
  private updateMetaTags(): void {
    const pageTitle = 'About - Swiftie Ranking Hub';
    const description = 'Learn more about the Swiftie Ranking Hub and how you can rank your favorite Taylor Swift songs, build your own Eras Tour and share your profile with friends!';
    const imageUrl = 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp';
    const pageUrl = 'https://swiftierankinghub.com/user/about';

    // Set page title
    this.title.setTitle(pageTitle);
    
    // Basic meta tags
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
   * Opens the lightbox with the specified image
   */
  openLightbox(index: number): void {
    if (index < 0 || index >= this.images.length) return;
    
    this.currentIndex = index;
    this.lightboxVisible = true;
    this.updateLightboxContent();
    
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the lightbox if clicked on overlay
   */
  closeLightbox(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.lightboxVisible = false;
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Closes the lightbox directly
   */
  closeLightboxDirect(): void {
    this.lightboxVisible = false;
    document.body.style.overflow = 'auto';
  }

  /**
   * Navigates to the next or previous image in the lightbox
   */
  navigate(event: Event, direction: number): void {
    event.stopPropagation();
    event.preventDefault();
    
    const newIndex = this.currentIndex + direction;
    
    // Handle wrapping around the gallery
    if (newIndex >= this.images.length) {
      this.currentIndex = 0;
    } else if (newIndex < 0) {
      this.currentIndex = this.images.length - 1;
    } else {
      this.currentIndex = newIndex;
    }
    
    this.updateLightboxContent();
  }

  /**
   * Updates the lightbox image and caption based on current index
   */
  private updateLightboxContent(): void {
    const currentImage = this.images[this.currentIndex];
    this.lightboxImage = currentImage.src;
    this.lightboxCaption = currentImage.caption;
  }

  // Keyboard navigation handlers
  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent): void {
    if (this.lightboxVisible) {
      this.navigate(event, 1);
    }
  }
  
  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent): void {
    if (this.lightboxVisible) {
      this.navigate(event, -1);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (this.lightboxVisible) {
      event.preventDefault();
      this.closeLightboxDirect();
    }
  }

   trackByIndex(index: number, item: GalleryImage): number {
    return index;
  }
}