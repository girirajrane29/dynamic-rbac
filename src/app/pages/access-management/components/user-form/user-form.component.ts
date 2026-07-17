import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  @Input() form!: FormGroup;
  @Input() editing = false;
  @Input() modules: Array<{ key: string; name: string; permissions: Record<string, boolean> }> = [];
  @Output() submitForm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() togglePermission = new EventEmitter<{
    moduleKey: string;
    permissionKey: string;
    event: Event;
  }>();
  @Output() selectAllPermissions = new EventEmitter<{ moduleKey: string; event: Event }>();

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  showPasswordMismatch(): boolean {
    const confirmControl = this.form.get('confirmPassword');
    const passwordControl = this.form.get('password');

    if (!confirmControl || !passwordControl) {
      return false;
    }

    return (
      confirmControl.touched &&
      passwordControl.value !== '' &&
      confirmControl.value !== '' &&
      passwordControl.value !== confirmControl.value
    );
  }

  isModuleFullySelected(module: { permissions: Record<string, boolean> }): boolean {
    return ['view', 'create', 'update', 'delete'].every(
      (permissionKey) => module.permissions[permissionKey],
    );
  }
}
