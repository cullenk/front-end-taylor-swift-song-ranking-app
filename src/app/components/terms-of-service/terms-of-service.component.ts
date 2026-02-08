import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent {
  currentDate = new Date();

  constructor(
    private meta: Meta,
    private title: Title
  ) {
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    this.title.setTitle('Terms of Service - Swiftie Ranking Hub');
    
    const description = 'Terms of Service for Swiftie Ranking Hub - Rules and guidelines for using our Taylor Swift song ranking platform.';
    
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'terms of service, user agreement, swiftie ranking hub, taylor swift' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: 'Terms of Service - Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/terms' });
  }
}
