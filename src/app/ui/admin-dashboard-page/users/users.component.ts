import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AdminUsersService } from '../../../services/admin-users.service';
import { Page } from '../../../models/pagination.model';
import { User } from '../../../models/user.model';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [AsyncPipe, DatePipe],
  template: `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Users</h2>
      </header>

      <div class="grid sm:grid-cols-4 gap-2">
        <div class="relative sm:col-span-2">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input
            class="pl-10 w-full rounded-lg border px-3 py-2 bg-white"
            [value]="q()"
            (input)="onSearchInput($event)"
            placeholder="Search users..."
          />
        </div>

        <select
          class="rounded-lg border px-3 py-2 bg-white"
          [value]="role()"
          (change)="onRoleChange($event)"
        >
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>

        <select
          class="rounded-lg border px-3 py-2 bg-white"
          [value]="status()"
          (change)="onStatusChange($event)"
        >
          <option value="">Any Status</option>
          <option value="active">Active</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      <div class="rounded-xl border bg-white overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="text-left px-4 py-3">Name</th>
              <th class="text-left px-4 py-3">Email</th>
              <th class="text-left px-4 py-3">Role</th>
              <th class="text-left px-4 py-3">Active</th>
              <th class="text-left px-4 py-3">Last Active</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (u of page()?.items ?? []; track u.id) {
            <tr class="border-t">
              <td class="px-4 py-3">{{ u.name }}</td>
              <td class="px-4 py-3">{{ u.email }}</td>
              <td class="px-4 py-3">{{ u.role }}</td>
              <td class="px-4 py-3">
                @if (u.active) { <span class="text-green-600">Yes</span> } @else
                { <span class="text-red-600">No</span> }
              </td>
              <td class="px-4 py-3">
                {{ u.lastActiveAt ? (u.lastActiveAt | date : 'short') : '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  (click)="logout(u)"
                  class="rounded-lg border px-2 py-1 bg-white text-amber-700"
                >
                  <i class="pi pi-sign-out"></i>
                </button>
              </td>
            </tr>
            } @if (!page() || (page()?.items?.length ?? 0) === 0) {
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-neutral-500">
                No users found.
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
          [disabled]="page()?.page === 1"
        >
          Prev
        </button>
        <span class="text-sm">Page {{ page()?.page ?? 1 }}</span>
        <button
          (click)="next()"
          class="rounded-lg border px-3 py-2 bg-white"
          [disabled]="(page()?.page ?? 1) >= totalPages()"
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
  readonly pageIndex = signal(1);

  readonly q = signal('');
  readonly role = signal<'' | 'admin' | 'customer'>('');
  readonly status = signal<'' | 'active' | 'locked'>('');

  constructor() {
    // Search (q)
    toObservable(this.q)
      .pipe(
        startWith(this.q()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this.fetch$()),
        takeUntilDestroyed()
      )
      .subscribe((p) => this.page.set(p));

    // Role filter
    toObservable(this.role)
      .pipe(
        startWith(this.role()),
        switchMap(() => this.fetch$()),
        takeUntilDestroyed()
      )
      .subscribe((p) => this.page.set(p));

    // Status filter
    toObservable(this.status)
      .pipe(
        startWith(this.status()),
        switchMap(() => this.fetch$()),
        takeUntilDestroyed()
      )
      .subscribe((p) => this.page.set(p));
  }

  // ==== Template event handlers (no casts in template) ====
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.q.set(input.value);
  }
  onRoleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.role.set((select.value as 'admin' | 'customer' | '') ?? '');
  }
  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.status.set((select.value as 'active' | 'locked' | '') ?? '');
  }

  // ==== Data loading pattern ====
  fetch$() {
    return this.svc.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      q: this.q() || undefined,
      role: (this.role() || undefined) as any,
      status: (this.status() || undefined) as any,
    });
  }
  load() {
    return this.fetch$()
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.page.set(p));
  }

  totalPages() {
    const p = this.page();
    if (!p) return 1;
    return Math.max(1, Math.ceil(p.total / p.pageSize));
  }

  next() {
    this.pageIndex.update((x) => x + 1);
    this.load();
  }
  prev() {
    this.pageIndex.update((x) => Math.max(1, x - 1));
    this.load();
  }

  logout(u: User) {
    if (!confirm(`Force logout ${u.email}?`)) return;
    this.svc
      .forceLogout(u.id)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Optionally refresh
        this.load();
      });
  }
}
