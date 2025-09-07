import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/pagination.model';
import { User } from '../models/user.model';

export interface AdminQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAdminsService {
  private http = inject(HttpClient);
  private base = '/api/v1/admin/admins';

  list(q: AdminQuery = {}): Observable<Page<User>> {
    let params = new HttpParams();
    if (q.page !== undefined) params = params.set('page', q.page);
    if (q.pageSize !== undefined) params = params.set('size', q.pageSize);
    if (q.q) params = params.set('q', q.q);
    if (q.sort) params = params.set('sort', q.sort);
    return this.http.get<Page<User>>(this.base, { params });
  }

  create(payload: {
    name: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(this.base, payload);
  }

  update(
    id: string,
    payload: Partial<Pick<User, 'name' | 'email' | 'active'>>
  ): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
