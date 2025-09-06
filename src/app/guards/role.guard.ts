import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  return authService.currentUserRole$.pipe(
    take(1),
    map((role) => {
      if (role === expectedRole) {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
