import { Component, OnInit, HostListener } from '@angular/core';
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
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.ngOnInit(); 
  }

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
          padding: { top: 10, bottom: 0 }
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
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
        },
        suggestedMax: 10 // Ensure y-axis always goes up to at least 10
      }
    },
    layout: {
      padding: {
        bottom: this.isMobileScreen() ? 20 : 50
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserLogins().subscribe((users: User[]) => {
      // Filter out your account
      const filteredUsers = users.filter(user => user.username !== "CullensVersion1994");
  
      const maxUsers = this.isMobileScreen() ? 5 : 10;
      const sortedUsers = filteredUsers
        .sort((a, b) => b.loginCount - a.loginCount)
        .slice(0, maxUsers);
  
      // Pad the data to always have the correct number of entries
      while (sortedUsers.length < maxUsers) {
        sortedUsers.push({ username: '', loginCount: 0 });
      }
  
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
      ].slice(0, maxUsers);
  
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
  

  isMobileScreen(): boolean {
    return window.innerWidth < 768; // You can adjust this breakpoint as needed
  }
}