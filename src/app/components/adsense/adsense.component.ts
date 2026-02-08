import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdSenseService } from '../../services/adsense.service';

@Component({
  selector: 'app-adsense',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ad-container" [class]="containerClass">
      <div class="ad-label" *ngIf="showLabel">Advertisement</div>
      <ins #adElement
           class="adsbygoogle"
           [style.display]="adStyle"
           [attr.data-ad-client]="adClient"
           [attr.data-ad-slot]="adSlot"
           [attr.data-ad-format]="adFormat"
           [attr.data-full-width-responsive]="fullWidthResponsive">
      </ins>
    </div>
  `,
  styles: [`
    .ad-container {
      margin: 20px 0;
      text-align: center;
      min-height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .ad-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .adsbygoogle {
      background: transparent;
    }
    
    .ad-banner {
      width: 100%;
      max-width: 728px;
    }
    
    .ad-square {
      width: 300px;
      height: 250px;
    }
    
    .ad-sidebar {
      width: 160px;
      height: 600px;
    }
    
    .ad-mobile {
      width: 320px;
      height: 50px;
    }
    
    @media (max-width: 768px) {
      .ad-container {
        margin: 15px 0;
      }
      
      .ad-banner {
        max-width: 320px;
      }
    }
  `]
})
export class AdSenseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('adElement', { static: true }) adElement!: ElementRef;
  
  @Input() adClient = 'ca-pub-0000000000000000'; // Replace with your client ID
  @Input() adSlot = '0000000000'; // Replace with your ad slot ID
  @Input() adFormat = 'auto';
  @Input() adStyle = 'block';
  @Input() fullWidthResponsive = 'true';
  @Input() showLabel = true;
  @Input() containerClass = 'ad-banner';
  
  constructor(private adSenseService: AdSenseService) {}
  
  ngOnInit(): void {
    // Component initialization
  }
  
  ngAfterViewInit(): void {
    this.loadAd();
  }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }
  
  private loadAd(): void {
    if (typeof window !== 'undefined') {
      try {
        // Push the ad configuration
        this.adSenseService.pushAd({});
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  }
}
