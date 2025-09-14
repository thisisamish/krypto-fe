// src/app/services/checkout.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PlaceOrderRequest, OrderResponse } from '../models/order.dto';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  placeOrder(req: PlaceOrderRequest) {
    return this.http.post<OrderResponse>(
      `${this.base}/api/v1/checkout/place-order`,
      req
    );
  }
}
