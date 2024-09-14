import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserService } from '../../../../services/user.service';

interface User {
  username: string;
  loginCount: number;
}

@Component({
  standalone: true,
  imports: [BaseChartDirective],
  selector: 'app-top-users',
  templateUrl: './top-users.component.html',
  styleUrls: ['./top-users.component.scss']
})
export class TopUsersComponent implements OnInit {
  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartOptions = {
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
          text: 'User',
          font: {
            weight: 'bold'
          },
          padding: 40
        },
        ticks: {
          autoSkip: false, // Ensure all labels are shown
          maxRotation: 45, // Rotate labels if necessary
          minRotation: 0,
          align: 'center'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Visits',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    layout: {
      padding: {
        bottom: 50 // Add padding to ensure labels are visible
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserLogins().subscribe((users: User[]) => {
      const sortedUsers = users.sort((a, b) => b.loginCount - a.loginCount).slice(0, 10);

      const usernames = sortedUsers.map((user: User) => user.username);
      const loginCounts = sortedUsers.map((user: User) => user.loginCount);

      const colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(199, 199, 199, 0.2)',
        'rgba(83, 102, 255, 0.2)',
        'rgba(255, 99, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)'
      ];

      this.chartData = {
        labels: usernames,
        datasets: [
          {
            data: loginCounts,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.2', '1')),
            borderWidth: 1
          }
        ]
      };
    });
  }
}