import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { PermissionService } from '../../core/services/permission.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="card">
        <div class="brand-badge">🔐</div>
        <div class="heading-block">
          <p class="eyebrow">Secure access</p>
          <h2>Welcome back</h2>
          <p class="subtitle">Sign in to continue to the RBAC dashboard.</p>
        </div>

        @if (formError) {
          <div class="error-banner">{{ formError }}</div>
        }

        <form (ngSubmit)="login()" novalidate>
          <label for="email">Email address</label>
          <input
            id="email"
            [(ngModel)]="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
            (input)="onEmailInput()"
          />
          @if (emailError) {
            <p class="field-error">{{ emailError }}</p>
          }

          <label for="password">Password</label>
          <input
            id="password"
            [(ngModel)]="password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            required
          />
          @if (passwordError) {
            <p class="field-error">{{ passwordError }}</p>
          }

          <button type="submit">Sign In</button>
        </form>

        <div class="info-row">
          <span>Need a demo account?</span>
          <a routerLink="/manageaccess">Create one</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }
    `,
    `
      .card {
        width: min(460px, 100%);
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
        border: 1px solid rgba(148, 163, 184, 0.16);
        backdrop-filter: blur(14px);
      }
    `,
    `
      .brand-badge {
        display: inline-grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        font-size: 24px;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #1976d2, #3b82f6);
        box-shadow: 0 10px 30px rgba(25, 118, 210, 0.25);
      }
    `,
    `
      .heading-block {
        margin-bottom: 20px;
      }
    `,
    `
      .eyebrow {
        margin: 0 0 6px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #5b7cfa;
      }
    `,
    `
      h2 {
        margin: 0 0 8px;
        font-size: 28px;
        color: #0f172a;
      }
    `,
    `
      .subtitle {
        margin: 0;
        color: #64748b;
        line-height: 1.5;
      }
    `,
    `
      .error-banner {
        margin-bottom: 16px;
        padding: 10px 12px;
        border-radius: 12px;
        background: #fef2f2;
        color: #b42318;
        border: 1px solid #fecaca;
        font-size: 14px;
      }
    `,
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
    `
      label {
        font-size: 13px;
        font-weight: 600;
        color: #334155;
      }
    `,
    `
      input {
        padding: 12px 14px;
        border: 1px solid #dbe4f0;
        border-radius: 12px;
        font-size: 15px;
        color: #0f172a;
        background: #f8fbff;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }
    `,
    `
      input:focus {
        outline: none;
        border-color: #1976d2;
        box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.12);
      }
    `,
    `
      .field-error {
        margin: -2px 0 2px;
        font-size: 12px;
        color: #c2410c;
      }
    `,
    `
      button {
        margin-top: 6px;
        padding: 12px 16px;
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #1976d2, #2563eb);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.24);
      }
    `,
    `
      button:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
      }
    `,
    `
      .info-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        margin-top: 16px;
        font-size: 13px;
        color: #64748b;
      }
    `,
    `
      .info-row a {
        color: #2563eb;
        font-weight: 600;
        text-decoration: none;
      }
    `,
    `
      .info-row a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LoginComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  formError = '';
  emailError = '';
  passwordError = '';
  private readonly emailInput$ = new Subject<string>();
  private readonly emailInputSubscription = this.emailInput$
    .pipe(debounceTime(600))
    .subscribe((value) => {
      const trimmedEmail = value.trim();

      if (!trimmedEmail) {
        this.emailError = 'Email is required.';
        return;
      }

      this.emailError = this.isValidEmail(trimmedEmail)
        ? ''
        : 'Please enter a valid email address.';
    });

  login(): void {
    this.formError = '';
    this.emailError = '';
    this.passwordError = '';

    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedEmail) {
      this.emailError = 'Email is required.';
      return;
    }

    if (!this.isValidEmail(trimmedEmail)) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }

    if (!trimmedPassword) {
      this.passwordError = 'Password is required.';
      return;
    }

    const user = this.authService.login(trimmedEmail, trimmedPassword);
    if (user) {
      this.permissionService.initialize(user);
      this.router.navigate(['/dashboard']);
      return;
    }

    this.formError = 'Invalid email or password. Please try again.';
  }

  onEmailInput(): void {
    this.formError = '';
    this.emailInput$.next(this.email);
  }

  ngOnDestroy(): void {
    this.emailInputSubscription.unsubscribe();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
