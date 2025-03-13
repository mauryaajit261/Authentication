import { Component } from '@angular/core';

@Component({
  selector: 'app-organization-management',
  standalone: false,
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.css']
})
export class OrganizationManagementComponent {
  newOrg = '';
  organizations: { name: string }[] = [];

  addOrg() {
    if (this.newOrg.trim() !== '') {
      this.organizations.push({ name: this.newOrg });
      this.newOrg = '';
    }
  }

  deleteOrg(orgName: string) {
    this.organizations = this.organizations.filter(org => org.name !== orgName);
  }
}
