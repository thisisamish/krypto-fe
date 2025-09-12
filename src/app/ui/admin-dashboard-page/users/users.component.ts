import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AdminUsersService } from '../../../services/admin-users.service';
import { Page } from '../../../models/pagination.model';
import { User } from '../../../models/user.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
// FIXED: Imported combineLatest from 'rxjs' and removed unused 'startWith'
import { Observable, combineLatest } from 'rxjs';

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
            <!-- CHANGED: Use page()?.content instead of items -->
            @for (u of page()?.content ?? []; track u.id) {
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
                  title="Force Logout"
                >
                  <i class="pi pi-sign-out"></i>
                </button>
              </td>
            </tr>
            } @if (!page() || (page()?.content?.length ?? 0) === 0) {
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-neutral-500">
                No users found for the selected filters.
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination corrected -->
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
  readonly pageIndex = signal(1); // User-facing page number (1-based)

  // Filter signals
  readonly q = signal('');
  readonly role = signal<'' | 'admin' | 'customer'>('');
  readonly status = signal<'' | 'active' | 'locked'>('');

  constructor() {
    // COMBINED: Efficiently combine all filters into a single stream
    const q$ = toObservable(this.q).pipe(debounceTime(300));
    const role$ = toObservable(this.role);
    const status$ = toObservable(this.status);
    const page$ = toObservable(this.pageIndex);

    combineLatest([q$, role$, status$, page$])
      .pipe(
        switchMap(() => this.fetch$()),
        takeUntilDestroyed()
      )
      .subscribe((p) => this.page.set(p));
  }

  // ==== Template event handlers (no casts in template) ====
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pageIndex.set(1); // Reset page on new search
    this.q.set(input.value);
  }
  onRoleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageIndex.set(1); // Reset page on filter change
    this.role.set((select.value as 'admin' | 'customer' | '') ?? '');
  }
  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageIndex.set(1); // Reset page on filter change
    this.status.set((select.value as 'active' | 'locked' | '') ?? '');
  }

  // ==== Data loading pattern ====
  fetch$(): Observable<Page<User>> {
    return this.svc.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      q: this.q() || undefined,
      role: (this.role() || undefined) as any,
      status: (this.status() || undefined) as any,
    });
  }

  // Kept for manual reloads like after forcing a logout
  load() {
    return this.fetch$()
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.page.set(p));
  }

  next() {
    if ((this.page()?.number ?? 0) + 1 >= (this.page()?.totalPages ?? 1))
      return;
    this.pageIndex.update((x) => x + 1);
  }
  prev() {
    this.pageIndex.update((x) => Math.max(1, x - 1));
  }

  logout(u: User) {
    if (
      !confirm(
        `Force logout user ${u.email}? This will invalidate their session.`
      )
    )
      return;
    this.svc
      .forceLogout(u.id)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // We can reload the data to see if their 'lastActiveAt' status changes
        this.load();
      });
  }
}
