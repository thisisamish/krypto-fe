// src/app/pages/checkout/checkout-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto p-4 grid md:grid-cols-[2fr,1fr] gap-8">
      <div>
        <h1 class="text-2xl font-bold mb-4">Shipping & Payment</h1>
        <form [formGroup]="form" (ngSubmit)="placeOrder()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm">Full Name</label>
              <input
                class="w-full border rounded px-3 py-2"
                formControlName="fullName"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm">Phone</label>
              <input
                class="w-full border rounded px-3 py-2"
                formControlName="phone"
              />
            </div>
          </div>

          <label class="block mt-4 mb-1 text-sm">Address Line 1</label>
          <input
            class="w-full border rounded px-3 py-2"
            formControlName="line1"
          />

          <label class="block mt-4 mb-1 text-sm"
            >Address Line 2 (Optional)</label
          >
          <input
            class="w-full border rounded px-3 py-2"
            formControlName="line2"
          />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label class="block mb-1 text-sm">City</label>
              <input
                class="w-full border rounded px-3 py-2"
                formControlName="city"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm">State</label>
              <input
                class="w-full border rounded px-3 py-2"
                formControlName="state"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm">Postal Code</label>
              <input
                class="w-full border rounded px-3 py-2"
                formControlName="postalCode"
              />
            </div>
          </div>

          <label class="block mt-4 mb-1 text-sm">Country</label>
          <input
            class="w-full border rounded px-3 py-2"
            formControlName="country"
          />

          <label class="block mt-6 mb-2 text-sm font-semibold"
            >Payment Method</label
          >
          <div class="flex items-center gap-3">
            <input type="radio" id="cod" checked class="cursor-pointer" />
            <label for="cod" class="cursor-pointer"
              >Cash on Delivery (COD)</label
            >
          </div>

          <label class="block mt-4 mb-1 text-sm">Notes (optional)</label>
          <textarea
            rows="3"
            class="w-full border rounded px-3 py-2"
            formControlName="notes"
          ></textarea>

          <button
            class="mt-6 bg-green-600 text-white px-6 py-2 rounded"
            [disabled]="form.invalid || placing"
          >
            {{ placing ? 'Placing order...' : 'Place Order' }}
          </button>
        </form>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3">Order Summary</h2>
        <div class="border rounded-lg p-4">
          <div
            class="flex justify-between text-sm"
            *ngFor="let e of cart.entries()"
          >
            <div class="truncate mr-2">{{ e.item.name }} × {{ e.qty }}</div>
            <div>₹ {{ e.lineTotal | number : '1.0-0' }}</div>
          </div>
          <div class="border-t mt-3 pt-3 flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>₹ {{ cart.subtotal() | number : '1.0-0' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutPageComponent {
  placing = false;

  form: ReturnType<FormBuilder['group']>;

  constructor(
    public cart: CartService,
    private fb: FormBuilder,
    private checkout: CheckoutService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['India', Validators.required],
      phone: ['', Validators.required],
      notes: [''],
    });
  }

  placeOrder() {
    if (this.form.invalid) return;
    this.placing = true;
    this.checkout
      .placeOrder({
        paymentMethod: 'COD',
        shippingAddress: this.form.value as any,
        notes: this.form.value.notes ?? undefined,
      })
      .subscribe({
        next: (order) => {
          // Optionally clear the cart (server might clear automatically)
          this.cart.clear();
          this.router.navigate(['/order', order.orderNumber]);
        },
        error: (err) => {
          console.error(err);
          this.placing = false;
        },
      });
  }
}
