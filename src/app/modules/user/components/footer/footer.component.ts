import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';


interface FooterLink {
  label: string;
  route: string;
  icon?: string;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  // Organized footer navigation links
  readonly footerLinkGroups: FooterLinkGroup[] = [
    {
      title: 'Main Features',
      links: [
        { label: 'Home', route: './userHome', icon: 'fas fa-home' },
        { label: 'Album Rankings', route: './rankings', icon: 'fas fa-list-ol' },
        { label: 'Top 13 List', route: './top13list', icon: 'fas fa-star' },
        { label: 'Eras Tour Builder', route: './erasTourBuilder', icon: 'fas fa-music' },
        { label: 'My Profile', route: './userProfile', icon: 'fas fa-user' }
      ]
    },
    {
      title: 'Community & Info',
      links: [
        { label: 'User Explorer', route: './userExplorer', icon: 'fas fa-users' },
        { label: 'Top Ranked Songs', route: './topRankedSongs', icon: 'fas fa-heart' },
        { label: 'About', route: './about', icon: 'fas fa-info-circle' },
        { label: 'Contact', route: './contact', icon: 'fas fa-envelope' },
        { label: 'Release Notes', route: './releaseNotes', icon: 'fas fa-clipboard-list' }
      ]
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}


  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

    onFooterLinkClick(link: FooterLink): void {
    // Scroll to top immediately when link is clicked
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'instant' 
      });
    }
    
    // Optional: Track the click for analytics
    console.log(`Footer link clicked: ${link.label}`);
  }

  trackByGroupTitle(index: number, group: FooterLinkGroup): string {
    return group.title;
  }

   trackByLinkLabel(index: number, link: FooterLink): string {
    return link.label;
  }
}