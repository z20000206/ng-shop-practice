// inject: 用於在 class 中注入依賴
// injectable 讓這個 class 可以被注入到 Angular 的依賴注入系統中
import { inject, Injectable } from '@angular/core';
// Actions: 用於監聽和處理 Action 流
// createEffect: 用於建立 Effect
// ofType: 用於過濾特定類型的 Action
import { Actions, createEffect, ofType } from '@ngrx/effects';

// 匯入產品相關的 Actions 和 Service
import { ProductsActions } from './products.actions';
import { ProductsService } from './products.service';

// RxJS 操作符
// catchError: 用於捕捉錯誤
// map: 用於轉換 Observable 的資料
// mergeMap: 用於將一個 Observable 映射成另一個 Observable，並合併輸出
// of: 用於建立一個發出特定值的 Observable
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ProductsEffects {
  // inject 依賴注入 Actions 和 ProductsService
  private actions$ = inject(Actions);
  private api = inject(ProductsService);

  // 讀取產品列表的 Effect
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.load),
      mergeMap(() =>
        this.api.list().pipe(
          map(items => ProductsActions.loadSuccess({ items })),
          catchError(error => of(ProductsActions.loadFailure({ error })))
        )
      )
    )
  );

  // 新增產品的 Effect
  create$ = createEffect(() =>
    // 監聽 create Action
    // pipe 中處理非同步邏輯
    this.actions$.pipe(
      // ofType() 在 actions 流中篩選出特定類型的 Action
      // ofType 過濾出 create Action
      ofType(ProductsActions.create),
      // 使用 mergeMap 處理「非同步行為」的轉換運算子，會同時展開多個內層請求，不會互相取消。
      // 從 Action 中取得 dto，並呼叫 API 進行新增
      mergeMap(({ dto }) =>
        // 呼叫 ProductsService 的 create 方法
        this.api.create(dto).pipe(
          // 成功時，回傳 createSuccess Action 並帶上新增的產品資料
          map(item => ProductsActions.createSuccess({ item })),
          // 失敗時，回傳 createFailure Action 並帶上錯誤資訊
          catchError(error => of(ProductsActions.createFailure({ error })))
        )
      )
    )
  );

  // 更新產品的 Effect
  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.update),
      mergeMap(({ id, dto }) =>
        this.api.update(id, dto).pipe(
          map(item => ProductsActions.updateSuccess({ item })),
          catchError(error => of(ProductsActions.updateFailure({ error })))
        )
      )
    )
  );

  // 刪除產品的 Effect
  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.remove),
      mergeMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => ProductsActions.removeSuccess({ id })),
          catchError(error => of(ProductsActions.removeFailure({ error })))
        )
      )
    )
  );
}
