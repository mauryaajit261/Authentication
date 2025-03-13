import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { OrganizationManagementComponent } from './components/organization-management/organization-management.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard} from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'super-admin-dashboard', component: SuperAdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'superadmin' }},
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' }},
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'user' }},
  { path: 'organization-management', component: OrganizationManagementComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'superadmin' }},
  { path: 'system-logs', component: SystemLogsComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'superadmin' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
