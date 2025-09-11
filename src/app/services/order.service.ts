import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OrderDetails,
  PaginatedOrderResponse,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersUrl = 'http://localhost:8080/api/v1/orders';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of the current user's orders.
   */
  getMyOrders(page: number, size: number): Observable<PaginatedOrderResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedOrderResponse>(this.ordersUrl, {
      params,
      withCredentials: true,
    });
  }

  /**
   * Fetches the details of a single order by its order number.
   */
  getOrderByOrderNumber(orderNumber: string): Observable<OrderDetails> {
    const url = `${this.ordersUrl}/${orderNumber}`;
    return this.http.get<OrderDetails>(url, { withCredentials: true });
  }
}
