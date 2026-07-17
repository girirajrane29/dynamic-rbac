import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { AppUser } from '../../shared/models/user.model';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';

@Component({
  selector: 'app-access-management',
  standalone: true,
  imports: [ReactiveFormsModule, UserListComponent, UserFormComponent],
  templateUrl: './access-management.component.html',
  styleUrl: './access-management.component.scss',
})
export class AccessManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  form: FormGroup;
  users: AppUser[] = [];
  editing = false;
  editingId: string | null = null;
  showForm = false;
  modules = [
    {
      key: 'user_management',
      name: 'User Management',
      permissions: { view: false, create: false, update: false, delete: false },
    },
    {
      key: 'employee_management',
      name: 'Employee Management',
      permissions: { view: false, create: false, update: false, delete: false },
    },
    {
      key: 'driver_management',
      name: 'Driver Management',
      permissions: { view: false, create: false, update: false, delete: false },
    },
    {
      key: 'vehicle_management',
      name: 'Vehicle Management',
      permissions: { view: false, create: false, update: false, delete: false },
    },
  ];

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      alias: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  startCreate(): void {
    this.editing = false;
    this.editingId = null;
    this.showForm = true;
    this.resetFormState();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    const values = this.form.value;
    const user: AppUser = {
      id: this.editingId ?? `USR-${Date.now()}`,
      name: values.name,
      alias: values.alias,
      email: values.email,
      password: this.authService.encrypt(values.password),
      isSuperAdmin: false,
      permissions: this.buildPermissions(),
      createdAt: new Date().toISOString(),
    };

    if (this.editing) {
      this.userService.updateUser(user);
    } else {
      this.userService.createUser(user);
    }

    this.showForm = false;
    this.loadUsers();
    this.resetFormState();
  }

  editUser(user: AppUser): void {
    this.editing = true;
    this.editingId = user.id;
    this.showForm = true;
    this.form.patchValue({
      name: user.name,
      alias: user.alias,
      email: user.email,
      password: this.authService.decrypt(user.password),
      confirmPassword: this.authService.decrypt(user.password),
    });
    this.modules = this.modules.map((module) => ({
      ...module,
      permissions: { ...user.permissions[module.key as keyof typeof user.permissions] },
    }));
  }

  cancelForm(): void {
    this.showForm = false;
    this.resetFormState();
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id);
    this.loadUsers();
  }

  toggle(moduleKey: string, permissionKey: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const module = this.modules.find((entry) => entry.key === moduleKey);
    if (!module) return;

    module.permissions[permissionKey as keyof typeof module.permissions] = checked;

    if (permissionKey !== 'view' && checked) {
      module.permissions.view = true;
    }
    if (permissionKey === 'view' && !checked) {
      module.permissions.create = false;
      module.permissions.update = false;
      module.permissions.delete = false;
    }
  }

  toggleAll(moduleKey: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const module = this.modules.find((entry) => entry.key === moduleKey);
    if (!module) return;

    Object.keys(module.permissions).forEach((permissionKey) => {
      module.permissions[permissionKey as keyof typeof module.permissions] = checked;
    });
  }

  private buildPermissions(): any {
    return this.modules.reduce(
      (acc, module) => {
        acc[module.key] = module.permissions;
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  private resetFormState(): void {
    this.editing = false;
    this.editingId = null;
    this.form.reset();
    this.modules = [
      {
        key: 'user_management',
        name: 'User Management',
        permissions: { view: false, create: false, update: false, delete: false },
      },
      {
        key: 'employee_management',
        name: 'Employee Management',
        permissions: { view: false, create: false, update: false, delete: false },
      },
      {
        key: 'driver_management',
        name: 'Driver Management',
        permissions: { view: false, create: false, update: false, delete: false },
      },
      {
        key: 'vehicle_management',
        name: 'Vehicle Management',
        permissions: { view: false, create: false, update: false, delete: false },
      },
    ];
  }
}
