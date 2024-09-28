import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss'
})
export class LoadingScreenComponent {
  constructor(public loadingService: LoadingService) {}
}