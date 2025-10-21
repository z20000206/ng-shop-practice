// 從 NgRx 匯入 建立Action的工具
// createActionGroup: 用於建立一組相關的Actions
// props: 用於定義Action的參數
// emptyProps: 用於定義沒有參數的Action
import { createActionGroup, props, emptyProps } from '@ngrx/store';
// 匯入物件模型
import { Product } from './products.models';

// 建立產品相關的Actions
export const ProductsActions = createActionGroup({
  // 這組 actions 的來源標籤（命名空間）
  source: 'Products',
  // 列出這組裡面要產生的「事件（actions）」清單
  events: {
    // 讀取
    // 宣告一個不帶資料的 Load action
    'Load': emptyProps(),
    // 宣告一個帶有 items 資料的 Load Success action
    // props 定義這個 action 會帶入一個 items 參數，型別為 Product 陣列
    'Load Success': props<{ items: Product[] }>(),
    // 宣告一個帶有 error 資料的 Load Failure action
    // 刪除失敗會帶入 error 參數
    'Load Failure': props<{ error: unknown }>(),

    // 新增
    // Omit 表示 dto 物件會包含 Product 除了 id 以外的所有屬性
    'Create': props<{ dto: Omit<Product, 'id'> }>(),
    'Create Success': props<{ item: Product }>(),
    'Create Failure': props<{ error: unknown }>(),

    // 更新
    // Partial 表示 dto 物件可以只包含部分 Product 屬性，讓更新時沒有變更的屬性可以留白
    'Update': props<{ id: number; dto: Partial<Product> }>(),
    'Update Success': props<{ item: Product }>(),
    'Update Failure': props<{ error: unknown }>(),

    // 刪除
    // props 定義這個 action 會帶入一個 id 參數
    'Remove': props<{ id: number }>(),
    'Remove Success': props<{ id: number }>(),
    'Remove Failure': props<{ error: unknown }>(),
  }
});
