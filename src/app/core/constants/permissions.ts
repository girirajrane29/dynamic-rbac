export const Permissions = {
  USER: {
    VIEW: 'user_management.view',
    CREATE: 'user_management.create',
    UPDATE: 'user_management.update',
    DELETE: 'user_management.delete',
  },
  EMPLOYEE: {
    VIEW: 'employee_management.view',
    CREATE: 'employee_management.create',
    UPDATE: 'employee_management.update',
    DELETE: 'employee_management.delete',
  },
  DRIVER: {
    VIEW: 'driver_management.view',
    CREATE: 'driver_management.create',
    UPDATE: 'driver_management.update',
    DELETE: 'driver_management.delete',
  },
  VEHICLE: {
    VIEW: 'vehicle_management.view',
    CREATE: 'vehicle_management.create',
    UPDATE: 'vehicle_management.update',
    DELETE: 'vehicle_management.delete',
  },
} as const;
