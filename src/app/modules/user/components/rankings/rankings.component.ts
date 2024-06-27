import { Component, OnInit } from "@angular/core";
import { RankingsService } from "../../../../services/rankings.service";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {
  rankings: any;

  constructor(private rankingsService: RankingsService) {}

  ngOnInit() {
    this.rankingsService.getUserRankings().subscribe(
      rankings => this.rankings = rankings
    );
  }
}
