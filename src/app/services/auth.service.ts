import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LoginUser } from '../models/loginUser.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = 'http://localhost:8080/api/v1/auth/register';
  private loginUrl = 'http://localhost:8080/api/v1/auth/login';
  private logoutUrl = 'http://localhost:8080/api/v1/auth/logout';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUserRole$ = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUserRole$ = this._currentUserRole$.asObservable();

  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http.post<any>(this.registerUrl, user);
  }

  login(loginUser: LoginUser) {
    const body = new HttpParams()
      .set('username', loginUser.username)
      .set('password', loginUser.password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .post<any>(this.loginUrl, body.toString(), {
        headers: headers,
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this._isLoggedIn$.next(true);
          this._currentUserRole$.next(response.role);
        })
      );
  }

  logout() {
    return this.http
      .post<any>(this.logoutUrl, null, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this._isLoggedIn$.next(false);
          this._currentUserRole$.next(null);
        })
      );
  }
}
