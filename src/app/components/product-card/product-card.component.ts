// product-card.component.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Signal,
  computed,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service'; // adjust path
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
  imports: [QtyStepperComponent, ButtonModule, DecimalPipe, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
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
