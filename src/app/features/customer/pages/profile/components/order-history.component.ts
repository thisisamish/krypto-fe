import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { OrderSummary } from '../../../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  template: `
    <div class="p-4 sm:p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">My Orders</h2>
      <div *ngIf="loading" class="text-center">Loading orders...</div>
      <div *ngIf="error" class="text-red-600">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">
        <div *ngIf="orders.length === 0" class="text-gray-500">
          You have not placed any orders yet.
        </div>

        <!-- Orders Table -->
        <div *ngIf="orders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order #
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of orders" class="hover:bg-gray-50">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer"
                >
                  {{ order.orderNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.createdAt | date : 'medium' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    [ngClass]="getStatusClass(order.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ order.status | titlecase }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  ₹ {{ order.grandTotal | number : '1.2-2' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div
          class="flex justify-between items-center mt-4"
          *ngIf="totalPages > 1"
        >
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 0"
            class="btn btn-ghost"
          >
            Previous
          </button>
          <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button
            (click)="nextPage()"
            [disabled]="currentPage >= totalPages - 1"
            class="btn btn-ghost"
          >
            Next
          </button>
        </div>
      </ng-container>
    </div>
  `,
})
export class OrderHistoryComponent implements OnInit {
  loading = false;
  error: string | null = null;
  orders: OrderSummary[] = [];

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orderService.getMyOrders(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.orders = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }
}
