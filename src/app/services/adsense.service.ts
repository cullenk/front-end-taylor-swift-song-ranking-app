import { Injectable } from '@angular/core';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdSenseService {
  private adSenseLoaded = false;

  constructor() {
    // Initialize adsbygoogle array if it doesn't exist
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
    }
  }

  /**
   * Load Google AdSense script dynamically
   */
  loadAdSense(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.adSenseLoaded || typeof window === 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        this.adSenseLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load AdSense script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Push ad configuration to AdSense
   */
  pushAd(adConfig: any): void {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.push(adConfig);
      } catch (error) {
        console.error('AdSense push failed:', error);
      }
    }
  }

  /**
   * Initialize auto ads (recommended for beginners)
   */
  initializeAutoAds(clientId: string): void {
    this.pushAd({
      google_ad_client: clientId,
      enable_page_level_ads: true
    });
  }
}
