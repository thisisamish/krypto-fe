import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../models/user.model';
import { LoginPayload, RegisterPayload } from '../models/auth.dto';

type NormalizedRole = 'admin' | 'customer' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private registerUrl = 'http://localhost:8080/api/v1/auth/register';
  private loginUrl = 'http://localhost:8080/api/v1/auth/login';
  private logoutUrl = 'http://localhost:8080/api/v1/auth/logout';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUserRole$ = new BehaviorSubject<NormalizedRole>(null);

  /** public observables */
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUserRole$ = this._currentUserRole$.asObservable();

  constructor(private http: HttpClient) {}

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
   * We return Observable<void> and do not toggle login flags here.
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

  /** Form-URL-Encoded login, as you had it */
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
