import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // uses your isLoggedIn$
import { take } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex justify-between items-center h-[4rem]">
      <div>
        <p class="text-[1.7rem] font-black">KRYPTO</p>
      </div>

      <div *ngIf="!(auth.isLoggedIn$ | async)">
        <button
          class="rounded-md px-6 py-2 bg-green-600 cursor-pointer text-white hover:bg-green-700 transition"
          (click)="router.navigate(['/login'])"
        >
          Login
        </button>
      </div>

      <div *ngIf="auth.isLoggedIn$ | async" class="flex gap-4 items-center">
        <!-- LOGOUT button -->
        <button
          type="button"
          class="btn btn-ghost btn-md rounded-full !w-10 !h-10 p-0"
          (click)="logout()"
          aria-label="Logout"
        >
          <span class="pi pi-sign-out"></span>
        </button>

        <!-- ACCOUNT button (like Cart), routes to /profile -->
        <button
          type="button"
          class="btn btn-ghost btn-md rounded-full !w-10 !h-10 p-0"
          (click)="goToProfile()"
          aria-label="Account"
        >
          <span class="pi pi-user"></span>
        </button>

        <!-- CART button (existing) -->
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
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(
    public readonly cart: CartService,
    public readonly router: Router,
    public readonly auth: AuthService
  ) {}

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        // Navigate to the login page after successful logout
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        // Fallback navigation in case of an error
        this.router.navigate(['/login']);
      },
    });
  }

  goToProfile() {
    // Use take(1) to automatically unsubscribe after the first emission.
    this.auth.isLoggedIn$.pipe(take(1)).subscribe((logged) => {
      this.router.navigate([logged ? '/profile' : '/login']);
    });
  }
}
