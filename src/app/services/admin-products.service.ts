import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/pagination.model';
import { Product } from '../models/product.model';

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminProductsService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/v1/admin/products';

  list(q: ProductQuery = {}): Observable<Page<Product>> {
    let params = new HttpParams();
    // Note: Spring Boot pagination is often 0-indexed, so we might send page - 1
    if (q.page !== undefined) params = params.set('page', q.page - 1);
    if (q.pageSize !== undefined) params = params.set('size', q.pageSize);
    if (q.q) params = params.set('q', q.q);
    if (q.sort) params = params.set('sort', q.sort);
    // The service now expects the new Page<Product> structure from the API
    return this.http.get<Page<Product>>(this.base, { params });
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(
    // Payload updated to Omit 'id' and 'created_at' from the new Product model
    payload: Omit<Product, 'id' | 'created_at'>
  ): Observable<Product> {
    return this.http.post<Product>(this.base, payload);
  }

  update(id: number, payload: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
