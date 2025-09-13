import { Routes } from '@angular/router';
import { authGuard } from '@features/auth/guards/auth.guard';
import { roleGuard } from '@features/auth/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    // Prefer canMatch to prevent loading for non-admins; canActivate also OK.
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    providers: [
      // admin-only providers, resolvers, feature services (optional)
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/dashboard/components/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./pages/dashboard/admins/admins.component').then(
            (m) => m.AdminsComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/dashboard/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/dashboard/customers/customers.component').then(
            (m) => m.CustomersComponent
          ),
      },
    ],
  },
];
