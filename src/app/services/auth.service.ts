// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from '../models/auth.dto';
import { AuthTokenService } from './auth-token.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBaseUrl;
  readonly isLoggedIn = signal<boolean>(false);

  constructor(private http: HttpClient, private token: AuthTokenService) {
    this.isLoggedIn.set(this.token.isLoggedIn());
  }

  login(payload: LoginPayload) {
    return this.http
      .post<LoginResponse>(`${this.base}/auth/login`, payload)
      .pipe(
        tap((res) => {
          this.token.set(
            res.accessToken,
            res.expiresIn ?? 900,
            res.roles ?? []
          );
          this.isLoggedIn.set(true);
        })
      );
  }

  // NEW: matches your backend (204 No Content or 2xx)
  register(payload: RegisterPayload) {
    return this.http
      .post<void>(`${this.base}/api/v1/auth/register`, payload, {
        observe: 'response',
      })
      .pipe(tap(() => {}));
  }

  logout() {
    this.token.clear();
    this.isLoggedIn.set(false);
  }

  isAdmin() {
    return this.token.isAdmin();
  }
}
