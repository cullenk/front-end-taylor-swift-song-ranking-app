import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AllSongsRankingService, AllSongsRankingItem } from '../../../../../services/all-songs-ranking.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-all-songs-ranking',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './all-songs-ranking.component.html',
  styleUrls: ['./all-songs-ranking.component.scss']
})
export class AllSongsRankingComponent implements OnInit {
  allSongsRanking: AllSongsRankingItem[] = [];
  allSongs: AllSongsRankingItem[] = [];
  isLoading = true;
  hasDuplicateRanks = false;
  duplicateRanks: number[] = [];
  hasInvalidRanks = false;

  constructor(
    private allSongsRankingService: AllSongsRankingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadRankings();
  }

  loadRankings() {
    this.isLoading = true;
    forkJoin({
      userRanking: this.allSongsRankingService.getAllSongsRanking(),
      allSongs: this.allSongsRankingService.getAllSongs()
    }).subscribe(
      ({ userRanking, allSongs }) => {
        this.allSongs = allSongs;
        this.mergeNewSongs(userRanking);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching songs:', error);
        this.isLoading = false;
      }
    );
  }

  mergeNewSongs(userRanking: AllSongsRankingItem[]) {
    const rankedSongIds = new Set(userRanking.map(song => song.songId));
    const newSongs = this.allSongs.filter(song => !rankedSongIds.has(song.songId));
    
    // Add new songs to the end of the user's ranking
    this.allSongsRanking = [
      ...userRanking,
      ...newSongs.map((song, index) => ({
        ...song,
        rank: userRanking.length + index + 1
      }))
    ];

    // Update ranks to ensure they are consecutive
    this.updateRanks();
  }

  drop(event: CdkDragDrop<AllSongsRankingItem[]>) {
    const item = this.allSongsRanking[event.previousIndex];
    moveItemInArray(this.allSongsRanking, event.previousIndex, event.currentIndex);
    
    // Update ranks based on new positions
    this.allSongsRanking.forEach((song, index) => {
      song.rank = index + 1;
    });
  
    this.hasInvalidRanks = this.checkForInvalidRanks();
    this.hasDuplicateRanks = this.checkForDuplicateRanks();
  }

  updateRanks() {
    this.allSongsRanking.sort((a, b) => a.rank - b.rank);
    this.allSongsRanking.forEach((item, index) => item.rank = index + 1);
    this.checkForDuplicateRanks();
  }

  onRankChange(changedSong: AllSongsRankingItem, newRank: number) {
    if (newRank < 1 || newRank > this.allSongsRanking.length || !Number.isInteger(newRank)) {
      this.toastr.error(`Invalid rank. Please enter a whole number between 1 and ${this.allSongsRanking.length}`);
      this.hasInvalidRanks = true;
      return;
    }
  
    const oldRank = changedSong.rank;
    
    // Update ranks of other songs
    this.allSongsRanking.forEach(song => {
      if (song !== changedSong) {
        if (oldRank < newRank && song.rank > oldRank && song.rank <= newRank) {
          song.rank--;
        } else if (oldRank > newRank && song.rank >= newRank && song.rank < oldRank) {
          song.rank++;
        }
      }
    });
  
    // Set the new rank for the changed song
    changedSong.rank = newRank;
  
    // Sort the array based on the new ranks
    this.allSongsRanking.sort((a, b) => a.rank - b.rank);
  
    this.hasInvalidRanks = this.checkForInvalidRanks();
    this.hasDuplicateRanks = this.checkForDuplicateRanks();
  }

  checkForDuplicateRanks(): boolean {
    const rankCounts = new Map<number, number>();
    this.allSongsRanking.forEach(song => {
      rankCounts.set(song.rank, (rankCounts.get(song.rank) || 0) + 1);
    });
    
    this.duplicateRanks = Array.from(rankCounts.entries())
      .filter(([rank, count]) => count > 1)
      .map(([rank]) => rank);
  
    return this.duplicateRanks.length > 0;
  }

  checkForInvalidRanks(): boolean {
    return this.allSongsRanking.some(song => 
      song.rank < 1 || song.rank > this.allSongsRanking.length || !Number.isInteger(song.rank)
    );
  }

  saveRanking() {
    if (this.hasDuplicateRanks || this.hasInvalidRanks) {
      this.toastr.error('Cannot save. Please resolve all ranking issues before saving.');
      return;
    }
    this.isLoading = true;
    this.allSongsRankingService.saveAllSongsRanking(this.allSongsRanking).subscribe(
      updatedRanking => {
        this.allSongsRanking = updatedRanking;
        this.isLoading = false;
        this.toastr.success('All songs ranking saved successfully');
      },
      error => {
        console.error('Error saving all songs ranking:', error);
        this.isLoading = false;
        this.toastr.error('Error saving ranking');
      }
    );
  }
}