import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare let adsbygoogle: any;

@Injectable({
  providedIn: 'root'
})
export class AdSenseService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  pushAd(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }
}