import { Injectable, signal } from '@angular/core';
import { AppUser } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AppUser | null>(this.getStoredCurrentUser());

  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorageItem(key: string): void {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(key);
    }
  }

  private getStoredCurrentUser(): AppUser | null {
    const stored = this.getLocalStorageItem('currentUser');
    if (stored) {
      try {
        const decrypted = this.decrypt(stored);
        return JSON.parse(decrypted);
      } catch {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  login(email: string, password: string): AppUser | null {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = this.getStoredUsers();
    const user = users.find(
      (entry) =>
        entry.email.toLowerCase() === normalizedEmail &&
        entry.password === this.encrypt(normalizedPassword),
    );

    if (user) {
      this.currentUser.set(user);
      const json = JSON.stringify(user);
      const encrypted = this.encrypt(json);
      this.setLocalStorageItem('currentUser', encrypted);
      return user;
    }

    return null;
  }

  logout(): void {
    this.currentUser.set(null);
    this.removeLocalStorageItem('currentUser');
  }

  isAuthenticated(): boolean {
    return !!this.currentUser() || !!this.getLocalStorageItem('currentUser');
  }

  getStoredUsers(): AppUser[] {
    const stored = this.getLocalStorageItem('users');
    if (stored) {
      try {
        const decrypted = this.decrypt(stored);
        return JSON.parse(decrypted);
      } catch {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  }

  saveUsers(users: AppUser[]): void {
    const json = JSON.stringify(users);
    const encrypted = this.encrypt(json);
    this.setLocalStorageItem('users', encrypted);
  }

  encrypt(value: string): string {
    return btoa(value);
  }

  decrypt(value: string): string {
    return atob(value);
  }
}
