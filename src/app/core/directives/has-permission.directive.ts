import { Directive, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

interface PermissionInput {
  mode?: 'all' | 'any';
  permissions: string | string[];
}

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private currentInput: PermissionInput | null = null;

  @Input() set appHasPermission(value: PermissionInput | string | string[]) {
    if (typeof value === 'string' || Array.isArray(value)) {
      this.currentInput = { mode: 'all', permissions: value };
    } else {
      this.currentInput = value;
    }
    this.updateVisibility();
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
    private permissionService: PermissionService,
  ) {
    effect(() => {
      this.updateVisibility();
    });
  }

  private updateVisibility(): void {
    this.viewContainer.clear();

    const user = this.authService.currentUser();
    if (!user) {
      return;
    }

    if (user.isSuperAdmin) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    if (!this.currentInput) {
      return;
    }

    const permissions = Array.isArray(this.currentInput.permissions)
      ? this.currentInput.permissions
      : [this.currentInput.permissions];

    const allowed =
      this.currentInput.mode === 'any'
        ? permissions.some((entry) => this.permissionService.hasPermission(entry))
        : permissions.every((entry) => this.permissionService.hasPermission(entry));

    if (allowed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
