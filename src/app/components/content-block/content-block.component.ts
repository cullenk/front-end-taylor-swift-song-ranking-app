import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-block">
      <div class="content-header" *ngIf="title">
        <h2>{{ title }}</h2>
        <div class="content-divider"></div>
      </div>
      <div class="content-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .content-block {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 2rem;
      margin: 1.5rem 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .content-header h2 {
      color: #2c3e50;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-align: center;
    }

    .content-divider {
      width: 60px;
      height: 3px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      margin: 0 auto 2rem;
      border-radius: 2px;
    }

    .content-body {
      line-height: 1.7;
      color: #444;
    }

    .content-body p {
      margin-bottom: 1rem;
    }

    .content-body h3 {
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem;
    }

    .content-body ul, .content-body ol {
      margin: 1rem 0;
      padding-left: 2rem;
    }

    .content-body li {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .content-block {
        padding: 1.5rem;
        margin: 1rem 0;
      }

      .content-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ContentBlockComponent {
  @Input() title?: string;
}
