import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/NavbarComponent/navbar.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    AdminNavbarComponent
  ],
  template: `
    <app-admin-navbar *ngIf="showAdminNav"></app-admin-navbar>
    <app-navbar *ngIf="showUserNav"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  showAdminNav: boolean = false;
  showUserNav: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Don't show any nav on login or register pages
        const isAuthPage = event.url === '/login' || event.url === '/register';
        if (!isAuthPage) {
          this.showAdminNav = this.authService.isAdmin();
          this.showUserNav = !this.showAdminNav && this.authService.isLoggedIn();
        } else {
          this.showAdminNav = false;
          this.showUserNav = false;
        }
      }
    });
  }
}
