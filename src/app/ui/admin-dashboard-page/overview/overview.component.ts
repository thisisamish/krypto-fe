// app/features/admin/overview/overview.component.ts
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AdminMetricsService } from '../../../services/admin-metrics.service';

@Component({
  standalone: true,
  selector: 'app-overview',
  imports: [AsyncPipe],
  template: `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Dashboard</h1>
      </header>

      <div class="grid sm:grid-cols-3 gap-4">
        <div class="rounded-xl border bg-white p-4">
          <div class="text-sm text-neutral-500 flex items-center gap-2">
            <i class="pi pi-shopping-bag"></i> Total Orders
          </div>
          <div class="mt-2 text-3xl font-bold">
            {{ counts()?.totalOrders ?? '—' }}
          </div>
        </div>

        <div class="rounded-xl border bg-white p-4">
          <div class="text-sm text-neutral-500 flex items-center gap-2">
            <i class="pi pi-users"></i> Total Customers
          </div>
          <div class="mt-2 text-3xl font-bold">
            {{ counts()?.totalCustomers ?? '—' }}
          </div>
        </div>

        <div class="rounded-xl border bg-white p-4">
          <div class="text-sm text-neutral-500 flex items-center gap-2">
            <i class="pi pi-shield"></i> Total Admins
          </div>
          <div class="mt-2 text-3xl font-bold">
            {{ counts()?.totalAdmins ?? '—' }}
          </div>
        </div>
      </div>
    </section>
  `,
})
export class OverviewComponent {
  private metricsSvc = inject(AdminMetricsService);
  readonly counts = signal<{
    totalOrders: number;
    totalCustomers: number;
    totalAdmins: number;
  } | null>(null);

  constructor() {
    this.metricsSvc.getCounts().subscribe((v) => this.counts.set(v));
  }
}
