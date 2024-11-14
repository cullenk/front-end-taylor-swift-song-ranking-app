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
  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 20; // Number of users per page

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

loadUsers(page: number = this.currentPage): void {
    this.userProfileService.getAllPublicProfiles(page, this.limit).subscribe(
        response => {
            this.users = response.users; // No need to filter here based on topThirteen
            this.totalCount = response.totalCount;
            this.currentPage = page;
            this.totalPages = Math.ceil(this.totalCount / this.limit);
            this.filteredUsers = this.users; // Initialize filteredUsers with all users initially
        },
        error => {
            console.error('Error fetching user profiles:', error);
        }
    );
}

filterUsers(): void {
    if (this.searchTerm.trim() === '') {
        // If search term is empty reset filtered users to all users
        this.filteredUsers = this.users;
    } else {
        // Fetch all users for searching
        this.userProfileService.getAllPublicProfilesWithoutPagination().subscribe(allUsers => {
            // Filter through all users based on the search term
            this.filteredUsers = allUsers.filter(user =>
                user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        });
    }
}

goToUserProfile(username: string): void {
    this.router.navigate(['/public-profile', username]);
}

nextPage(): void {
    if (this.currentPage < this.totalPages) {
        this.loadUsers(this.currentPage + 1);
    }
}

previousPage(): void {
    if (this.currentPage > 1) {
        this.loadUsers(this.currentPage - 1);
    }
}

getThemeColor(theme: string): string {
     return this.themeColors[theme] || 'rgba(255,255,255,0.7)';
}
}