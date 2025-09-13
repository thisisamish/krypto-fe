// product-card.component.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Signal,
  computed,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../../../services/cart.service'; // adjust path
import { QtyStepperComponent } from '../qty-stepper/qty-stepper.component';

type Product = {
  id?: string | number;
  name: string;
  size?: string;
  price: number;
  imageUrl?: string;
};

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [QtyStepperComponent, CommonModule],
  template: `
    <div class="w-[8rem] rounded-lg flex flex-col gap-2">
      <div
        class="rounded-xl overflow-hidden h-[8rem] w-[8rem] border border-gray-200"
      >
        <img class="object-cover size-full" [src]="item.imageUrl" alt="" />
      </div>

      <div>
        <p class="text-[0.95rem] font-semibold line-clamp-2 h-[2.75rem]">
          {{ item.name }}
        </p>
        <p class="text-gray-600 text-xs">{{ item.size }}</p>
        <p class="text-[0.95rem] font-bold">₹ {{ item.price }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <ng-container *ngIf="qty() === 0; else qtyInput">
          <button
            type="button"
            class="h-10 cursor-pointer rounded-md bg-green-600 text-white py-1 font-medium hover:bg-green-700 transition"
            (click)="addToCart()"
          >
            Add to Cart
          </button>
        </ng-container>

        <ng-template #qtyInput>
          <app-qty-stepper
            [value]="qty()"
            (valueChange)="cart.setQuantity(itemKey, $event, item)"
            [min]="0"
            size="md"
          ></app-qty-stepper>
        </ng-template>
      </div>
    </div>
  `,
})
export class ProductCardComponent implements OnChanges {
  @Input({ required: true }) item!: Product;

  // Start with a safe default so the template can always call qty()
  qty: Signal<number> = computed(() => 0);

  // Stable key for this product in the cart
  public itemKey = '';

  constructor(public readonly cart: CartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.itemKey = String(this.item.id ?? this.item.name);
      // Now it's safe to use the injected service
      this.qty = this.cart.itemQty(this.itemKey);
    }
  }

  addToCart() {
    if (this.qty() === 0) {
      this.cart.setQuantity(this.itemKey, 1, this.item); // pass item
    }
  }

  onQuantityChange(newValue: number) {
    const safeNew = Math.max(0, Number.isFinite(+newValue) ? +newValue : 0);
    this.cart.setQuantity(this.itemKey, safeNew, this.item); // pass item
  }
}
