import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoadingScreenComponent } from './modules/user/components/loading-screen/loading-screen.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.authenticateFromLocalStorage().then(() => {
        this.loadingService.setLoading(false);
      }).catch(error => {
        console.error('Authentication failed', error);
        this.loadingService.setLoading(false);
      });

      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loadingService.setLoading(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loadingService.setLoading(false);
        }
      });

      window.addEventListener('load', () => {
        this.loadingService.setLoading(false);
      });
    } else {
      this.loadingService.setLoading(false);
    }
  }

  title = 'taylor-swift-song-ranking-app';
}