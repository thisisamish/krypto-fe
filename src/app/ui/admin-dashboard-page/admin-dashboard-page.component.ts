import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard-page',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen grid md:grid-cols-[260px_1fr]">
      <!-- Sidebar -->
      <aside class="bg-neutral-900 text-neutral-100 p-4 md:min-h-screen">
        <div class="flex items-center gap-2 text-lg font-semibold mb-6">
          <i class="pi pi-shield"></i>
          <span>Admin</span>
        </div>
        <nav class="space-y-1">
          <a
            routerLink="/admin"
            routerLinkActive="!bg-neutral-800"
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
      </aside>

      <!-- Content -->
      <main class="p-4 md:p-8 bg-neutral-50">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminDashboardPageComponent {}
