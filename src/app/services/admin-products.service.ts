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
  private base = '/api/v1/admin/products';

  list(q: ProductQuery = {}): Observable<Page<Product>> {
    let params = new HttpParams();
    if (q.page !== undefined) params = params.set('page', q.page);
    if (q.pageSize !== undefined) params = params.set('size', q.pageSize);
    if (q.q) params = params.set('q', q.q);
    if (q.sort) params = params.set('sort', q.sort);
    return this.http.get<Page<Product>>(this.base, { params });
  }

  create(
    payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
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
