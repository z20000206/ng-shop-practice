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
    this.actions$.pipe(
      ofType(ProductsActions.create),
      mergeMap(({ dto }) =>
        this.api.create(dto).pipe(
          map(item => ProductsActions.createSuccess({ item })),
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
