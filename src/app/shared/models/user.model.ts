export interface PermissionMap {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface ModulePermissions {
  user_management: PermissionMap;
  employee_management: PermissionMap;
  driver_management: PermissionMap;
  vehicle_management: PermissionMap;
}

export interface AppUser {
  id: string;
  name: string;
  alias: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  permissions: ModulePermissions;
  createdAt: string;
}
