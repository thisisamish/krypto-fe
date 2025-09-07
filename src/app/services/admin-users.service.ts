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
  private base = '/api/v1/admin/users';

  list(q: UserQuery = {}): Observable<Page<User>> {
    let params = new HttpParams();
    if (q.page !== undefined) params = params.set('page', q.page);
    if (q.pageSize !== undefined) params = params.set('size', q.pageSize);
    if (q.q) params = params.set('q', q.q);
    if (q.role) params = params.set('role', q.role);
    if (q.status) params = params.set('status', q.status);
    if (q.sort) params = params.set('sort', q.sort);
    return this.http.get<Page<User>>(this.base, { params });
  }

  forceLogout(userId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${userId}/logout`, {});
  }
}
