import { Routes } from '@angular/router';
import { LoginPageComponent } from './ui/login-page/login-page.component';
import { RegisterPageComponent } from './ui/register-page/register-page.component';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./ui/admin-dashboard-page/admin-dashboard-page.module').then(
        (m) => m.AdminDashboardPageModule
      ),
    canActivate: [roleGuard],
    data: { expectedRole: 'ROLE_ADMIN' },
  },
];
