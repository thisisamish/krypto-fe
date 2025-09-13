import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileInfoComponent } from './components/profile-info.component';
import { OrderHistoryComponent } from './components/order-history.component';

type ProfileView = 'info' | 'orders';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent, OrderHistoryComponent],
  template: `
    <div class="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4 sm:p-6">
      <!-- Side Navigation -->
      <aside class="md:w-1/4 lg:w-1/5">
        <h1 class="text-2xl font-bold mb-4">My Account</h1>
        <nav class="space-y-2">
          <a
            (click)="setView('info')"
            [class.active]="currentView === 'info'"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
          >
            <i class="pi pi-user text-lg w-5 text-center"></i>
            <span>My Info</span>
          </a>
          <a
            (click)="setView('orders')"
            [class.active]="currentView === 'orders'"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
          >
            <i class="pi pi-box text-lg w-5 text-center"></i>
            <span>My Orders</span>
          </a>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="flex-1">
        <div [ngSwitch]="currentView">
          <app-profile-info *ngSwitchCase="'info'"></app-profile-info>
          <app-order-history *ngSwitchCase="'orders'"></app-order-history>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      a.active {
        background-color: #e5e7eb; /* bg-gray-200 */
        color: #111827; /* text-gray-900 */
      }
      a:not(.active) {
        color: #4b5563; /* text-gray-600 */
      }
      a:not(.active):hover {
        background-color: #f3f4f6; /* bg-gray-100 */
      }
    `,
  ],
})
export class ProfileComponent {
  currentView: ProfileView = 'info';

  setView(view: ProfileView): void {
    this.currentView = view;
  }
}
