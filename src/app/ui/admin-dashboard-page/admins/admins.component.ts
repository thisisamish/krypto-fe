import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminAdminsService } from '../../../services/admin-admins.service';
import { Page } from '../../../models/pagination.model';
import { User } from '../../../models/user.model';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
} from 'rxjs/operators';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { emailValidator } from '../../../shared/validators'; // assumption: you have this
// Uses your existing directive name:
import { StrongPasswordDirective } from '../../../directives/strong-password.directive';

@Component({
  standalone: true,
  selector: 'app-admins',
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    NgTemplateOutlet,
    StrongPasswordDirective,
  ],
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

      <!-- Create form -->
      @if (showCreate()) {
      <form
        [formGroup]="createForm"
        (ngSubmit)="create()"
        class="rounded-xl border bg-white p-4 grid sm:grid-cols-3 gap-4"
      >
        <div>
          <label class="block text-sm font-medium">Name</label>
          <input
            class="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
            formControlName="name"
            type="text"
            placeholder="Admin name"
          />
          @if (invalid('name')) {
          <p class="mt-1 text-sm text-red-600">Name is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input
            class="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
            formControlName="email"
            type="email"
            placeholder="admin@example.com"
          />
          @if (invalid('email')) {
          <p class="mt-1 text-sm text-red-600">Valid email is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Password</label>
          <input
            class="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
            strongPassword
            formControlName="password"
            type="password"
            placeholder="Strong password"
          />
          @if (invalid('password')) {
          <p class="mt-1 text-sm text-red-600">Password must be strong.</p>
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

      <!-- Toolbar -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input
            class="pl-10 w-full rounded-lg border px-3 py-2 bg-white"
            [value]="q()"
            (input)="onSearchInput($event)"
            placeholder="Search admins..."
          />
        </div>
      </div>

      <!-- Table -->
      <div class="rounded-xl border bg-white overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="text-left px-4 py-3">Name</th>
              <th class="text-left px-4 py-3">Email</th>
              <th class="text-left px-4 py-3">Active</th>
              <th class="text-left px-4 py-3">Created</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (a of page()?.items ?? []; track a.id) {
            <tr class="border-t">
              <td class="px-4 py-3">{{ a.name }}</td>
              <td class="px-4 py-3">{{ a.email }}</td>
              <td class="px-4 py-3">
                @if (a.active) {<span class="text-green-600">Yes</span>} @else
                {<span class="text-red-600">No</span>}
              </td>
              <td class="px-4 py-3">{{ a.createdAt | date : 'mediumDate' }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  (click)="edit(a)"
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
            } @if (!page() || (page()?.items?.length ?? 0) === 0) {
            <tr>
              <td colspan="5" class="px-4 py-8 text-center text-neutral-500">
                No admins found.
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Simple pagination -->
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
    name: ['', Validators.required],
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

  // NEW: return an Observable (no subscribe here)
  fetch$() {
    return this.svc.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      q: this.q(),
    });
  }

  // Optional helper to load once (e.g., after create/delete)
  load() {
    return this.fetch$()
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.page.set(p));
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.q.set(input.value);
  }

  toggleCreate() {
    this.showCreate.update((v) => !v);
  }

  invalid(ctrl: string) {
    const c = this.createForm.get(ctrl);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  fetch() {
    return this.svc
      .list({ page: this.pageIndex(), pageSize: this.pageSize(), q: this.q() })
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
          this.fetch();
        },
        error: () => {
          this.creating = false;
        },
      });
  }

  edit(a: User) {
    // minimal inline toggle example; in real app, open edit form/modal
    // For brevity, we flip active state as a demo:
    this.svc
      .update(a.id, { active: !a.active })
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.fetch());
  }

  remove(a: User) {
    if (!confirm(`Delete admin ${a.email}?`)) return;
    this.svc
      .delete(a.id)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.fetch());
  }
}
