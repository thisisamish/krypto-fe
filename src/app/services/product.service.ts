import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'http://localhost:8080/api/v1/products';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of products from the API.
   * @param page - The page number to retrieve (0-indexed).
   * @param size - The number of items per page.
   * @returns An Observable of the paginated product response.
   */
  getProducts(
    page: number,
    size: number
  ): Observable<PaginatedProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedProductResponse>(this.productsUrl, {
      params,
      withCredentials: true, // Important for session-based auth
    });
  }
}
