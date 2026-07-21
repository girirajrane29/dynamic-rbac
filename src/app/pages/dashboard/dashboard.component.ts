import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PermissionService } from '../../core/services/permission.service';
import { Permissions } from '../../core/constants/permissions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <div class="background-pattern"></div>

      <section class="hero-card">
        <div class="hero-content">
          <p class="eyebrow">Dashboard</p>
          <h2>Welcome back, {{ currentUser()?.name || 'Guest' }} 👋</h2>
          <p class="subtitle">
            {{ currentUser()?.alias || 'Secure access' }} ·
            {{ currentUser()?.isSuperAdmin ? 'Super Admin' : 'Role-based access' }}
          </p>
        </div>
        <div class="hero-badge">
          <div class="badge-inner">
            {{
              currentUser()?.isSuperAdmin
                ? 'SA'
                : (currentUser()?.alias?.slice(0, 2) || 'U').toUpperCase()
            }}
          </div>
          <div class="badge-glow"></div>
        </div>
      </section>

      @if (hasAnyModuleAccess()) {
        <div class="cards">
          @if (canAccess(Permissions.USER.VIEW)) {
            <a routerLink="/users" class="card" [class.card-blue]="true">
              <div class="card-header">
                <span class="card-icon">👤</span>
              </div>
              <div class="card-body">
                <span class="card-title">User Management</span>
                <span class="card-text">Manage users records, their details.</span>
              </div>
              <div class="card-footer">
                <span class="card-action">View Users →</span>
              </div>
            </a>
          }
          @if (canAccess(Permissions.EMPLOYEE.VIEW)) {
            <a routerLink="/employees" class="card" [class.card-purple]="true">
              <div class="card-header">
                <span class="card-icon">👨🏻‍💼</span>
              </div>
              <div class="card-body">
                <span class="card-title">Employee Management</span>
                <span class="card-text">Explore employee records and manage those records.</span>
              </div>
              <div class="card-footer">
                <span class="card-action">View Employees →</span>
              </div>
            </a>
          }
          @if (canAccess(Permissions.DRIVER.VIEW)) {
            <a routerLink="/drivers" class="card" [class.card-green]="true">
              <div class="card-header">
                <span class="card-icon">👨🏻‍✈️</span>
              </div>
              <div class="card-body">
                <span class="card-title">Driver Management</span>
                <span class="card-text">Review drivers and operational permissions.</span>
              </div>
              <div class="card-footer">
                <span class="card-action">View Drivers →</span>
              </div>
            </a>
          }
          @if (canAccess(Permissions.VEHICLE.VIEW)) {
            <a routerLink="/vehicles" class="card" [class.card-orange]="true">
              <div class="card-header">
                <span class="card-icon">🚙</span>
              </div>
              <div class="card-body">
                <span class="card-title">Vehicle Management</span>
                <span class="card-text">Track vehicles and access to transport resources.</span>
              </div>
              <div class="card-footer">
                <span class="card-action">View Vehicles →</span>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="empty-state">
          <div class="empty-icon-wrapper">
            <div class="empty-icon">🔒</div>
            <div class="empty-icon-glow"></div>
          </div>
          <h3>You don't have access to any module</h3>
          <p>Contact your administrator to request access to the available modules.</p>
          <button class="btn-contact">Request Access</button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .dashboard {
        position: relative;
        padding: 24px;
        background: linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%);
        min-height: calc(100vh - 72px);
        overflow: hidden;
      }
    `,
    `
      .background-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          radial-gradient(circle at 20% 50%, rgba(91, 124, 250, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.02) 0%, transparent 50%);
        pointer-events: none;
        z-index: 0;
      }
    `,
    `
      .hero-card {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 32px;
        border-radius: 24px;
        background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
        box-shadow:
          0 20px 50px rgba(15, 23, 42, 0.1),
          0 0 0 1px rgba(148, 163, 184, 0.1);
        margin-bottom: 28px;
        z-index: 1;
        overflow: hidden;
      }

      .hero-card::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(91, 124, 250, 0.05) 0%, transparent 70%);
        pointer-events: none;
      }
    `,
    `
      .hero-content {
        flex: 1;
        z-index: 1;
      }
    `,
    `
      .eyebrow {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #5b7cfa;
      }
    `,
    `
      h2 {
        margin: 0 0 10px;
        font-size: 32px;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.02em;
      }
    `,
    `
      .subtitle {
        margin: 0 0 20px;
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }
    `,
    `
      .hero-stats {
        display: flex;
        align-items: center;
        gap: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(148, 163, 184, 0.15);
      }
    `,
    `
      .stat-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
      }

      .stat-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #94a3b8;
      }
    `,
    `
      .stat-divider {
        width: 1px;
        height: 32px;
        background: linear-gradient(to bottom, transparent, rgba(148, 163, 184, 0.3), transparent);
      }
    `,
    `
      .hero-badge {
        position: relative;
        display: grid;
        place-items: center;
        width: 72px;
        height: 72px;
        border-radius: 20px;
        z-index: 1;
      }

      .badge-inner {
        position: relative;
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        border-radius: 16px;
        font-size: 22px;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, #1976d2, #3b82f6);
        box-shadow: 0 12px 28px rgba(25, 118, 210, 0.3);
        z-index: 2;
      }

      .badge-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 72px;
        height: 72px;
        border-radius: 20px;
        background: linear-gradient(135deg, #1976d2, #3b82f6);
        filter: blur(20px);
        opacity: 0.4;
        z-index: 0;
        animation: pulse 3s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.4;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          opacity: 0.6;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
    `,
    `
      .cards {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        z-index: 1;
        max-width: 100%;
      }

      .card {
        max-width: calc(50vw - 34px);
      }
    `,
    `
      .card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 28px;
        min-height: 200px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        text-decoration: none;
        color: #111827;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(148, 163, 184, 0.12);
        overflow: hidden;
      }

      .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #5b7cfa, #8b5cf6);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
      }

      .card:hover::before {
        opacity: 1;
      }
    `,
    `
      .card-blue::before {
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
      }

      .card-purple::before {
        background: linear-gradient(90deg, #8b5cf6, #a855f7);
      }

      .card-green::before {
        background: linear-gradient(90deg, #10b981, #22c55e);
      }

      .card-orange::before {
        background: linear-gradient(90deg, #f59e0b, #ef4444);
      }
    `,
    `
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      .card-icon {
        font-size: 44px;
        line-height: 1;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
      }

      .card-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(135deg, #64748b, #475569);
        box-shadow: 0 4px 12px rgba(71, 85, 105, 0.3);
      }
    `,
    `
      .card-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
      }

      .card-title {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.01em;
      }

      .card-text {
        font-size: 13px;
        color: #64748b;
        font-weight: 500;
        line-height: 1.6;
      }
    `,
    `
      .card-footer {
        padding-top: 12px;
        border-top: 1px solid rgba(148, 163, 184, 0.1);
      }

      .card-action {
        font-size: 13px;
        font-weight: 600;
        color: #5b7cfa;
        transition: color 0.2s ease;
      }

      .card:hover .card-action {
        color: #3b82f6;
      }
    `,
    `
      .empty-state {
        position: relative;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 60px 32px;
        min-height: 320px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.9);
        border: 2px dashed rgba(148, 163, 184, 0.3);
        box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8);
        z-index: 1;
      }
    `,
    `
      .empty-icon-wrapper {
        position: relative;
        margin-bottom: 20px;
      }

      .empty-icon {
        position: relative;
        font-size: 48px;
        z-index: 2;
      }

      .empty-icon-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%);
        filter: blur(20px);
        z-index: 1;
      }
    `,
    `
      .empty-state h3 {
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
      }

      .empty-state p {
        margin: 0 0 24px;
        font-size: 14px;
        color: #64748b;
        max-width: 400px;
        line-height: 1.6;
      }
    `,
    `
      .btn-contact {
        padding: 12px 24px;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #5b7cfa, #3b82f6);
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(91, 124, 250, 0.4);
        transition: all 0.3s ease;
      }

      .btn-contact:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(91, 124, 250, 0.5);
      }

      .btn-contact:active {
        transform: translateY(0);
      }
    `,
  ],
})
export class DashboardComponent {
  readonly Permissions = Permissions;
  private readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);

  currentUser() {
    return this.authService.currentUser();
  }

  hasAnyModuleAccess(): boolean {
    return (
      this.canAccess(Permissions.USER.VIEW) ||
      this.canAccess(Permissions.EMPLOYEE.VIEW) ||
      this.canAccess(Permissions.DRIVER.VIEW) ||
      this.canAccess(Permissions.VEHICLE.VIEW)
    );
  }

  canAccess(permission: string): boolean {
    const user = this.authService.currentUser();
    return this.permissionService.canAccess(user, permission);
  }

  getAccessibleModulesCount(): number {
    let count = 0;
    if (this.canAccess(Permissions.USER.VIEW)) count++;
    if (this.canAccess(Permissions.EMPLOYEE.VIEW)) count++;
    if (this.canAccess(Permissions.DRIVER.VIEW)) count++;
    if (this.canAccess(Permissions.VEHICLE.VIEW)) count++;
    return count;
  }
}
