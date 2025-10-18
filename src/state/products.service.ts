import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './products.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/products'; // json-server 端點

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);        // GET /products
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`); // GET /products/:id
  }

  create(dto: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.base, dto);      // POST /products
  }

  update(id: number, dto: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, dto); // PUT /products/:id
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`); // DELETE /products/:id
  }
}
