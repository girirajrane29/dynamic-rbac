import { Injectable } from '@angular/core';
import { AppUser } from '../../shared/models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private authService: AuthService) {}

  getUsers(): AppUser[] {
    return this.authService.getStoredUsers();
  }

  createUser(user: AppUser): void {
    const users = this.authService.getStoredUsers();
    users.push(user);
    this.authService.saveUsers(users);
  }

  updateUser(updated: AppUser): void {
    const users = this.authService.getStoredUsers();
    const index = users.findIndex((entry) => entry.id === updated.id);
    if (index >= 0) {
      users[index] = updated;
      this.authService.saveUsers(users);
    }
  }

  deleteUser(id: string): void {
    const users = this.authService.getStoredUsers().filter((entry) => entry.id !== id);
    this.authService.saveUsers(users);
  }

  isEmailTaken(email: string, currentId?: string): boolean {
    return this.authService
      .getStoredUsers()
      .some((entry) => entry.email === email && entry.id !== currentId);
  }

  isAliasTaken(alias: string, currentId?: string): boolean {
    return this.authService
      .getStoredUsers()
      .some((entry) => entry.alias === alias && entry.id !== currentId);
  }
}
