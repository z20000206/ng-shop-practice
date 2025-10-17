import { Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  // 進站導向商品列表 
  // path: '' 對應網址列的根目錄 
  // redirectTo: 'products' 表示導向 products 路由
  // pathMatch: 'full' 表示完整符合空字串才導向
  { path: '', redirectTo: 'products', pathMatch: 'full' },  // 進站導向商品列表
  //  path: 'products' 對應網址列的 /products 路由
  // component: Products 表示對應 Products 元件
  { path: 'products', component: Products },                // 商品列表（讀＋新增）
  { path: 'products/:id', component: ProductDetail },       // 商品詳情（讀＋編輯）
  { path: 'cart', component: Cart },                        // 購物車
  { path: 'admin', component: Admin }                       // 後台（預留）
];
