import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminMetrics } from '../models/metrics.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminMetricsService {
  private http = inject(HttpClient);
  private base = '/api/v1/admin';

  getMetrics(): Observable<AdminMetrics> {
    return this.http.get<AdminMetrics>(`${this.base}/metrics`);
  }
}
