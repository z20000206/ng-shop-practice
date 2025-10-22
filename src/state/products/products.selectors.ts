// 引入 ngrx 的 createSelector 方法，主要用來建立選擇器 (selector)
import { createSelector } from '@ngrx/store';
// 引入產品 feature 狀態與選擇器
import { selectProductEntities } from './products.feature';

// 建立一個選擇器函式 selectProductById，根據傳入的產品 ID，從產品實體集合中取得對應的產品資料
export const selectProductById = (id: number) =>
  // ents 代表產品實體集合 (entities)，透過傳入的 ID 從中取得對應的產品資料
  createSelector(selectProductEntities, ents => ents[id] || null);
