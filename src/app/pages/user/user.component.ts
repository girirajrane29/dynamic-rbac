import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RuntimeDataService } from '../../core/services/runtime-data.service';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { Permissions } from '../../core/constants/permissions';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  template: `
    <div class="page">
      <div class="background-pattern"></div>

      <section class="hero-card">
        <button type="button" class="btn-back" (click)="goBack()" title="Go back">
          <span class="back-icon">{{ '←' }}</span>
        </button>
        <div class="hero-content">
          <p class="eyebrow">User Management</p>
          <h2>Manage Users</h2>
          <p class="subtitle">Manage user records and permissions</p>
        </div>
        <div class="hero-badge">
          <div class="badge-inner">UM</div>
          <div class="badge-glow"></div>
        </div>
      </section>

      @if (showForm) {
        <form class="card form-card" (ngSubmit)="save()">
          <div class="form-header">
            <h3>{{ editingId ? 'Edit User' : 'Create New User' }}</h3>
            <p class="form-subtitle">Fill in the details below</p>
          </div>
          <div class="form-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                [(ngModel)]="form.name"
                name="name"
                id="name"
                placeholder="Enter user name"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <input
                [(ngModel)]="form.description"
                name="description"
                id="description"
                placeholder="Enter description"
                class="form-input"
              />
            </div>
          </div>
          <div class="form-footer">
            <button type="button" class="btn-cancel" (click)="toggleForm()">Cancel</button>
            <button type="submit" class="btn-submit">
              <span>{{ editingId ? 'Update User' : 'Create User' }}</span>
            </button>
          </div>
        </form>
      } @else {
        <div class="card table-card">
          <div class="table-header">
            <h3>All Users</h3>
            <div class="table-header-actions">
              <span class="record-count">{{ items().length }} records</span>
              <button
                type="button"
                class="btn-primary"
                (click)="toggleForm()"
                *appHasPermission="Permissions.USER.CREATE"
              >
                <span class="btn-icon">+</span>
                <span>Create User</span>
              </button>
            </div>
          </div>
          @if (items().length === 0) {
            <div class="empty-state">
              <div class="empty-icon-wrapper">
                <div class="empty-icon">👤</div>
                <div class="empty-icon-glow"></div>
              </div>
              <h3>No users found</h3>
              <p>Get started by creating your first user record.</p>
            </div>
          } @else {
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th
                      *appHasPermission="{
                        mode: 'any',
                        permissions: [Permissions.USER.UPDATE, Permissions.USER.DELETE],
                      }"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of items(); track item.id) {
                    <tr>
                      <td>
                        <div class="cell-content">
                          <span class="cell-text">{{ item.name }}</span>
                        </div>
                      </td>
                      <td>{{ item.description }}</td>
                      <td>
                        <div class="action-buttons">
                          <button
                            type="button"
                            class="btn-action btn-edit"
                            (click)="edit(item)"
                            *appHasPermission="Permissions.USER.UPDATE"
                            title="Edit"
                          >
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            class="btn-action btn-delete"
                            (click)="remove(item.id)"
                            *appHasPermission="Permissions.USER.DELETE"
                            title="Delete"
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .page {
        position: relative;
        padding: 24px;
        display: flex;
        flex-direction: column;
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

      .btn-back {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 2;
      }

      .btn-back:hover {
        opacity: 0.7;
      }

      .back-icon {
        font-size: 32px;
        font-weight: 700;
        color: #64748b;
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

      .hero-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        z-index: 1;
      }

      .eyebrow {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #5b7cfa;
      }

      .hero-card h2 {
        margin: 0 0 10px;
        font-size: 32px;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.02em;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }

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
      .card {
        position: relative;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
      }

      .form-card {
        padding: 32px;
        box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
        border: 1px solid rgba(148, 163, 184, 0.12);
        z-index: 1;
      }

      .table-card {
        padding: 24px;
        box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
        border: 1px solid rgba(148, 163, 184, 0.12);
        z-index: 1;
      }
    `,
    `
      .form-header {
        margin-bottom: 24px;
      }

      .form-header h3 {
        margin: 0 0 8px;
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
      }

      .form-subtitle {
        margin: 0;
        font-size: 14px;
        color: #64748b;
      }
    `,
    `
      .form-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 24px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group label {
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .form-input {
        padding: 12px 16px;
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 10px;
        font-size: 14px;
        color: #0f172a;
        background: #fff;
        transition: all 0.2s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #5b7cfa;
        box-shadow: 0 0 0 3px rgba(91, 124, 250, 0.1);
      }

      .form-input::placeholder {
        color: #94a3b8;
      }
    `,
    `
      .form-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .btn-cancel {
        padding: 12px 24px;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        background: rgba(148, 163, 184, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-cancel:hover {
        background: rgba(148, 163, 184, 0.2);
        transform: translateY(-2px);
      }

      .btn-submit {
        padding: 12px 24px;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #10b981, #22c55e);
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        transition: all 0.3s ease;
      }

      .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
      }

      .btn-submit:active {
        transform: translateY(0);
      }
    `,
    `
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .table-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
      }

      .table-header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .record-count {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        background: rgba(148, 163, 184, 0.1);
      }

      .btn-primary {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
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

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(91, 124, 250, 0.5);
      }

      .btn-primary:active {
        transform: translateY(0);
      }

      .btn-icon {
        font-size: 18px;
        font-weight: 700;
      }
    `,
    `
      .table-wrapper {
        overflow-x: auto;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
      }

      .data-table th {
        padding: 16px;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #64748b;
        border-bottom: 2px solid rgba(148, 163, 184, 0.2);
      }

      .data-table td {
        padding: 16px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        color: #475569;
      }

      .data-table tbody tr:hover {
        background: rgba(91, 124, 250, 0.03);
      }
    `,
    `
      .cell-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .cell-icon {
        font-size: 24px;
      }

      .cell-text {
        font-weight: 600;
        color: #0f172a;
      }
    `,
    `
      .action-buttons {
        display: flex;
        gap: 8px;
      }

      .btn-action {
        display: grid;
        place-items: center;
        height: 36px;
        padding: 8px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-edit {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }

      .btn-edit:hover {
        background: rgba(59, 130, 246, 0.2);
        transform: scale(1.1);
      }

      .btn-delete {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }

      .btn-delete:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
      }
    `,
    `
      .empty-state {
        display: grid;
        place-items: center;
        text-align: center;
        padding: 60px 32px;
        min-height: 300px;
      }

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
        background: radial-gradient(circle, rgba(91, 124, 250, 0.2) 0%, transparent 70%);
        filter: blur(20px);
        z-index: 1;
      }

      .empty-state h3 {
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
      }

      .empty-state p {
        margin: 0;
        font-size: 14px;
        color: #64748b;
        max-width: 400px;
        line-height: 1.6;
      }
    `,
  ],
})
export class UserComponent {
  readonly Permissions = Permissions;
  private readonly runtimeData = inject(RuntimeDataService);
  private readonly router = inject(Router);
  readonly items = signal(this.runtimeData.getItems('user'));
  showForm = false;
  editingId: string | null = null;
  form = { name: '', description: '' };

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingId = null;
      this.form = { name: '', description: '' };
    }
  }

  save(): void {
    if (this.editingId) {
      this.items.set(
        this.runtimeData.updateItem('user', {
          id: this.editingId,
          name: this.form.name,
          description: this.form.description,
          createdAt: new Date().toISOString(),
        }),
      );
    } else {
      this.items.set(
        this.runtimeData.createItem('user', {
          id: `U-${Date.now()}`,
          name: this.form.name,
          description: this.form.description,
          createdAt: new Date().toISOString(),
        }),
      );
    }
    this.showForm = false;
    this.editingId = null;
    this.form = { name: '', description: '' };
  }

  edit(item: { id: string; name: string; description: string }): void {
    this.editingId = item.id;
    this.form = { name: item.name, description: item.description };
    this.showForm = true;
  }

  remove(id: string): void {
    this.items.set(this.runtimeData.deleteItem('user', id));
  }
}
