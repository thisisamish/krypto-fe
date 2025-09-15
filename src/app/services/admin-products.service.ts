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

  list({ page, pageSize }: { page: number; pageSize: number }) {
    const params = new HttpParams()
      .set('page', String(page - 1))
      .set('size', String(pageSize));
    return this.http.get<Page<Product>>('/api/v1/products', { params });
  }
  create(p: Product) {
    return this.http.post<Product>('/api/v1/products', p);
  }
  delete(id: number) {
    return this.http.delete<void>(`/api/v1/products/${id}`);
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
}
