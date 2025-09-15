import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/pagination.model';
import { User } from '../models/user.model';

export interface UserQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  role?: 'admin' | 'customer';
  status?: 'active' | 'locked';
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/v1/admin/users';

  list({
    page,
    pageSize,
    q,
    role,
  }: {
    page: number;
    pageSize: number;
    q?: string;
    role?: 'ADMIN' | 'CUSTOMER';
  }) {
    let params = new HttpParams()
      .set('page', String(page - 1))
      .set('size', String(pageSize));
    if (q) params = params.set('q', q);
    if (role) params = params.set('role', role);
    return this.http.get<Page<User>>('/api/v1/users', { params });
  }

  forceLogout(userId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${userId}/logout`, {});
  }
}
