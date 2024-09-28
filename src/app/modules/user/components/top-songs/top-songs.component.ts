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
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return this.originalTitles[tooltipItems[0].dataIndex]; // Return the full title
          }
        }
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
        },
        ticks: {
          callback: function(value, index, values) {
            const label = this.chart.data.labels?.[index];
            if (typeof label === 'string') {
              const maxLength = 30; // Adjust this value based on your needs
              return label.length > maxLength ? label.substr(0, maxLength) + '...' : label;
            }
            return '';
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10 // Adjust this value based on your needs
          }
        }
      }
    },
    layout: {
      padding: {
        left: 10 // Adjust this value to provide more space for labels
      }
    }
  };

  private originalTitles: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getTopSongs().subscribe((songs: Song[]) => {
      const maxTitleLength = 20; // Adjust this value based on your needs
      this.originalTitles = songs.map(song => song.title);
      const titles = songs.map(song => this.truncateTitle(song.title, maxTitleLength));
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

  private truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substr(0, maxLength) + '...';
    }
    return title;
  }
}