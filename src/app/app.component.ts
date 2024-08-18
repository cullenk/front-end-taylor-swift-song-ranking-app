import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoadingScreenComponent } from './modules/user/components/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Authenticate user
      this.authService.authenticateFromLocalStorage().then(() => {
        // Hide loading screen after authentication
        this.isLoading = false;
      }).catch(error => {
        console.error('Authentication failed', error);
        this.isLoading = false;
      });

      // Show loading screen during navigation
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isLoading = false;
        }
      });

      // Ensure loading screen is hidden after all resources have loaded
      window.addEventListener('load', () => {
        this.isLoading = false;
      });
    } else {
      // If not in a browser environment, immediately hide the loading screen
      this.isLoading = false;
    }
  }

  title = 'taylor-swift-song-ranking-app';
}