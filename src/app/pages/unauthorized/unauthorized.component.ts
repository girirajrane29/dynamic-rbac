import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="shell">
      <div class="card">
        <div class="icon">🚫</div>
        <p class="eyebrow">Access denied</p>
        <h2>Unauthorized</h2>
        <p class="message">You do not have permission to view this page.</p>
        <button type="button" (click)="goBack()">Go back</button>
      </div>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
      }
    `,
    `
      .card {
        width: min(460px, 100%);
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.14);
        border: 1px solid rgba(248, 113, 113, 0.2);
        text-align: center;
      }
    `,
    `
      .icon {
        display: inline-grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border-radius: 18px;
        font-size: 32px;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #f97316, #ef4444);
        box-shadow: 0 12px 30px rgba(239, 68, 68, 0.24);
      }
    `,
    `
      .eyebrow {
        margin: 0 0 8px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #f97316;
      }
    `,
    `
      h2 {
        margin: 0 0 10px;
        font-size: 28px;
        color: #0f172a;
      }
    `,
    `
      .message {
        margin: 0 0 20px;
        color: #64748b;
        line-height: 1.6;
      }
    `,
    `
      button {
        padding: 12px 18px;
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #f97316, #ef4444);
        color: white;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 24px rgba(239, 68, 68, 0.24);
      }
    `,
    `
      button:hover {
        transform: translateY(-1px);
      }
    `,
  ],
})
export class UnauthorizedComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(this.authService.isAuthenticated() ? ['/dashboard'] : ['/login']);
  }
}
