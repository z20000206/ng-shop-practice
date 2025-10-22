// 匯入 Angular 核心 API：Component 裝飾器、inject 取用 DI、effect 用於監聽 signal 變化
import { Component, inject, effect, signal } from '@angular/core';
// 匯入共用指令（*ngIf、*ngFor 等）
import { CommonModule } from '@angular/common';
// 讀取路由參數需要 ActivatedRoute；RouterLink 讓樣板可用 [routerLink]
import { ActivatedRoute, RouterLink } from '@angular/router';
// 使用「非空版」表單建構器，讓控制項值型別不含 null；也匯入驗證器
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
// NgRx Store（dispatch action、select 狀態）
import { Store } from '@ngrx/store';
// 產品領域 actions（load / update 等）
import { ProductsActions } from '../../../state/products/products.actions';
// 建立 memoized selector 的工具
import { createSelector } from '@ngrx/store';
// 從 feature 中匯入 entity 映射（id -> entity）
import { selectProductEntities } from '../../../state/products/products.feature';

@Component({
  // 宣告為 Standalone 組件
  standalone: true,
  // 組件的自訂選擇器（在 HTML 可用 <app-product-detail>）
  selector: 'app-product-detail',
  // 這個組件會用到的模組（模板內的指令/表單/路由連結）
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {
  // 取用 NgRx Store（用於 dispatch 與 select）
  private store = inject(Store);
  // 使用 NonNullableFormBuilder：建立不含 null 的 reactive form
  private fb = inject(NonNullableFormBuilder);
  // 取用 ActivatedRoute：讀取路由參數
  private route = inject(ActivatedRoute);

  // 讀取 URL 上的 :id 參數（例如 /products/3），轉成 number
  // 使用 readonly 可避免後續被更動
  readonly id = Number(this.route.snapshot.paramMap.get('id'));

  // 以 createSelector 組合出「由 id 取出對應實體」的 selector
  // selectProductEntities 回傳 Record<number, Product>（或類似），用 id 存取
  // 沒找到回傳 undefined（避免傳遞 null）
  readonly product$ = this.store.selectSignal(
    createSelector(selectProductEntities, ents => ents[this.id])
  );

  // 以 non-nullable 方式建立表單：
  // 每個 control 的值型別分別是 string/number（不會是 string | null ）
  readonly form = this.fb.group({
    // 名稱：必填、長度上限 50
    title: this.fb.control('', { validators: [Validators.required, Validators.maxLength(50)] }),
    // 價格：必填且 >= 0
    price: this.fb.control(0, { validators: [Validators.required, Validators.min(0)] }),
    // 庫存：必填且 >= 0
    stock: this.fb.control(0, { validators: [Validators.required, Validators.min(0)] }),
    // 圖片 URL：可留空（空字串），型別為 string
    cover: this.fb.control(''),
  });

  // ✅ 新增：圖片即時預覽用 signal
  //    預設為 undefined（不顯示預覽），當使用者選檔後會變成 base64
  previewUrl = signal<string | undefined>(undefined);

  // 使用 Angular signals 的 effect 監聽 store signal：
  // 每當 product$() 的值改變（例如載入完成），就把資料 patch 到表單
  private fillEffect = effect(() => {
    const p = this.product$();   // 取出目前的產品（可能是 Product 或 undefined）
    if (p) {
      // patchValue：只套用存在於表單的欄位，忽略其他屬性
      this.form.patchValue(p);
      // ✅ 若想進入頁面就顯示現有封面，可將下行打開
      // this.previewUrl.set(p.cover);
    }
  });

  // ngOnInit：進入頁面時要求載入清單（實務上可加「是否已載入」判斷）
  ngOnInit(): void {
    // 觸發讀取（Effects 會去 call API，reducer 會把資料寫進 entities）
    this.store.dispatch(ProductsActions.load());
  }

  // ✅ 新增：處理 <input type="file"> 選檔事件
  //    功能：
  //    1. 使用 FileReader 讀取檔案內容為 base64
  //    2. 把 base64 字串寫入 form.cover
  //    3. 將 base64 存入 previewUrl() 供畫面即時預覽
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement; // 取得 input 元素
    if (!input.files?.length) return;               // 若未選檔則直接離開
    const file = input.files[0];                    // 取第一個檔案

    const reader = new FileReader();                // 建立 FileReader 物件
    reader.onload = () => {
      const base64 = reader.result as string;       // 讀取結果（dataURL 格式的 base64）
      this.form.patchValue({ cover: base64 });      // 寫入表單 cover 欄位
      this.previewUrl.set(base64);                  // 設定預覽圖片來源
    };

    reader.readAsDataURL(file);                     // 以 base64 形式讀取檔案
  }

  // 點擊「儲存」時呼叫：做驗證、送出 update action
  save(): void {
    // 表單無效就不送
    if (this.form.invalid) return;

    // non-nullable 的 getRawValue() 不含 null，型別是
    // { title: string; price: number; stock: number; cover: string }
    const dto = this.form.getRawValue();

    // 若希望空字串 cover 不送給後端，可轉成 undefined（可選）：
    // const dto = { ...raw, cover: raw.cover ? raw.cover : undefined };

    // 發出更新 action（Effects 會處理呼叫 API、成功後回到 reducer 更新 entities）
    this.store.dispatch(ProductsActions.update({ id: this.id, dto }));

    // 簡單提示
    alert('已儲存');
  }
}
