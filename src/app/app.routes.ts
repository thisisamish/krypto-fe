import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@features/customer/routes').then((m) => m.CUSTOMER_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@features/auth/routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@features/admin/routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@shared/pages/not-found/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
