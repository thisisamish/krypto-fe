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

  list({ page, pageSize, q }: { page: number; pageSize: number; q?: string }) {
    let params = new HttpParams()
      .set('page', String(page - 1))
      .set('size', String(pageSize))
      .set('role', 'ADMIN');
    if (q) params = params.set('q', q);
    return this.http.get<Page<User>>('/api/v1/users', { params });
  }
  create(body: { username: string; email: string; password: string }) {
    return this.http.post<User>('/api/v1/users', body);
  }
  update(username: string, payload: Partial<Pick<User, 'email'>>) {
    return this.http.put<User>(
      `/api/v1/users/${encodeURIComponent(username)}`,
      payload
    );
  }
  delete(username: string) {
    return this.http.delete<void>(
      `/api/v1/users/${encodeURIComponent(username)}`
    );
  }
}
