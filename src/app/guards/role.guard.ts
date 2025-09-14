// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

export const roleGuard: CanActivateFn = (route): boolean | UrlTree => {
  const token = inject(AuthTokenService);
  const router = inject(Router);

  const expectedRole: string | undefined = route.data?.['expectedRole'];
  if (!expectedRole) {
    throw new Error('Expected role is not defined in the route data.');
  }

  if (!token.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const roles = token.roles.map((r) => r.toLowerCase());
  const want = expectedRole.toLowerCase();

  if (roles.includes(want)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
