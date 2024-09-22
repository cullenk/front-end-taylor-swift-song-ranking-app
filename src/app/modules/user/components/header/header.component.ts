import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private 'authenticationSub': Subscription;
  userAuthenticated = false;
  isMobileMenuOpen = false;

  constructor(private AuthService: AuthService) { }

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.AuthService.getIsAuthenticated();
    this.authenticationSub = this.AuthService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout(){
    this.AuthService.logout()
  }

}
