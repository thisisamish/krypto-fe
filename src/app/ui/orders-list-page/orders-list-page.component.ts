// src/app/pages/orders/orders-list-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">My Orders</h1>
      <div class="border rounded-xl overflow-hidden">
        <div class="grid grid-cols-5 text-sm font-semibold bg-gray-50 p-3">
          <div>Order #</div>
          <div>Date</div>
          <div>Status</div>
          <div>Payment</div>
          <div class="text-right">Total</div>
        </div>
        <div
          *ngFor="let o of rows"
          class="grid grid-cols-5 text-sm p-3 border-t"
        >
          <a
            class="text-green-700 hover:underline"
            [routerLink]="['/order', o.orderNumber]"
            >{{ o.orderNumber }}</a
          >
          <div>{{ o.createdAt | date : 'medium' }}</div>
          <div>{{ o.status }}</div>
          <div>{{ o.paymentStatus }}</div>
          <div class="text-right">₹ {{ o.grandTotal | number : '1.0-0' }}</div>
        </div>
      </div>
    </div>
  `,
})
export class OrdersListPageComponent implements OnInit {
  rows: any[] = [];
  constructor(private orders: OrderService) {}
  ngOnInit(): void {
    this.orders.list(0, 20).subscribe((p) => (this.rows = p.content ?? []));
  }
}
