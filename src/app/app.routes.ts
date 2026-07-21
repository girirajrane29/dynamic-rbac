import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AccessManagementComponent } from './pages/access-management/access-management.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { permissionGuard } from './core/guards/permission.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Permissions } from './core/constants/permissions';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Guest-only routes (accessible only when NOT logged in)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'manageaccess',
    component: AccessManagementComponent,
    canActivate: [guestGuard],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [permissionGuard] },
  {
    path: 'users',
    loadComponent: () => import('./pages/user/user.component').then((m) => m.UserComponent),
    canActivate: [permissionGuard],
    data: { permission: Permissions.USER.VIEW },
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./pages/employee/employee.component').then((m) => m.EmployeeComponent),
    canActivate: [permissionGuard],
    data: { permission: Permissions.EMPLOYEE.VIEW },
  },
  {
    path: 'drivers',
    loadComponent: () => import('./pages/driver/driver.component').then((m) => m.DriverComponent),
    canActivate: [permissionGuard],
    data: { permission: Permissions.DRIVER.VIEW },
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./pages/vehicle/vehicle.component').then((m) => m.VehicleComponent),
    canActivate: [permissionGuard],
    data: { permission: Permissions.VEHICLE.VIEW },
  },
  { path: '**', redirectTo: 'unauthorized' },
];
