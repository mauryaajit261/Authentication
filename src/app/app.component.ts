import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  role: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.role = this.authService.getRole(); // Get user role
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
