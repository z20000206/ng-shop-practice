import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { productsFeature, selectAllProducts } from '../../../state/products/products.feature';
import { ProductsActions } from '../../../state/products/products.actions';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  // 使用 selector 取得列表（配合 signal for push 變更）
  products$ = this.store.selectSignal(selectAllProducts);
  loading$ = this.store.selectSignal(productsFeature.selectLoading);

  // 新增商品表單（逐行解釋）
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]], // 名稱必填
    price: [0, [Validators.required, Validators.min(0)]], // 價格 >= 0
    stock: [0, [Validators.required, Validators.min(0)]], // 庫存 >= 0
    cover: [''], // 圖片 URL（可空）
  });

  // ⬇️ 新增：圖片預覽用（也可直接顯示 base64 畫面）
  previewUrl = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.load()); // 載入列表
  }

  // 處理 <input type="file"> 選檔，將檔案轉為 base64 並寫入 form.cover
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      // 將 base64 寫入表單的 cover 欄位，後端或 json-server 會收到完整字串
      this.form.patchValue({ cover: base64 });
      // 預覽圖片
      this.previewUrl.set(base64);
    };

    reader.readAsDataURL(file); // 讀成 dataURL（base64）
  }

  create(): void {
    if (this.form.invalid) return; // 驗證表單
    const dto = this.form.getRawValue();

    this.store.dispatch(
      ProductsActions.create({
        dto: {
          title: dto.title ?? '',
          price: dto.price ?? 0,
          stock: dto.stock ?? 0,
          cover: dto.cover ?? '', // 若有上傳檔案即為 base64，否則可為空字串
        },
      })
    );

    // 重置表單＋清除預覽
    this.form.reset({ title: '', price: 0, stock: 0, cover: '' }); // 清空表單
    this.previewUrl.set(undefined); //　清除預覽
  }

  remove(id: number): void {
    if (!confirm('確定刪除？')) return;
    this.store.dispatch(ProductsActions.remove({ id }));
  }
}
