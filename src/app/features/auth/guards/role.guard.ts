import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * This guard protects routes based on user role (e.g., 'admin').
 * It checks the currentUserRole$ from AuthService against the expected role
 * defined in the route's data configuration.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  if (!expectedRole) {
    throw new Error('Expected role is not defined in the route data.');
  }

  return authService.currentUserRole$.pipe(
    take(1),
    map((role) => {
      if (role === expectedRole) {
        return true;
      }
      // If the role does not match, redirect to the home page or a 'forbidden' page.
      router.navigate(['/']);
      return false;
    })
  );
};
