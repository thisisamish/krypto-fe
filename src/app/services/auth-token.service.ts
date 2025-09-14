// src/app/services/auth-token.service.ts
import { Injectable } from '@angular/core';

const KEY = 'auth.token';
const EXP_KEY = 'auth.token.expiryEpochMs';
const ROLES_KEY = 'auth.roles';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  get token(): string | null {
    const t = localStorage.getItem(KEY);
    const exp = Number(localStorage.getItem(EXP_KEY) ?? 0);
    if (!t || !exp) return null;
    if (Date.now() > exp) {
      this.clear();
      return null;
    }
    return t;
  }

  get roles(): string[] {
    try {
      return JSON.parse(localStorage.getItem(ROLES_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  set(token: string, expiresInSeconds: number, roles: string[]) {
    const expMs = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(KEY, token);
    localStorage.setItem(EXP_KEY, String(expMs));
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles ?? []));
  }

  clear() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(EXP_KEY);
    localStorage.removeItem(ROLES_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.roles.map((r) => r.toLowerCase()).includes('admin');
  }
}
