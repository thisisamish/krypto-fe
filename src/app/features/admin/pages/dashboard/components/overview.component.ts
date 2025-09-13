import { Component, computed, effect, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { AdminMetricsService } from '../../../services/admin-metrics.service';

@Component({
  standalone: true,
  selector: 'app-overview',
  imports: [CurrencyPipe],
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
            {{ metrics()?.totalOrders ?? '—' }}
          </div>
        </div>

        <div class="rounded-xl border bg-white p-4">
          <div class="text-sm text-neutral-500 flex items-center gap-2">
            <i class="pi pi-dollar"></i> Total Revenue
          </div>
          <div class="mt-2 text-3xl font-bold">
            {{ metrics()?.totalRevenue | currency : 'INR' : 'symbol' }}
          </div>
        </div>

        <div class="rounded-xl border bg-white p-4">
          <div class="text-sm text-neutral-500 flex items-center gap-2">
            <i class="pi pi-users"></i> Total Customers
          </div>
          <div class="mt-2 text-3xl font-bold">
            {{ metrics()?.totalCustomers ?? '—' }}
          </div>
        </div>
      </div>
    </section>
  `,
})
export class OverviewComponent {
  private metricsSvc = inject(AdminMetricsService);
  readonly metrics = signal<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
  } | null>(null);

  constructor() {
    this.metricsSvc.getMetrics().subscribe((m) => this.metrics.set(m));
  }
}
