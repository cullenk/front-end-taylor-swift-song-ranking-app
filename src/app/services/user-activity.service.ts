import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ActivityFilters {
  page?: number;
  limit?: number;
  eventType?: string;
  timeRange?: string;
  userId?: string;
}

export interface ActivityItem {
  _id: string;
  userId: {
    _id?: string;
    profileImage?: string;
    theme?: string;
    country?: string;
    username?: string;
  } | string;
  username: string;
  eventType: 'user_created' | 'user_login' | 'profile_updated' | 'ranking_updated' | 'theme_changed' | 'eras_tour_updated' | 'admin_action';
  eventData: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  profileImage?: string;
  theme?: string;
  country?: string;
}

interface ActivityResponse {
  activities: ActivityItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface ActivityStats {
  totalUsers: number;
  newUsersToday: number;
  activeUsersToday: number;
  totalLogins: number;
  popularThemes: { theme: string; count: number; }[];
  recentCountries: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Get user activities with filtering and pagination
   */
  getActivities(filters: ActivityFilters = {}): Observable<ActivityResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.eventType) params = params.set('eventType', filters.eventType);
    if (filters.timeRange) params = params.set('timeRange', filters.timeRange);
    if (filters.userId) params = params.set('userId', filters.userId);

    return this.http.get<ActivityResponse>(
      `${this.apiUrl}/admin/activities`, 
      { 
        headers: this.getHeaders(),
        params 
      }
    );
  }

  /**
   * Get activity statistics dashboard
   */
  getActivityStats(): Observable<ActivityStats> {
    return this.http.get<ActivityStats>(
      `${this.apiUrl}/admin/activity-stats`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get real-time activity stream (for live updates)
   */
  getRecentActivities(limit: number = 10): Observable<ActivityItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    
    return this.http.get<ActivityItem[]>(
      `${this.apiUrl}/admin/recent-activities`,
      { 
        headers: this.getHeaders(),
        params 
      }
    );
  }

  /**
   * Log a custom admin action (for audit trail)
   */
  logAdminAction(action: string, details?: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin/log-action`,
      { action, details },
      { headers: this.getHeaders() }
    );
  }
}
