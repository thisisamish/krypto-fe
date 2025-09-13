import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../../../services/cart.service'; // adjust path
import { QtyStepperComponent } from '../qty-stepper/qty-stepper.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, QtyStepperComponent, DecimalPipe],
  template: `
    <!-- Container to manage the presence of the drawer and backdrop -->
    <ng-container *ngIf="cart.drawerOpen()">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        (click)="cart.closeDrawer()"
      ></div>

      <!-- Sidebar Drawer -->
      <div
        class="fixed top-0 right-0 h-full w-[24rem] max-w-[90vw] bg-white z-50 shadow-lg p-4 flex flex-col transition-transform transform translate-x-0"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 class="text-xl font-bold">Your Cart</h2>
          <button
            type="button"
            (click)="cart.closeDrawer()"
            class="text-gray-500 hover:text-gray-800 p-1 rounded-full flex items-center justify-center"
            aria-label="Close cart"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <!-- Empty Cart Message -->
        <div
          *ngIf="cart.entries().length === 0"
          class="flex-1 flex flex-col items-center justify-center text-gray-600"
        >
          <i class="pi pi-shopping-cart text-4xl mb-4"></i>
          <p>Your cart is empty.</p>
        </div>

        <!-- Cart Content -->
        <div
          *ngIf="cart.entries().length > 0"
          class="flex-1 overflow-y-auto -mr-4 pr-4"
        >
          <div class="flex flex-col gap-4">
            <!-- Cart Items -->
            <div
              *ngFor="let e of cart.entries()"
              class="flex gap-3 items-center"
            >
              <div
                class="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 shrink-0"
              >
                <img
                  [src]="e.item.imageUrl"
                  [alt]="e.item.name"
                  class="object-cover w-full h-full"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="font-semibold truncate">{{ e.item.name }}</div>
                <div class="text-xs text-gray-600">{{ e.item.size }}</div>
                <div class="text-sm font-semibold mt-0.5">
                  ₹ {{ e.lineTotal | number : '1.0-0' }}
                </div>
                <div class="mt-2">
                  <app-qty-stepper
                    [value]="e.qty"
                    (valueChange)="cart.setQuantity(e.id, $event, e.item)"
                    [min]="0"
                    size="sm"
                  ></app-qty-stepper>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer with Summary and Actions -->
        <div
          *ngIf="cart.entries().length > 0"
          class="border-t border-gray-200 pt-4 mt-2"
        >
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Items</span>
            <span class="font-medium">{{ cart.totalCount() }}</span>
          </div>
          <div class="flex justify-between text-base mt-2">
            <span class="font-semibold">Subtotal</span>
            <span class="font-bold">
              ₹ {{ cart.subtotal() | number : '1.0-0' }}
            </span>
          </div>

          <div class="flex gap-2 mt-4">
            <button
              type="button"
              class="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              (click)="cart.clear()"
            >
              Clear
            </button>
            <button
              type="button"
              class="flex-1 rounded-md px-6 py-2 bg-green-600 cursor-pointer text-white hover:bg-green-700 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class CartDrawerComponent {
  constructor(public readonly cart: CartService) {}

  updateQty(id: string, qty: number) {
    // Note: The item object is needed to add a new item,
    // but not strictly for updating quantity if the item is already in the cart.
    // The current template handles this correctly by passing the item object.
    this.cart.setQuantity(id, qty);
  }
}
