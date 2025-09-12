import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { ProfilePageComponent } from './ui/profile-page/profile-page.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./ui/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./ui/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard], // First checks for login, then for admin role.
    data: { expectedRole: 'admin' },
    loadComponent: () =>
      import('./ui/admin-dashboard-page/admin-dashboard-page.component').then(
        (m) => m.AdminDashboardPageComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./ui/admin-dashboard-page/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./ui/admin-dashboard-page/admins/admins.component').then(
            (m) => m.AdminsComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./ui/admin-dashboard-page/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./ui/admin-dashboard-page/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./ui/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
