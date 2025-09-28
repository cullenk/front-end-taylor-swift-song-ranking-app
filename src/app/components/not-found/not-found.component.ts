import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {
  
  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  /**
   * Navigate back to previous page or home
   */
  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to home page
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Update meta tags for SEO
   */
  private updateMetaTags(): void {
    this.title.setTitle('Page Not Found - Swiftie Ranking Hub');
    
    const description = 'The page you are looking for could not be found. Return to Swiftie Ranking Hub to continue ranking your favorite Taylor Swift songs.';
    
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Page Not Found - Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
  }
}