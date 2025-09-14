// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

export const authGuard: CanActivateFn = () => {
  const token = inject(AuthTokenService);
  const router = inject(Router);
  if (!token.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
