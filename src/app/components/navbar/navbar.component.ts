// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex justify-between items-center h-[4rem]">
      <div><p class="text-[1.7rem] font-black">KRYPTO</p></div>

      <div *ngIf="!auth.isLoggedIn()">
        <button
          class="rounded-md px-6 py-2 bg-green-600 text-white"
          (click)="router.navigate(['/login'])"
        >
          Login
        </button>
      </div>

      <div *ngIf="auth.isLoggedIn()" class="flex gap-4 items-center">
        <button
          type="button"
          class="btn btn-ghost btn-md rounded-full !w-10 !h-10 p-0"
          (click)="onLogout()"
          aria-label="Logout"
        >
          <span class="pi pi-sign-out"></span>
        </button>

        <div class="relative">
          <button
            type="button"
            class="btn btn-ghost btn-md rounded-full !w-10 !h-10 p-0"
            (click)="cart.openDrawer()"
            aria-label="Cart"
          >
            <span class="pi pi-shopping-cart"></span>
          </button>
          <span
            *ngIf="cart.totalCount() > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] text-center"
          >
            {{ cart.totalCount() }}
          </span>
        </div>

        <button
          class="rounded-md px-4 py-2 bg-gray-100"
          (click)="router.navigate(['/orders'])"
        >
          My Orders
        </button>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(
    public cart: CartService,
    public router: Router,
    public auth: AuthService
  ) {}
  onLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
