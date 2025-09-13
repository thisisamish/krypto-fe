import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen grid md:grid-cols-[260px_1fr]">
      <!-- Sidebar -->
      <aside
        class="bg-neutral-900 text-neutral-100 p-4 md:min-h-screen flex flex-col"
      >
        <div>
          <div class="flex items-center gap-2 text-lg font-semibold mb-6">
            <i class="pi pi-shield"></i>
            <span>Admin Panel</span>
          </div>
          <nav class="space-y-1">
            <a
              routerLink="/admin"
              routerLinkActive="!bg-neutral-800"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
              >Dashboard Home</a
            >
            <a
              routerLink="/admin/admins"
              routerLinkActive="!bg-neutral-800"
              class="block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
              >Admins</a
            >
            <a
              routerLink="/admin/products"
              routerLinkActive="!bg-neutral-800"
              class="block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
              >Products</a
            >
            <a
              routerLink="/admin/users"
              routerLinkActive="!bg-neutral-800"
              class="block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
              >Users</a
            >
          </nav>
        </div>
        <!-- Logout Button -->
        <div class="mt-auto">
          <button
            (click)="logout()"
            class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-red-400 hover:bg-neutral-800 transition"
          >
            <i class="pi pi-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Content -->
      <main class="p-4 md:p-8 bg-neutral-50">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminDashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout failed', err),
    });
  }
}
