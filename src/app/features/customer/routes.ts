import { Routes } from '@angular/router';
import { authGuard } from '@features/auth/guards/auth.guard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile-page.component').then(
        (m) => m.ProfileComponent
      ),
  },
];
