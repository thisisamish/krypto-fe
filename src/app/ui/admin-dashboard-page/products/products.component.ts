import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminProductsService } from '../../../services/admin-products.service';
import { Page } from '../../../models/pagination.model';
import { Product } from '../../../models/product.model';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [AsyncPipe, DatePipe, CurrencyPipe, ReactiveFormsModule],
  template: `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Products</h2>
        <button
          (click)="toggleForm()"
          class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-white hover:bg-neutral-50"
        >
          <i class="pi pi-plus"></i> New Product
        </button>
      </header>

      @if (showForm()) {
      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        class="rounded-xl border bg-white p-4 grid sm:grid-cols-3 gap-4"
      >
        <div>
          <label class="block text-sm font-medium">Name</label>
          <input
            formControlName="name"
            class="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Product name"
          />
          @if (invalid('name')) {
          <p class="text-sm text-red-600 mt-1">Name required</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">SKU</label>
          <input
            formControlName="sku"
            class="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="SKU-001"
          />
          @if (invalid('sku')) {
          <p class="text-sm text-red-600 mt-1">SKU required</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Price</label>
          <input
            type="number"
            formControlName="price"
            class="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="0"
          />
          @if (invalid('price')) {
          <p class="text-sm text-red-600 mt-1">Price ≥ 0</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Stock</label>
          <input
            type="number"
            formControlName="stock"
            class="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="0"
          />
          @if (invalid('stock')) {
          <p class="text-sm text-red-600 mt-1">Stock ≥ 0</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Active</label>
          <select
            formControlName="active"
            class="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option [ngValue]="true">Yes</option>
            <option [ngValue]="false">No</option>
          </select>
        </div>
        <div class="sm:col-span-3">
          <label class="block text-sm font-medium">Description</label>
          <textarea
            formControlName="description"
            rows="3"
            class="mt-1 w-full rounded-lg border px-3 py-2"
          ></textarea>
        </div>
        <div class="sm:col-span-3 flex items-center gap-2">
          <button
            [disabled]="form.invalid || saving"
            class="rounded-lg bg-neutral-900 text-white px-4 py-2 disabled:opacity-50"
          >
            <i class="pi pi-save"></i> Save
          </button>
          <button
            type="button"
            (click)="toggleForm()"
            class="rounded-lg border px-4 py-2 bg-white"
          >
            Cancel
          </button>
        </div>
      </form>
      }

      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input
            class="pl-10 w-full rounded-lg border px-3 py-2 bg-white"
            [value]="q()"
            (input)="onSearchInput($event)"
            placeholder="Search products..."
          />
        </div>
      </div>

      <div class="rounded-xl border bg-white overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="text-left px-4 py-3">Name</th>
              <th class="text-left px-4 py-3">SKU</th>
              <th class="text-left px-4 py-3">Price</th>
              <th class="text-left px-4 py-3">Stock</th>
              <th class="text-left px-4 py-3">Active</th>
              <th class="text-left px-4 py-3">Updated</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of page()?.items ?? []; track p.id) {
            <tr class="border-t">
              <td class="px-4 py-3">{{ p.name }}</td>
              <!-- <td class="px-4 py-3">{{ p.sku }}</td> -->
              <td class="px-4 py-3">{{ p.price | currency : 'INR' }}</td>
              <td class="px-4 py-3">{{ p.stock_quantity }}</td>
              <!-- <td class="px-4 py-3">
                @if (p.active) { <span class="text-green-600">Yes</span> } @else
                { <span class="text-red-600">No</span> }
              </td> -->
              <!-- <td class="px-4 py-3">{{ p.updatedAt | date : 'short' }}</td> -->
              <td class="px-4 py-3 text-right">
                <button
                  (click)="toggleActive(p)"
                  class="rounded-lg border px-2 py-1 bg-white mr-2"
                >
                  <i class="pi pi-power-off"></i>
                </button>
                <button
                  (click)="remove(p)"
                  class="rounded-lg border px-2 py-1 bg-white text-red-600"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
            } @if (!page() || (page()?.items?.length ?? 0) === 0) {
            <tr>
              <td colspan="7" class="px-4 py-8 text-center text-neutral-500">
                No products found.
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
export class ProductsComponent {
  private fb = inject(FormBuilder);
  private svc = inject(AdminProductsService);

  readonly page = signal<Page<Product> | null>(null);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(1);
  readonly q = signal('');
  readonly showForm = signal(false);
  saving = false;

  form = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    active: [true, Validators.required],
    description: [''],
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

  // ==== Template event handlers (no casts in template) ====
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.q.set(input.value);
  }

  // ==== Data loading pattern ====
  fetch$() {
    return this.svc.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      q: this.q(),
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

  toggleForm() {
    this.showForm.update((v) => !v);
  }
  invalid(c: string) {
    const ctrl = this.form.get(c);
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.svc
      .create(this.form.value as any)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.saving = false;
          this.form.reset({ active: true, price: 0, stock: 0 });
          this.showForm.set(false);
          this.pageIndex.set(1);
          this.load();
        },
        error: () => {
          this.saving = false;
        },
      });
  }

  toggleActive(p: Product) {
    this.svc
      .update(p.id, {})
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.load());
  }

  remove(p: Product) {
    if (!confirm(`Delete product ${p.name}?`)) return;
    this.svc
      .delete(p.id)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.load());
  }
}
