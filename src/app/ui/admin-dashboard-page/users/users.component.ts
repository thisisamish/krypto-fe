// app/features/admin/users/users.component.ts
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AdminUsersService } from '../../../services/admin-users.service';
import { Page } from '../../../models/pagination.model';
import { User } from '../../../models/user.model';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
} from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [AsyncPipe, DatePipe],
  template: `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Users</h2>
      </header>

      <div class="grid sm:grid-cols-3 gap-2">
        <div class="relative sm:col-span-2">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input
            class="pl-10 w-full rounded-lg border px-3 py-2 bg-white"
            [value]="q()"
            (input)="onSearchInput($event)"
            placeholder="Search by username/email..."
          />
        </div>

        <select
          class="rounded-lg border px-3 py-2 bg-white"
          [value]="role()"
          (change)="onRoleChange($event)"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div class="rounded-xl border bg-white overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="text-left px-4 py-3">Username</th>
              <th class="text-left px-4 py-3">Email</th>
              <th class="text-left px-4 py-3">Role</th>
              <th class="text-left px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            @for (u of page()?.content ?? []; track u.id) {
            <tr class="border-t">
              <td class="px-4 py-3">{{ u.username }}</td>
              <td class="px-4 py-3">{{ u.email }}</td>
              <td class="px-4 py-3">{{ u.role }}</td>
              <td class="px-4 py-3">{{ u.createdAt | date : 'short' }}</td>
            </tr>
            } @if (!page() || (page()?.content?.length ?? 0) === 0) {
            <tr>
              <td colspan="4" class="px-4 py-8 text-center text-neutral-500">
                No users found for the selected filters.
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-end gap-2">
        <button
          (click)="prev()"
          class="rounded-lg border px-3 py-2 bg-white"
          [disabled]="(page()?.number ?? 0) === 0"
        >
          Prev
        </button>
        <span class="text-sm">
          Page {{ (page()?.number ?? 0) + 1 }} of {{ page()?.totalPages ?? 1 }}
        </span>
        <button
          (click)="next()"
          class="rounded-lg border px-3 py-2 bg-white"
          [disabled]="(page()?.number ?? 0) + 1 >= (page()?.totalPages ?? 1)"
        >
          Next
        </button>
      </div>
    </section>
  `,
})
export class UsersComponent {
  private svc = inject(AdminUsersService);

  readonly page = signal<Page<User> | null>(null);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(1); // 1-based UI; service converts to 0-based

  readonly q = signal('');
  readonly role = signal<'' | 'ADMIN' | 'CUSTOMER'>('');

  constructor() {
    toObservable(this.q)
      .pipe(
        startWith(this.q()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this.fetch$()),
        takeUntilDestroyed()
      )
      .subscribe((p) => this.page.set(p));

    // when role changes, reload
    toObservable(this.role)
      .pipe(
        switchMap(() => this.fetch$()),
        takeUntilDestroyed()
      )
      .subscribe((p) => this.page.set(p));
  }

  onSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.pageIndex.set(1);
    this.q.set(input.value);
  }
  onRoleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.pageIndex.set(1);
    this.role.set((select.value as any) || '');
  }

  fetch$() {
    return this.svc.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      q: this.q() || undefined,
      role: (this.role() || undefined) as any,
    });
  }

  load() {
    this.fetch$()
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.page.set(p));
  }

  next() {
    if ((this.page()?.number ?? 0) + 1 >= (this.page()?.totalPages ?? 1))
      return;
    this.pageIndex.update((x) => x + 1);
    this.load();
  }
  prev() {
    this.pageIndex.update((x) => Math.max(1, x - 1));
    this.load();
  }
}
