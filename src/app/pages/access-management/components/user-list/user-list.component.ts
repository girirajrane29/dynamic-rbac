import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppUser } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @Input() users: AppUser[] = [];
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<AppUser>();
  @Output() delete = new EventEmitter<string>();

  get canAddUser(): boolean {
    return this.users.length < 5;
  }
}
