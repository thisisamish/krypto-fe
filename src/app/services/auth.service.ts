import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { LoginPayload, RegisterPayload } from '../models/auth.dto';

type NormalizedRole = 'admin' | 'customer' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private registerUrl = 'http://localhost:8080/api/v1/auth/register';
  private loginUrl = 'http://localhost:8080/api/v1/auth/login';
  private logoutUrl = 'http://localhost:8080/api/v1/auth/logout';
  private meUrl = 'http://localhost:8080/api/v1/auth/me'; // Endpoint to check session status

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUserRole$ = new BehaviorSubject<NormalizedRole>(null);

  /** public observables */
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUserRole$ = this._currentUserRole$.asObservable();

  constructor(private http: HttpClient) {
    // Check for an existing session when the service is initialized.
    // This will automatically log in the admin or customer if a valid session exists.
    this.checkAuthenticationStatus().subscribe();
  }

  /** Returns true if the current user has the 'admin' role */
  isAdmin(): boolean {
    return this._currentUserRole$.value === 'admin';
  }

  /**
   * Checks the backend for a valid session cookie and updates the login state.
   * This is called once on application startup.
   */
  checkAuthenticationStatus(): Observable<any> {
    return this.http.get<any>(this.meUrl, { withCredentials: true }).pipe(
      tap((response) => {
        // If we get a valid response, the user is logged in.
        this._isLoggedIn$.next(true);
        const normalized = this.normalizeRole(response?.role);
        this._currentUserRole$.next(normalized);
      }),
      catchError((error) => {
        // If the request fails (e.g., 401 Unauthorized), the user is not logged in.
        this._isLoggedIn$.next(false);
        this._currentUserRole$.next(null);
        // Return an empty observable to let the application continue.
        return of(null);
      })
    );
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
  login(loginUser: LoginPayload) {
    const body = new HttpParams()
      .set('username', loginUser.username)
      .set('password', loginUser.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<any>(this.loginUrl, body.toString(), {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this._isLoggedIn$.next(true);
          const normalized = this.normalizeRole(response?.role);
          this._currentUserRole$.next(normalized);
        })
      );
  }

  /** Logs the user out and clears the session state */
  logout() {
    return this.http
      .post<any>(this.logoutUrl, null, { withCredentials: true })
      .pipe(
        tap(() => {
          this._isLoggedIn$.next(false);
          this._currentUserRole$.next(null);
        })
      );
  }
}
