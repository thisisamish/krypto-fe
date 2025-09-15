// app/features/admin/products/products.component.ts
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminProductsService } from '../../../services/admin-products.service';
import { Page } from '../../../models/pagination.model';
import { Product } from '../../../models/product.model';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
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
          />
          @if (invalid('name')) {
          <p class="text-sm text-red-600 mt-1">Name is required</p>
          }
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium">Image URL</label>
          <input
            formControlName="imageUrl"
            class="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="https://..."
          />
        </div>
        <div class="sm:col-span-3">
          <label class="block text-sm font-medium">Description</label>
          <textarea
            formControlName="description"
            rows="3"
            class="mt-1 w-full rounded-lg border px-3 py-2"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">Price</label>
          <input
            type="number"
            formControlName="price"
            class="mt-1 w-full rounded-lg border px-3 py-2"
          />
          @if (invalid('price')) {
          <p class="text-sm text-red-600 mt-1">Price must be ≥ 0</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium">Stock Quantity</label>
          <input
            type="number"
            formControlName="stockQuantity"
            class="mt-1 w-full rounded-lg border px-3 py-2"
          />
          @if (invalid('stockQuantity')) {
          <p class="text-sm text-red-600 mt-1">Stock must be ≥ 0</p>
          }
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

      <div class="rounded-xl border bg-white overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="text-left px-4 py-3">Name</th>
              <th class="text-left px-4 py-3">Price</th>
              <th class="text-left px-4 py-3">Stock</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of page()?.content ?? []; track p.id) {
            <tr class="border-t">
              <td class="px-4 py-3">{{ p.name }}</td>
              <td class="px-4 py-3">{{ p.price | currency : 'INR' }}</td>
              <td class="px-4 py-3">{{ p.stock_quantity }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  (click)="remove(p)"
                  class="rounded-lg border px-2 py-1 bg-white text-red-600"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
            } @if (!page() || (page()?.content?.length ?? 0) === 0) {
            <tr>
              <td colspan="4" class="px-4 py-8 text-center text-neutral-500">
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
export class ProductsComponent {
  private fb = inject(FormBuilder);
  private svc = inject(AdminProductsService);

  readonly page = signal<Page<Product> | null>(null);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(1);
  readonly showForm = signal(false);
  saving = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
  });

  constructor() {
    this.load();
  }

  fetch$() {
    return this.svc.list({ page: this.pageIndex(), pageSize: this.pageSize() });
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
          this.form.reset({ price: 0, stockQuantity: 0 });
          this.showForm.set(false);
          this.pageIndex.set(1);
          this.load();
        },
        error: () => (this.saving = false),
      });
  }

  remove(p: Product) {
    if (!confirm(`Delete product ${p.name}?`)) return;
    this.svc
      .delete(p.id)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.load());
  }
}
