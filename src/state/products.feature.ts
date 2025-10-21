// creatFeature 用於建立 NgRx feature 狀態
// createReducer 用於建立 reducer 函式
// on 用於定義 action 與對應的狀態變更邏輯
import { createFeature, createReducer, on } from '@ngrx/store';

// createEntityAdapter 用於建立實體適配器，方便管理實體集合
// EntityState 是實體集合的狀態介面
import { createEntityAdapter, EntityState } from '@ngrx/entity';

// 匯入產品模型與產品相關的 actions
import { Product } from './products.models';
import { ProductsActions } from './products.actions';

// 定義產品狀態介面，繼承自 EntityState<Product>
// EntityState 管理同類型實體的集合
export interface ProductsState extends EntityState<Product> {
  loading: boolean;        // 請求中
  error: unknown;         // 錯誤
}

// 建立實體適配器，指定主鍵為產品的 id 屬性
// createEntityAdapter 會自動產生一組操作實體集合的方法
// 提供一組管理「以 id 為主鍵的集合」的工具（CRUD、排序、Selectors）
const adapter = createEntityAdapter<Product>({   
  // 告訴NgRx 哪個屬性是實體的唯一標識符
  selectId: (p) => p.id
});

// 初始化狀態
// getInitialState 會建立一個包含實體集合結構的初始狀態
const initialState: ProductsState = adapter.getInitialState({
  loading: false,
  error: undefined
});

// 建立 reducer，定義各種 action 對應的狀態變更邏輯
const reducer = createReducer(
  initialState,
  // Load
  // 物件展開，建立新的state，重置錯誤、切換載入中狀態，並保持其他資料不變
  on(ProductsActions.load, (s) => ({ ...s, loading: true, error: undefined })),
  // 載入成功，使用 adapter 的 setAll 方法將載入的產品設置到狀態中
  on(ProductsActions.loadSuccess, (s, { items }) =>
    ({ ...adapter.setAll(items, s), loading: false })),
  // 載入失敗，更新錯誤訊息並關閉載入中狀態
  on(ProductsActions.loadFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),

  // Create
  on(ProductsActions.create, (s) => ({ ...s, loading: true })),
  on(ProductsActions.createSuccess, (s, { item }) =>
    // 使用 adapter 的 addOne 方法將新產品加入狀態中
    ({ ...adapter.addOne(item, s), loading: false })),
  on(ProductsActions.createFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),

  // Update
  on(ProductsActions.update, (s) => ({ ...s, loading: true })),
  on(ProductsActions.updateSuccess, (s, { item }) =>
    // 使用 adapter 的 upsertOne 方法更新或插入產品
    ({ ...adapter.upsertOne(item, s), loading: false })),
  on(ProductsActions.updateFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),

  // Remove
  on(ProductsActions.remove, (s) => ({ ...s, loading: true })),
  on(ProductsActions.removeSuccess, (s, { id }) =>
    // 使用 adapter 的 removeOne 方法將產品從狀態中移除
    ({ ...adapter.removeOne(id, s), loading: false })),
  on(ProductsActions.removeFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),
);


// 建立 feature，將 reducer 與 feature 名稱綁定
export const productsFeature = createFeature({
  name: 'products',
  reducer
});

// 匯出實體選擇器，方便在元件或其他地方選取產品資料
export const {
  // 選取所有產品實體
  selectAll: selectAllProducts,
  // 選取產品實體的字典
  selectEntities: selectProductEntities,
  // 選取產品實體的 ID 陣列
  selectIds: selectProductIds,
  // 選取產品實體的總數
  selectTotal: selectProductTotal
} = adapter.getSelectors(productsFeature.selectProductsState);
