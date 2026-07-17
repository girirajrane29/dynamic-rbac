import { Injectable, signal } from '@angular/core';
import { Permissions } from '../constants/permissions';
import { AppUser } from '../../shared/models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  readonly permissionSet = signal<Set<string>>(new Set());

  constructor(private authService: AuthService) {
    const user = this.authService.currentUser();
    if (user) {
      this.initialize(user);
    }
  }

  initialize(user: AppUser): void {
    const permissions = user.permissions;
    const values = new Set<string>();

    Object.entries(permissions).forEach(([moduleKey, moduleValue]) => {
      Object.entries(moduleValue).forEach(([key, enabled]) => {
        if (enabled) {
          values.add(`${moduleKey}.${key}`);
        }
      });
    });

    this.permissionSet.set(values);
  }

  hasPermission(permission: string): boolean {
    return this.permissionSet().has(permission);
  }

  hasAllPermissions(...permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  hasAnyPermission(...permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  canAccess(user: AppUser | null, permission: string): boolean {
    if (!user) {
      return false;
    }

    if (user.isSuperAdmin) {
      return true;
    }

    return this.hasPermission(permission);
  }

  clear(): void {
    this.permissionSet.set(new Set());
  }
}
