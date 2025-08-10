import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Song {
  title: string;
  count: number;
}

@Component({
  selector: 'app-all-favorite-songs',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './all-favorite-songs.component.html',
  styleUrl: './all-favorite-songs.component.scss',
})
export class AllFavoriteSongsComponent implements OnInit {
  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };

  public chartOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return this.originalTitles[tooltipItems[0].dataIndex];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Appearances',
          font: {
            weight: 'bold',
          },
        },
        ticks: {
          stepSize: 5,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Song',
          font: {
            weight: 'bold',
          },
        },
        ticks: {
          callback: function (value, index, values) {
            const label = this.chart.data.labels?.[index];
            if (typeof label === 'string') {
              const maxLength = 25;
              return label.length > maxLength
                ? label.substr(0, maxLength) + '...'
                : label;
            }
            return '';
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10, // Increased font size for better readability
          },
          padding: 5, // Add padding between labels
        },
      },
    },
    layout: {
       padding: {
        left: 15, // Increased left padding
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  
  };

  private originalTitles: string[] = [];
  isLoading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllFavoriteSongs();
  }

  loadAllFavoriteSongs(): void {
    this.userService.getAllFavoriteSongs().subscribe({
      next: (songs: Song[]) => {
        const maxTitleLength = 25;
        this.originalTitles = songs.map((song) => song.title);
        const titles = songs.map((song) =>
          this.truncateTitle(song.title, maxTitleLength)
        );
        const counts = songs.map((song) => song.count);
        const colors = titles.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.6)`
        );

        this.chartData = {
          labels: titles,
          datasets: [
            {
              data: counts,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading all favorite songs:', error);
        this.isLoading = false;
      },
    });
  }

  private truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substr(0, maxLength) + '...';
    }
    return title;
  }

  goBack(): void {
    this.router.navigate(['/user/userHome']);
  }
}
