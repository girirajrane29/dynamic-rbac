import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const currentUser = authService.currentUser();
  const permission = route.data['permission'] as string | undefined;

  if (!currentUser) {
    authService.logout();
    permissionService.clear();
    router.navigate(['/login']);
    return false;
  }

  if (currentUser.isSuperAdmin) {
    return true;
  }

  if (!permission) {
    return true;
  }

  const allowed = permissionService.canAccess(currentUser, permission);
  if (!allowed) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
