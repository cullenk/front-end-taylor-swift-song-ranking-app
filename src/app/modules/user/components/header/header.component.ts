import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Authentication properties
  private authenticationSub!: Subscription; // Fixed: removed quotes and added proper typing
  userAuthenticated = false;
  
  // Mobile menu properties
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService, // Fixed: proper camelCase naming
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeAuthentication();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  /**
   * Initialize authentication status and subscription
   */
  private initializeAuthentication(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe({
      next: (status: boolean) => {
        this.userAuthenticated = status;
      },
      error: (error) => {
        console.error('Authentication status error:', error);
      }
    });
  }

  /**
   * Clean up subscriptions to prevent memory leaks
   */
  private cleanupSubscriptions(): void {
    if (this.authenticationSub) {
      this.authenticationSub.unsubscribe();
    }
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scrolling when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  /**
   * Handle user logout
   */
  logout(): void {
    try {
      this.authService.logout();
      this.closeMobileMenu();
      // Optionally redirect to login or home page
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Navigate to a specific route and close mobile menu
   */
  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  /**
   * Close mobile menu when clicking outside of it
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const header = target.closest('.header-main-div');
    
    if (!header && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Close mobile menu on escape key press
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isMobileMenuOpen) {
      event.preventDefault();
      this.closeMobileMenu();
    }
  }

  /**
   * Handle window resize to close mobile menu on desktop
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}