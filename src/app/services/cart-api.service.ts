// src/app/services/cart-api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AddCartItemRequest,
  UpdateCartItemRequest,
  CartResponse,
} from '../models/cart.dto';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCart() {
    return this.http.get<CartResponse>(`${this.base}/api/v1/cart/`);
  }

  addItem(req: AddCartItemRequest) {
    return this.http.post<CartResponse>(`${this.base}/api/v1/cart/items`, req);
  }

  updateItem(productId: number, req: UpdateCartItemRequest) {
    return this.http.put<CartResponse>(
      `${this.base}/api/v1/cart/items/${productId}`,
      req
    );
  }
}
