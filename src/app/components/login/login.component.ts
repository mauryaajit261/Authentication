import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  role: string = ''; // Fix: Define role property
  errorMessage: string = ''; // Fix: Define errorMessage property

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // First authenticate the user with the provided credentials and role
    if (this.authService.authenticate(this.username, this.password, this.role)) {
      const userRole = this.authService.getRole();

      // Redirect user based on role
      if (userRole === 'superadmin') {
        this.router.navigate(['/super-admin-dashboard']);
      } else if (userRole === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (userRole === 'user') {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.errorMessage = 'Invalid username, password, or role!';
    }
  }
}
