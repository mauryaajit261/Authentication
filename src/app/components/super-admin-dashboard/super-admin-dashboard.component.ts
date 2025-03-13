import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: false,
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  newOrganization = '';
  organizations: { name: string, admins: string[] }[] = [];
  admins: { username: string, organization: string }[] = [];
  
  // For admin assignment
  selectedOrg: string = '';
  selectedAdmin: string = '';
  permissions = {
    add: false,
    delete: false,
    view: false,
    update: false
  };
  
  // For adding new admin
  newAdminUsername = '';
  newAdminPassword = '';
  
  // Tab management
  activeTab: string = 'add-admin';
  
  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadOrganizations();
    this.loadAdmins();
  }

  loadOrganizations() {
    this.organizations = this.authService.getOrganizations();
  }

  loadAdmins() {
    this.admins = this.authService.getAdmins();
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  addOrganization() {
    if (this.newOrganization.trim() !== '') {
      const success = this.authService.addOrganization(this.newOrganization);
      
      if (success) {
        this.successMessage = `Organization ${this.newOrganization} added successfully`;
        this.errorMessage = '';
        this.newOrganization = '';
        this.loadOrganizations();
      } else {
        this.errorMessage = `Organization ${this.newOrganization} already exists`;
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Organization name is required';
      this.successMessage = '';
    }
  }

  addAdmin() {
    if (this.newAdminUsername.trim() !== '' && this.newAdminPassword.trim() !== '') {
      const success = this.authService.addAdmin(this.newAdminUsername, this.newAdminPassword);
      
      if (success) {
        this.successMessage = `Admin ${this.newAdminUsername} added successfully`;
        this.errorMessage = '';
        this.newAdminUsername = '';
        this.newAdminPassword = '';
        this.loadAdmins();
      } else {
        this.errorMessage = `Admin ${this.newAdminUsername} already exists`;
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Admin username and password are required';
      this.successMessage = '';
    }
  }

  assignAdmin() {
    if (this.selectedOrg && this.selectedAdmin) {
      const success = this.authService.assignAdminToOrganization(
        this.selectedOrg,
        this.selectedAdmin,
        this.permissions
      );
      
      if (success) {
        this.successMessage = `Admin ${this.selectedAdmin} assigned to ${this.selectedOrg} with permissions`;
        this.errorMessage = '';
        this.loadOrganizations();
        this.loadAdmins();
        this.resetAssignmentForm();
      } else {
        this.errorMessage = 'Failed to assign admin to organization';
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Please select both organization and admin';
      this.successMessage = '';
    }
  }

  resetAssignmentForm() {
    this.selectedOrg = '';
    this.selectedAdmin = '';
    this.permissions = {
      add: false,
      delete: false,
      view: false,
      update: false
    };
  }

  viewLogs() {
    this.router.navigate(['/system-logs']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
