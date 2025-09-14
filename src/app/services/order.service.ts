// src/app/services/order.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { OrderResponse, OrdersPage } from '../models/order.dto';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  list(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<OrdersPage>(`${this.base}/api/v1/orders`, { params });
  }

  getByOrderNumber(orderNumber: string) {
    return this.http.get<OrderResponse>(
      `${this.base}/api/v1/orders/${orderNumber}`
    );
  }
}
