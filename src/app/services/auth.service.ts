import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'superadmin', password: 'admin123', role: 'superadmin' },
    { username: 'admin', password: 'admin123', role: 'admin', permissions: { add: true, delete: true, view: true, update: true }, organization: '' },
    { username: 'user', password: 'user123', role: 'user' }
  ];

  private organizations: { name: string, admins: string[] }[] = [
    { name: 'Test Organization', admins: [] },
    { name: 'Finance Department', admins: [] }
  ];

  // Dummy data for testing
  private dummyUsers = [
    { username: 'john', password: 'pass123', role: 'user' },
    { username: 'sarah', password: 'pass123', role: 'user' },
    { username: 'mike', password: 'pass123', role: 'user' }
  ];

  private loggedInUser: any = null;

  constructor() {
    // Initialize with some dummy data if localStorage is empty
    if (!localStorage.getItem('appInitialized')) {
      // Add dummy users to the users array
      this.dummyUsers.forEach(user => {
        this.users.push(user);
      });
      
      localStorage.setItem('appInitialized', 'true');
    }
  }

  authenticate(username: string, password: string, role: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      this.loggedInUser = user;
      localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store user session
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('loggedInUser') !== null;
  }

  getUser(): any {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  logout() {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser'); // Remove user session
  }

  // Add a new method to get all users
  getAllUsers(): { username: string, role: string }[] {
    return this.users.map(user => ({ username: user.username, role: user.role }));
  }

  // Add a new method to add a user
  addUser(username: string, password: string, role: string = 'user'): boolean {
    // Check if user already exists
    if (this.users.some(u => u.username === username)) {
      return false;
    }
    
    // Add the new user
    this.users.push({ username, password, role });
    return true;
  }

  // Add a new method to add an admin
  addAdmin(username: string, password: string): boolean {
    // Check if admin already exists
    if (this.users.some(u => u.username === username)) {
      return false;
    }
    
    // Add the new admin with default permissions (all false)
    this.users.push({ 
      username, 
      password, 
      role: 'admin',
      permissions: { add: false, delete: false, view: false, update: false },
      organization: ''
    });
    
    return true;
  }

  // Organization management methods
  addOrganization(name: string): boolean {
    if (this.organizations.some(org => org.name === name)) {
      return false;
    }
    
    this.organizations.push({ name, admins: [] });
    return true;
  }

  getOrganizations(): { name: string, admins: string[] }[] {
    return [...this.organizations];
  }

  // Admin assignment methods
  assignAdminToOrganization(orgName: string, adminUsername: string, permissions: { add: boolean, delete: boolean, view: boolean, update: boolean }): boolean {
    // Find the organization
    const orgIndex = this.organizations.findIndex(org => org.name === orgName);
    if (orgIndex === -1) return false;
    
    // Find the admin user
    const userIndex = this.users.findIndex(user => user.username === adminUsername && user.role === 'admin');
    if (userIndex === -1) return false;
    
    // Assign admin to organization
    if (!this.organizations[orgIndex].admins.includes(adminUsername)) {
      this.organizations[orgIndex].admins.push(adminUsername);
    }
    
    // Update admin permissions
    this.users[userIndex].permissions = permissions;
    this.users[userIndex].organization = orgName;
    
    return true;
  }

  // Get admin permissions
  getAdminPermissions(adminUsername: string): { add: boolean, delete: boolean, view: boolean, update: boolean, organization: string } | null {
    const admin = this.users.find(user => user.username === adminUsername && user.role === 'admin');
    if (!admin || !admin.permissions) return null;
    
    return { 
      add: admin.permissions.add, 
      delete: admin.permissions.delete, 
      view: admin.permissions.view, 
      update: admin.permissions.update,
      organization: admin.organization || ''
    };
  }

  // Get admins
  getAdmins(): { username: string, organization: string }[] {
    return this.users
      .filter(user => user.role === 'admin')
      .map(admin => ({ 
        username: admin.username, 
        organization: admin.organization || ''
      }));
  }
}
