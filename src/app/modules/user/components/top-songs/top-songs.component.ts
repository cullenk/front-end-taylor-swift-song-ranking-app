import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';

interface Song {
  title: string;
  count: number;
}

@Component({
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  selector: 'app-top-songs',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.scss']
})
export class TopSongsComponent implements OnInit {
  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartOptions = {
    indexAxis: 'y', // Make the chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Appearances',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          stepSize: 1
        }
      },
      y: {
        title: {
          display: true,
          text: 'Song',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getTopSongs().subscribe((songs: Song[]) => {
      const titles = songs.map(song => song.title);
      const counts = songs.map(song => song.count);
      const colors = titles.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`);

      this.chartData = {
        labels: titles,
        datasets: [
          {
            data: counts,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.6', '1')),
            borderWidth: 1
          }
        ]
      };
    });
  }
}