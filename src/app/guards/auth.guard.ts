import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

/**
 * This guard protects routes that require a user to be logged in.
 * It relies on the AuthService.isLoggedIn$ observable, which is automatically
 * updated by the checkAuthenticationStatus() method on app start.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        // Redirect to login page if not authenticated
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
