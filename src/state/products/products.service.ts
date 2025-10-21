// inject: 用於在 class 中注入依賴
// injectable 讓這個 class 可以被注入到 Angular 的依賴注入系統中
import { Injectable, inject } from '@angular/core';
// HttpClient: 用於發送 HTTP 請求
import { HttpClient } from '@angular/common/http';
// 匯入產品模型
import { Product } from './products.models';
// RxJS Observable: 用於處理非同步資料流
import { Observable } from 'rxjs';

// 產品服務，負責與後端 API 進行通訊
// providedIn 用來指定服務的提供範圍，'root' 表示在整個應用程式中都是單例
@Injectable({ providedIn: 'root' })
// ProductsService 提供產品相關的 CRUD 操作
export class ProductsService {
  // inject 依賴注入 HttpClient
  private http = inject(HttpClient);
  // API 基本路徑 (json-server 端點)
  private base = 'http://localhost:3000/products';

  // 取得產品列表
  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);      
  }

  // 取得單一產品詳情
  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`); // GET /products/:id
  }

  // 新增產品
  // Omit 用來從 Product 型別中排除 'id' 屬性，因為新增產品時不需要提供 id
  create(dto: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.base, dto);      // POST /products
  }

  // 更新產品
  // Partial 用來表示 dto 物件可以只包含部分的 Product 屬性
  update(id: number, dto: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, dto); // PUT /products/:id
  }

  // 刪除產品
  // void 表示此方法不會回傳任何資料
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`); // DELETE /products/:id
  }
}
