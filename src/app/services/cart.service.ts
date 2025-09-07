import { Injectable, computed, signal } from '@angular/core';

export interface Product {
  id?: string | number;
  name: string;
  price: number;
  imageUrl?: string;
  size?: string;
}

type CartMap = Record<string, { qty: number; item: Product }>;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _cart = signal<CartMap>({});

  // Drawer state (simple global UI flag)
  readonly drawerOpen = signal(false);

  /** All entries as an array with line totals (easy for *ngFor) */
  readonly entries = computed(() => {
    const map = this._cart();
    return Object.entries(map).map(([id, { qty, item }]) => ({
      id,
      qty,
      item,
      lineTotal: qty * (item?.price ?? 0),
    }));
  });

  /** Total item count across all products */
  readonly totalCount = computed(() =>
    this.entries().reduce((sum, e) => sum + e.qty, 0)
  );

  /** Cart subtotal (sum of line totals) */
  readonly subtotal = computed(() =>
    this.entries().reduce((sum, e) => sum + e.lineTotal, 0)
  );

  /** Per-product quantity signal */
  itemQty(id: string) {
    return computed(() => this._cart()[id]?.qty ?? 0);
  }

  /** Set absolute quantity; pass item so we can compute totals */
  setQuantity(id: string, qty: number, item?: Product) {
    const next = Math.max(0, Math.trunc(+qty || 0));
    this._cart.update((cart) => {
      const copy = { ...cart };
      if (next === 0) {
        delete copy[id];
      } else {
        const prev = copy[id]?.item;
        copy[id] = { qty: next, item: item ?? prev ?? { ...fallbackItem(id) } };
      }
      return copy;
    });
  }

  /** Increment/decrement quantity */
  changeBy(id: string, delta: number, item?: Product) {
    this._cart.update((cart) => {
      const cur = cart[id]?.qty ?? 0;
      const next = Math.max(0, cur + Math.trunc(+delta || 0));
      const copy = { ...cart };
      if (next === 0) {
        delete copy[id];
      } else {
        const prev = copy[id]?.item;
        copy[id] = { qty: next, item: item ?? prev ?? { ...fallbackItem(id) } };
      }
      return copy;
    });
  }

  clear() {
    this._cart.set({});
  }

  // Drawer helpers
  openDrawer() {
    this.drawerOpen.set(true);
  }
  closeDrawer() {
    this.drawerOpen.set(false);
  }
  toggleDrawer() {
    this.drawerOpen.update((v) => !v);
  }
}

function fallbackItem(id: string): Product {
  return { id, name: String(id), price: 0 };
}
