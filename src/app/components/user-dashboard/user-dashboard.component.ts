import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  username = '';

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getUser();
    this.username = user.username;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
