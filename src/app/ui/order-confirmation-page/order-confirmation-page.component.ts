// src/app/pages/order-confirmation/order-confirmation-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto p-6">
      <ng-container *ngIf="order; else loading">
        <h1 class="text-2xl font-bold mb-2">Order Placed!</h1>
        <p class="text-gray-600 mb-6">
          Order Number: <span class="font-mono">{{ order.orderNumber }}</span>
        </p>

        <div class="border rounded-xl p-4 mb-6">
          <h2 class="font-semibold mb-3">Summary</h2>
          <div class="grid grid-cols-2 gap-y-1 text-sm">
            <div>Status</div>
            <div class="font-medium">{{ order.status }}</div>
            <div>Payment</div>
            <div class="font-medium">
              {{ order.paymentMethod }} ({{ order.paymentStatus }})
            </div>
            <div>Subtotal</div>
            <div>₹ {{ order.subtotal | number : '1.0-0' }}</div>
            <div>Tax</div>
            <div>₹ {{ order.tax | number : '1.0-0' }}</div>
            <div>Shipping</div>
            <div>₹ {{ order.shippingFee | number : '1.0-0' }}</div>
            <div>Discount</div>
            <div>₹ {{ order.discount | number : '1.0-0' }}</div>
            <div class="font-semibold">Grand Total</div>
            <div class="font-bold">
              ₹ {{ order.grandTotal | number : '1.0-0' }}
            </div>
          </div>
        </div>

        <div class="border rounded-xl p-4 mb-6">
          <h2 class="font-semibold mb-3">Shipping Address</h2>
          <div class="text-sm">
            <div class="font-medium">{{ order.shippingAddress.fullName }}</div>
            <div>{{ order.shippingAddress.line1 }}</div>
            <div *ngIf="order.shippingAddress.line2">
              {{ order.shippingAddress.line2 }}
            </div>
            <div>
              {{ order.shippingAddress.city }},
              {{ order.shippingAddress.state }}
              {{ order.shippingAddress.postalCode }}
            </div>
            <div>{{ order.shippingAddress.country }}</div>
            <div>📞 {{ order.shippingAddress.phone }}</div>
          </div>
        </div>

        <div class="border rounded-xl p-4">
          <h2 class="font-semibold mb-3">Items</h2>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between" *ngFor="let it of order.items">
              <div>{{ it.productName }} × {{ it.quantity }}</div>
              <div>₹ {{ it.lineTotal | number : '1.0-0' }}</div>
            </div>
          </div>
        </div>

        <a
          routerLink="/orders"
          class="inline-block mt-6 text-green-700 hover:underline"
          >View all orders →</a
        >
      </ng-container>

      <ng-template #loading>
        <div>Loading your order...</div>
      </ng-template>
    </div>
  `,
})
export class OrderConfirmationPageComponent implements OnInit {
  order: any;

  constructor(private route: ActivatedRoute, private orders: OrderService) {}

  ngOnInit(): void {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber')!;
    this.orders
      .getByOrderNumber(orderNumber)
      .subscribe((o) => (this.order = o));
  }
}
