import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../../services/user-profile.service';
import { UserProfile } from '../../../../interfaces/userProfile';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-user-explorer',
  templateUrl: './user-explorer.component.html',
  styleUrls: ['./user-explorer.component.scss']
})
export class UserExplorerComponent implements OnInit {
  users: UserProfile[] = [];
  filteredUsers: UserProfile[] = [];
  searchTerm: string = '';

  private themeColors: { [key: string]: string } = {
    'Debut': 'rgba(82, 253, 164, 0.7)',
    'Fearless': 'rgba(255, 249, 196, 0.7)',
    'Speak Now': 'rgba(190, 53, 214, 0.7)',
    'Red': 'rgba(150, 12, 12, 0.7)',
    '1989': 'rgba(179, 229, 252, 0.7)',
    'Reputation': 'rgba(42, 42, 42, 0.7)',
    'Lover': 'rgba(255, 186, 249, 0.7)',
    'Folklore': 'rgba(245, 245, 245, 0.7)',
    'Evermore': 'rgba(219, 134, 30, 0.7)',
    'Midnights': 'rgba(25, 25, 112, 0.7)',
    'The Tortured Poets Department': '#E3E0C8'
  };

  constructor(
    private router: Router,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userProfileService.getAllPublicProfiles().subscribe(
      (profiles: UserProfile[]) => {
        this.users = this.sortUsers(profiles);
        this.filteredUsers = this.users;
      },
      error => {
        console.error('Error fetching user profiles:', error);
      }
    );
  }

  sortUsers(users: UserProfile[]): UserProfile[] {
    return users.sort((a, b) => {
      const aHasProfileAndTheme = a.profileImage && a.theme ? 1 : 0;
      const bHasProfileAndTheme = b.profileImage && b.theme ? 1 : 0;
      return bHasProfileAndTheme - aHasProfileAndTheme;
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goToUserProfile(username: string): void {
    if (this.isUserEnabled(username)) {
      this.router.navigate(['/public-profile', username]);
    }
  }

  getThemeColor(theme: string): string {
    return this.themeColors[theme] || 'rgba(255, 255, 255, 0.7)';
  }

  isUserEnabled(username: string): boolean {
    const user = this.users.find(u => u.username === username);
    return user ? !!(user.profileImage && user.theme) : false;
  }
}