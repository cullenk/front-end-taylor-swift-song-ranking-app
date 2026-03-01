import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import { ActivityItem } from '../../../../services/user-activity.service';
import { environment } from '../../../../../environments/environment';

interface ActivityResponse {
  activities: ActivityItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
  activities: ActivityItem[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;
  
  // Filters
  selectedEventType: string = 'all';
  selectedTimeRange: string = '24h';
  
  eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'user_created', label: 'New Users' },
    { value: 'user_login', label: 'User Logins' },
    { value: 'profile_updated', label: 'Profile Updates' },
    { value: 'ranking_updated', label: 'Ranking Updates' },
    { value: 'theme_changed', label: 'Theme Changes' },
    { value: 'eras_tour_updated', label: 'Eras Tour Updates' },
    { value: 'admin_action', label: 'Admin Actions' }
  ];
  
  timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.loadActivities();
  }

  private updateMetaTags(): void {
    this.title.setTitle('Admin - User Activity Dashboard');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  private getHeaders(): HttpHeaders {
    let token = '';
    
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadActivities(): void {
    this.isLoading = true;
    this.error = null;
    
    let params = new HttpParams();
    params = params.set('page', this.currentPage.toString());
    params = params.set('limit', this.itemsPerPage.toString());
    
    if (this.selectedEventType !== 'all') {
      params = params.set('eventType', this.selectedEventType);
    }
    if (this.selectedTimeRange !== 'all') {
      params = params.set('timeRange', this.selectedTimeRange);
    }

    this.http.get<ActivityResponse>(
      `${this.apiUrl}/admin/activities`,
      { 
        headers: this.getHeaders(),
        params 
      }
    ).subscribe({
      next: (response) => {
        this.activities = response.activities;
        this.totalItems = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.error = 'Failed to load user activities. Please check your admin privileges.';
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadActivities();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadActivities();
    }
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'user_created': return 'fas fa-user-plus';
      case 'user_login': return 'fas fa-sign-in-alt';
      case 'profile_updated': return 'fas fa-user-edit';
      case 'ranking_updated': return 'fas fa-list-ol';
      case 'theme_changed': return 'fas fa-palette';
      case 'eras_tour_updated': return 'fas fa-music';
      case 'admin_action': return 'fas fa-shield-alt';
      default: return 'fas fa-circle';
    }
  }

  getEventColor(eventType: string): string {
    switch (eventType) {
      case 'user_created': return '#28a745';
      case 'user_login': return '#17a2b8';
      case 'profile_updated': return '#ffc107';
      case 'ranking_updated': return '#6f42c1';
      case 'theme_changed': return '#fd7e14';
      case 'eras_tour_updated': return '#e83e8c';
      case 'admin_action': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getEventDescription(activity: ActivityItem): string {
    switch (activity.eventType) {
      case 'user_created':
        return `${activity.username} created a new account`;
      case 'user_login':
        return `${activity.username} signed in`;
      case 'profile_updated':
        return `${activity.username} updated their profile`;
      case 'ranking_updated':
        return `${activity.username} updated their rankings`;
      case 'theme_changed':
        const newTheme = activity.theme || (activity.eventData?.newTheme);
        return `${activity.username} changed their theme${newTheme ? ` to ${newTheme}` : ''}`;
      case 'eras_tour_updated':
        return `${activity.username} updated their Eras Tour setlist`;
      case 'admin_action':
        const action = activity.eventData?.action || 'performed an admin action';
        return `${activity.username} ${action}`;
      default:
        return `${activity.username} performed an action`;
    }
  }

  getProfileImage(activity: ActivityItem): string {
    // Check if userId is populated with user data
    if (typeof activity.userId === 'object' && activity.userId.profileImage) {
      return activity.userId.profileImage;
    }
    // Fallback to direct profileImage property
    return activity.profileImage || 'assets/default-profile.png';
  }

  getUserTheme(activity: ActivityItem): string {
    // Check if userId is populated with user data
    if (typeof activity.userId === 'object' && activity.userId.theme) {
      return activity.userId.theme;
    }
    // Fallback to direct theme property
    return activity.theme || 'Default';
  }

  getUserCountry(activity: ActivityItem): string {
    // Check if userId is populated with user data
    if (typeof activity.userId === 'object' && activity.userId.country) {
      return activity.userId.country;
    }
    // Fallback to direct country property
    return activity.country || '';
  }

  getDefaultProfileImage(): string {
    return 'https://d3e29z0m37b0un.cloudfront.net/profile-images/debut.webp';
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return activityTime.toLocaleDateString();
  }

  getUserId(activity: ActivityItem): string {
    return typeof activity.userId === 'object' && activity.userId._id 
      ? activity.userId._id 
      : activity.userId as string;
  }

  getThemeClass(theme: string): string {
    const themeMap: { [key: string]: string } = {
      'Debut': 'debut',
      'Fearless': 'fearless',
      'Speak Now': 'speak-now',
      'Red': 'red',
      '1989': 'taylor-swift-1989',
      'Reputation': 'reputation',
      'Lover': 'lover',
      'Folklore': 'folklore',
      'Evermore': 'evermore',
      'Midnights': 'midnights',
      'The Tortured Poets Department': 'ttpd',
      'The Life of a Showgirl': 'showgirl'
    };
    return themeMap[theme] || 'debut';
  }

  refreshData(): void {
    this.loadActivities();
  }

  trackByActivityId(index: number, activity: ActivityItem): string {
    return activity._id;
  }

  // Expose Math to template
  Math = Math;
}
