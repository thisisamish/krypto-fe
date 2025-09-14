// src/app/services/cart.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { CartApiService } from './cart-api.service';
import { firstValueFrom } from 'rxjs';

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
  readonly drawerOpen = signal(false);

  readonly entries = computed(() => {
    const map = this._cart();
    return Object.entries(map).map(([id, { qty, item }]) => ({
      id,
      qty,
      item,
      lineTotal: qty * (item?.price ?? 0),
    }));
  });

  readonly totalCount = computed(() =>
    this.entries().reduce((s, e) => s + e.qty, 0)
  );
  readonly subtotal = computed(() =>
    this.entries().reduce((s, e) => s + e.lineTotal, 0)
  );

  constructor(private api: CartApiService) {
    this.hydrateFromServer();
  }

  /** Sync from backend at app start (or after login) */
  async hydrateFromServer() {
    try {
      const res = await firstValueFrom(this.api.getCart());
      const map: CartMap = {};
      for (const it of res.items ?? []) {
        map[String(it.productId)] = {
          qty: it.quantity,
          item: {
            id: it.productId,
            name: it.productName,
            price: it.unitPrice,
          },
        };
      }
      this._cart.set(map);
    } catch {
      // not logged in / empty cart—ignore
    }
  }

  itemQty(id: string) {
    return computed(() => this._cart()[id]?.qty ?? 0);
  }

  /** Add or set quantity (syncs server via POST or PUT) */
  async setQuantity(id: string, qty: number, item?: Product) {
    const productId = Number(id);
    const next = Math.max(0, Math.trunc(+qty || 0));
    try {
      let res;
      if ((this._cart()[id]?.qty ?? 0) === 0 && next > 0) {
        res = await firstValueFrom(
          this.api.addItem({ productId, quantity: next })
        );
      } else {
        res = await firstValueFrom(
          this.api.updateItem(productId, { quantity: next })
        );
      }
      this.applyServerCart(res);
    } catch (e) {
      console.error('Cart update failed', e);
      // optimistic fallback to local state to avoid UI dead-ends
      this._cart.update((cart) => {
        const copy = { ...cart };
        if (next === 0) delete copy[id];
        else
          copy[id] = {
            qty: next,
            item: item ?? copy[id]?.item ?? fallbackItem(id),
          };
        return copy;
      });
    }
  }

  changeBy(id: string, delta: number, item?: Product) {
    const cur = this._cart()[id]?.qty ?? 0;
    return this.setQuantity(id, cur + delta, item);
  }

  clear() {
    // If you have a clear API, call it; otherwise set 0 for each product in parallel.
    const ids = Object.keys(this._cart());
    ids.forEach((id) => this.setQuantity(id, 0));
  }

  openDrawer() {
    this.drawerOpen.set(true);
  }
  closeDrawer() {
    this.drawerOpen.set(false);
  }
  toggleDrawer() {
    this.drawerOpen.update((v) => !v);
  }

  private applyServerCart(res: { items: any[] }) {
    const map: CartMap = {};
    for (const it of res.items ?? []) {
      map[String(it.productId)] = {
        qty: it.quantity,
        item: {
          id: it.productId,
          name: it.productName,
          price: it.unitPrice,
        },
      };
    }
    this._cart.set(map);
  }
}

function fallbackItem(id: string): Product {
  return { id, name: String(id), price: 0 };
}
