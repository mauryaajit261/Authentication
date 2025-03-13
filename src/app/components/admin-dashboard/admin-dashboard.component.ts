import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  newUser = '';
  newPassword = '';
  users: { username: string, role: string }[] = [];
  errorMessage = '';
  successMessage = '';
  
  // Admin permissions
  permissions = {
    add: false,
    delete: false,
    view: false,
    update: false
  };
  
  // Organization assigned to
  organization = '';
  adminUsername = '';
  
  // Dummy data for testing
  dummyItems = [
    { id: 1, name: 'Item 1', description: 'Description for item 1', status: 'Active' },
    { id: 2, name: 'Item 2', description: 'Description for item 2', status: 'Inactive' },
    { id: 3, name: 'Item 3', description: 'Description for item 3', status: 'Active' }
  ];
  
  // For adding new items
  newItemName = '';
  newItemDescription = '';
  
  // For updating items
  editingItem: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Get current admin user
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.role === 'admin') {
      this.adminUsername = currentUser.username;
      
      // Get admin permissions
      const adminPermissions = this.authService.getAdminPermissions(this.adminUsername);
      if (adminPermissions) {
        this.permissions = {
          add: adminPermissions.add,
          delete: adminPermissions.delete,
          view: adminPermissions.view,
          update: adminPermissions.update
        };
        this.organization = adminPermissions.organization;
      }
      
      // Load users if admin has view permission
      if (this.permissions.view) {
        this.loadUsers();
      }
    }
  }

  loadUsers() {
    this.users = this.authService.getAllUsers();
  }

  addUser() {
    // Check if admin has add permission
    if (!this.permissions.add) {
      this.errorMessage = 'You do not have permission to add users';
      this.successMessage = '';
      return;
    }
    
    if (this.newUser.trim() !== '' && this.newPassword.trim() !== '') {
      const success = this.authService.addUser(this.newUser, this.newPassword);
      
      if (success) {
        this.successMessage = `User ${this.newUser} added successfully`;
        this.errorMessage = '';
        this.newUser = '';
        this.newPassword = '';
        this.loadUsers(); // Refresh the user list
      } else {
        this.errorMessage = `User ${this.newUser} already exists`;
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Username and password are required';
      this.successMessage = '';
    }
  }

  removeUser(userName: string) {
    // Check if admin has delete permission
    if (!this.permissions.delete) {
      this.errorMessage = 'You do not have permission to remove users';
      this.successMessage = '';
      return;
    }
    
    // For now, we'll just filter the local array
    // In a real application, you would call a service method to remove the user
    this.users = this.users.filter(user => user.username !== userName);
    this.successMessage = `User ${userName} removed successfully`;
    this.errorMessage = '';
  }

  updateUser(userName: string) {
    // Check if admin has update permission
    if (!this.permissions.update) {
      this.errorMessage = 'You do not have permission to update users';
      this.successMessage = '';
      return;
    }
    
    // This is a placeholder for update functionality
    this.successMessage = `User ${userName} updated successfully`;
    this.errorMessage = '';
  }
  
  // Dummy data methods for testing permissions
  addItem() {
    // Check if admin has add permission
    if (!this.permissions.add) {
      this.errorMessage = 'You do not have permission to add items';
      this.successMessage = '';
      return;
    }
    
    if (this.newItemName.trim() !== '' && this.newItemDescription.trim() !== '') {
      const newId = this.dummyItems.length > 0 ? Math.max(...this.dummyItems.map(item => item.id)) + 1 : 1;
      
      this.dummyItems.push({
        id: newId,
        name: this.newItemName,
        description: this.newItemDescription,
        status: 'Active'
      });
      
      this.successMessage = `Item ${this.newItemName} added successfully`;
      this.errorMessage = '';
      this.newItemName = '';
      this.newItemDescription = '';
    } else {
      this.errorMessage = 'Item name and description are required';
      this.successMessage = '';
    }
  }
  
  deleteItem(id: number) {
    // Check if admin has delete permission
    if (!this.permissions.delete) {
      this.errorMessage = 'You do not have permission to delete items';
      this.successMessage = '';
      return;
    }
    
    const itemIndex = this.dummyItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const itemName = this.dummyItems[itemIndex].name;
      this.dummyItems.splice(itemIndex, 1);
      this.successMessage = `Item ${itemName} deleted successfully`;
      this.errorMessage = '';
    }
  }
  
  startEditItem(item: any) {
    // Check if admin has update permission
    if (!this.permissions.update) {
      this.errorMessage = 'You do not have permission to update items';
      this.successMessage = '';
      return;
    }
    
    this.editingItem = { ...item };
  }
  
  cancelEdit() {
    this.editingItem = null;
  }
  
  saveItemEdit() {
    // Check if admin has update permission
    if (!this.permissions.update) {
      this.errorMessage = 'You do not have permission to update items';
      this.successMessage = '';
      return;
    }
    
    const itemIndex = this.dummyItems.findIndex(item => item.id === this.editingItem.id);
    if (itemIndex !== -1) {
      this.dummyItems[itemIndex] = { ...this.editingItem };
      this.successMessage = `Item ${this.editingItem.name} updated successfully`;
      this.errorMessage = '';
      this.editingItem = null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
