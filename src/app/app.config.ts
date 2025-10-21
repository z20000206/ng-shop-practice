// 「應用程式層級設定介面」，專門放「提供者 (providers)」、HTTP、Router、NgRx 等全域設定。
import { ApplicationConfig } from '@angular/core';
// Router 導入
import { provideRouter } from '@angular/router';
// 匯入路由設定
import { routes } from './app.routes';
// HttpClient 導入，啟用整個 Angular 的 HTTP 功能
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// NgRx 導入
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';

import { productsFeature } from '../state/products/products.feature';
import { ProductsEffects } from '../state/products/products.effects';
// import { cartFeature } from '../state/cart/cart.feature';
// import { CartEffects } from '../state/cart/cart.effects';

// ApplicationConfig 物件，設定應用程式的全域提供者
export const appConfig: ApplicationConfig = {
  // providers 陣列用於註冊全域服務與設定
  providers: [
    // 註冊路由
    provideRouter(routes),         
    // 啟用 HttpClient + DI 攔截器(可以攔截 HTTP 請求與回應)                           
    provideHttpClient(withInterceptorsFromDi()),        
    // Store root      
    provideStore(),             
    // Effects root                               
    provideEffects(),            
    // 讓路由同步到 Store                              
    provideRouterStore(),                               
    // DevTools       
    // maxAge: 25 表示保留最近 25 筆狀態變更紀錄
    // logOnly: false 表示允許在非開發環境也能使用 DevTools（可視需求調整）
    provideStoreDevtools({ maxAge: 25, logOnly: false }),      
    provideState(productsFeature),                                // ✅ 產品 feature 狀態
    provideEffects(ProductsEffects),                              // ✅ 產品 Effects
    // cartFeature.provideState(),                                // ✅ 購物車 feature 狀態
    // provideEffects(CartEffects)                                // ✅ 購物車 Effects（此範例先簡化）
  ]
};
