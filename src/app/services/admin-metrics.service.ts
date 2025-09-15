// app/services/admin-metrics.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminMetricsService {
  constructor(private http: HttpClient) {}

  getCounts() {
    // get just page metadata (size=1) to read totalElements
    const orders$ = this.http.get<any>('/api/v1/admin/orders', {
      params: new HttpParams().set('page', 0).set('size', 1),
    });
    const customers$ = this.http.get<any>('/api/v1/users', {
      params: new HttpParams()
        .set('role', 'CUSTOMER')
        .set('page', 0)
        .set('size', 1),
    });
    const admins$ = this.http.get<any>('/api/v1/users', {
      params: new HttpParams()
        .set('role', 'ADMIN')
        .set('page', 0)
        .set('size', 1),
    });

    return forkJoin([orders$, customers$, admins$]).pipe(
      map(([o, c, a]) => ({
        totalOrders: o?.totalElements ?? 0,
        totalCustomers: c?.totalElements ?? 0,
        totalAdmins: a?.totalElements ?? 0,
      }))
    );
  }
}
