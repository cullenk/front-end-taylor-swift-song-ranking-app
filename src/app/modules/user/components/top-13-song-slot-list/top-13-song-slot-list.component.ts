import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Top13SongSlotComponent } from '../top-13-song-slot/top-13-song-slot.component';

@Component({
  selector: 'app-top-13-song-slot-list',
  standalone: true,
  imports: [CommonModule, Top13SongSlotComponent],
  templateUrl: './top-13-song-slot-list.component.html',
  styleUrl: './top-13-song-slot-list.component.scss'
})
export class Top13SongSlotListComponent {
  slots: number[] = Array(13).fill(0);


}

