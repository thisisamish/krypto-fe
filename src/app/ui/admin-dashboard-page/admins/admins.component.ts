// app/features/admin/admins/admins.component.ts
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminAdminsService } from '../../../services/admin-admins.service';
import { Page } from '../../../models/pagination.model';
import { User } from '../../../models/user.model';
import { emailValidator } from '../../../shared/validators';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-admins',
  imports: [DatePipe, ReactiveFormsModule],
  template: `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Admins</h2>
        <button
          (click)="toggleCreate()"
          class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-white hover:bg-neutral-50"
        >
          <i class="pi pi-plus"></i> New Admin
        </button>
      </header>

      @if (showCreate()) {
      <form
        [formGroup]="createForm"
        (ngSubmit)="create()"
        class="rounded-xl border bg-white p-4 grid sm:grid-cols-3 gap-4"
      >
        <div>
          <label class="block text-sm font-medium">Username</label>
          <input
            class="mt-1 w-full rounded-lg border px-3 py-2"
            formControlName="username"
          />
          @if (invalid('username')) {
          <p class="mt-1 text-sm text-red-600">Username is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input
            class="mt-1 w-full rounded-lg border px-3 py-2"
            formControlName="email"
            type="email"
          />
          @if (invalid('email')) {
          <p class="mt-1 text-sm text-red-600">Valid email is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Password</label>
          <input
            class="mt-1 w-full rounded-lg border px-3 py-2"
            formControlName="password"
            type="password"
          />
          @if (invalid('password')) {
          <p class="mt-1 text-sm text-red-600">Password is required.</p>
          }
        </div>
        <div class="sm:col-span-3 flex items-center gap-2">
          <button
            [disabled]="createForm.invalid || creating"
            class="rounded-lg bg-neutral-900 text-white px-4 py-2 disabled:opacity-50"
          >
            <i class="pi pi-save"></i> Create
          </button>
          <button
            type="button"
            (click)="toggleCreate()"
            class="rounded-lg border px-4 py-2 bg-white"
          >
            Cancel
          </button>
        </div>
      </form>
      }

      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input
          class="pl-10 w-full rounded-lg border px-3 py-2 bg-white"
          [value]="q()"
          (input)="onSearchInput($event)"
          placeholder="Search admins by username/email..."
        />
      </div>

      <div class="rounded-xl border bg-white overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="text-left px-4 py-3">Username</th>
              <th class="text-left px-4 py-3">Email</th>
              <th class="text-left px-4 py-3">Role</th>
              <th class="text-left px-4 py-3">Created</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (a of page()?.content ?? []; track a.id) {
            <tr class="border-t">
              <td class="px-4 py-3">{{ a.username }}</td>
              <td class="px-4 py-3">{{ a.email }}</td>
              <td class="px-4 py-3">{{ a.role }}</td>
              <td class="px-4 py-3">{{ a.createdAt | date : 'mediumDate' }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  (click)="editEmail(a)"
                  class="rounded-lg border px-2 py-1 bg-white mr-2"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button
                  (click)="remove(a)"
                  class="rounded-lg border px-2 py-1 bg-white text-red-600"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
            } @if (!page() || (page()?.content?.length ?? 0) === 0) {
            <tr>
              <td colspan="5" class="px-4 py-8 text-center text-neutral-500">
                No admins found.
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
        <span class="text-sm"
          >Page {{ (page()?.number ?? 0) + 1 }} of
          {{ page()?.totalPages ?? 1 }}</span
        >
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
export class AdminsComponent {
  private fb = inject(FormBuilder);
  private svc = inject(AdminAdminsService);

  readonly page = signal<Page<User> | null>(null);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(1);
  readonly q = signal('');
  readonly showCreate = signal(false);
  creating = false;

  createForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, emailValidator]],
    password: ['', Validators.required],
  });

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
  }

  fetch$() {
    return this.svc.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      q: this.q(),
      // role: 'ADMIN',
    });
  }

  load() {
    this.fetch$()
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.page.set(p));
  }

  onSearchInput(e: Event) {
    this.pageIndex.set(1);
    this.q.set((e.target as HTMLInputElement).value);
  }

  toggleCreate() {
    this.showCreate.update((v) => !v);
  }

  invalid(ctrl: string) {
    const c = this.createForm.get(ctrl);
    return !!c && c.invalid && (c.touched || c.dirty);
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

  create() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.creating = true;
    this.svc
      .create(this.createForm.value as any)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.creating = false;
          this.createForm.reset();
          this.showCreate.set(false);
          this.pageIndex.set(1);
          this.load();
        },
        error: () => (this.creating = false),
      });
  }

  editEmail(a: User) {
    const email = prompt('New email for ' + a.username, a.email || '');
    if (!email) return;
    this.svc
      .update(a.username ?? '', { email })
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.load());
  }

  remove(a: User) {
    if (!confirm(`Delete admin ${a.username}?`)) return;
    this.svc
      .delete(a.username ?? '')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.load());
  }
}
