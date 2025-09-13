import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import {
  AuthUser,
  LoginPayload,
  LoginResponse,
  MeResponse,
  NormalizedRole,
  RegisterPayload,
} from '../models/auth.dto';
import { environment } from 'environments/environment';
import { apiUrl } from '@shared/utils/api-url.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private registerUrl = apiUrl(environment.api.endpoints.auth.register);
  private loginUrl = apiUrl(environment.api.endpoints.auth.login);
  private logoutUrl = apiUrl(environment.api.endpoints.auth.logout);
  private meUrl = apiUrl(environment.api.endpoints.auth.me);

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUserRole$ = new BehaviorSubject<NormalizedRole>(null);
  private _currentUser$ = new BehaviorSubject<AuthUser | null>(null);

  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUserRole$ = this._currentUserRole$.asObservable();
  user$ = this._currentUser$.asObservable();

  constructor(private http: HttpClient) {
    // Check for an existing session when the service is initialized.
    // This will automatically log in the admin or customer if a valid session exists.
    this.checkAuthenticationStatus().subscribe();
  }

  isAdmin(): boolean {
    return this._currentUserRole$.value === 'admin';
  }

  /**
   * Checks the backend for a valid session cookie and updates the login state.
   * This is called once on application startup.
   */
  checkAuthenticationStatus(): Observable<AuthUser | null> {
    return this.http
      .get<MeResponse>(this.meUrl, { withCredentials: true })
      .pipe(
        map((res) => this.hydrateUserFromMe(res)),
        catchError(() => {
          this._isLoggedIn$.next(false);
          this._currentUserRole$.next(null);
          this._currentUser$.next(null);
          return of(null);
        })
      );
  }

  private hydrateUserFromMe(res: MeResponse): AuthUser {
    const normalized = this.normalizeRole(res.role);
    const user: AuthUser = {
      username: res.username,
      firstName: res.firstName,
      role: normalized,
    };
    this._isLoggedIn$.next(true);
    this._currentUserRole$.next(normalized);
    this._currentUser$.next(user);
    return user;
  }

  /** Convert backend style (e.g., "ROLE_ADMIN") -> "admin" */
  normalizeRole(role: string | null | undefined): NormalizedRole {
    if (!role) return null;
    const r = role.startsWith('ROLE_') ? role.slice(5) : role;
    const low = r.toLowerCase();
    return low === 'admin' || low === 'customer'
      ? (low as NormalizedRole)
      : null;
  }

  /**
   * Register user against a backend that responds with 204 No Content.
   */
  register(payload: RegisterPayload): Observable<void> {
    return this.http
      .post<void>(this.registerUrl, payload, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          // Expect 204; treat any 2xx as success.
          if (res.ok) return;
          throw new Error(`Unexpected status: ${res.status}`);
        })
      );
  }

  /** Form-URL-Encoded login */
  login(loginUser: LoginPayload): Observable<AuthUser> {
    const body = new HttpParams()
      .set('username', loginUser.username)
      .set('password', loginUser.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<LoginResponse>(this.loginUrl, body.toString(), {
        headers,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          const normalized = this.normalizeRole(response.role);
          const user: AuthUser = {
            username: response.username,
            firstName: response.firstName,
            role: normalized,
          };
          this._isLoggedIn$.next(true);
          this._currentUserRole$.next(normalized);
          this._currentUser$.next(user);
          return user;
        })
      );
  }

  /** Logs the user out and clears the session state */
  logout(): Observable<void> {
    return this.http
      .post<unknown>(this.logoutUrl, null, { withCredentials: true })
      .pipe(
        map(() => {
          this._isLoggedIn$.next(false);
          this._currentUserRole$.next(null);
          this._currentUser$.next(null);
        })
      );
  }
}
