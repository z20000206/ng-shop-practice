import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from './products.models';
import { ProductsActions } from './products.actions';

export interface ProductsState extends EntityState<Product> {
  loading: boolean;        // 請求中
  error: unknown;         // 錯誤
}

const adapter = createEntityAdapter<Product>({   // 以 id 為主鍵
  selectId: (p) => p.id
});

const initialState: ProductsState = adapter.getInitialState({
  loading: false,
  error: undefined
});

const reducer = createReducer(
  initialState,
  // Load
  on(ProductsActions.load, (s) => ({ ...s, loading: true, error: undefined })),
  on(ProductsActions.loadSuccess, (s, { items }) =>
    ({ ...adapter.setAll(items, s), loading: false })),
  on(ProductsActions.loadFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),

  // Create
  on(ProductsActions.create, (s) => ({ ...s, loading: true })),
  on(ProductsActions.createSuccess, (s, { item }) =>
    ({ ...adapter.addOne(item, s), loading: false })),
  on(ProductsActions.createFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),

  // Update
  on(ProductsActions.update, (s) => ({ ...s, loading: true })),
  on(ProductsActions.updateSuccess, (s, { item }) =>
    ({ ...adapter.upsertOne(item, s), loading: false })),
  on(ProductsActions.updateFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),

  // Remove
  on(ProductsActions.remove, (s) => ({ ...s, loading: true })),
  on(ProductsActions.removeSuccess, (s, { id }) =>
    ({ ...adapter.removeOne(id, s), loading: false })),
  on(ProductsActions.removeFailure, (s, { error }) =>
    ({ ...s, loading: false, error })),
);

export const productsFeature = createFeature({
  name: 'products',
  reducer
});

export const {
  selectAll: selectAllProducts,
  selectEntities: selectProductEntities,
  selectIds: selectProductIds,
  selectTotal: selectProductTotal
} = adapter.getSelectors(productsFeature.selectProductsState);
