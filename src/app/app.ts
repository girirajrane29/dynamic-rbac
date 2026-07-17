import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PermissionService } from './core/services/permission.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly authService = inject(AuthService);
  readonly permissionService = inject(PermissionService);
  readonly router = inject(Router);

  readonly showShell = computed(() => !['/login'].includes(this.router.url));
  isLoginPage = false;
  private currentRoute = '';

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
      this.isLoginPage = this.router.url === '/login';
    });
  }

  logout(): void {
    this.authService.logout();
    this.permissionService.clear();
    this.router.navigate(['/login']);
  }
}
