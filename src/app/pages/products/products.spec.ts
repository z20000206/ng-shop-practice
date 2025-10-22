// 匯入 Angular 測試相關工具
// TestBed：Angular 的測試環境建構器，可建立模擬的 NgModule、DI、元件
// ComponentFixture：包裝元件實例與 DOM，方便在測試中操作與偵測變化
import { ComponentFixture, TestBed } from '@angular/core/testing';

// 匯入要測試的目標元件（這裡是 Products，可能是一個 Standalone Component）
import { Products } from './products';

// describe() 是 Jasmine 的測試群組函式，用來定義一組測試案例
// 第一個參數是描述文字（顯示在測試報告中），第二個是包含測試內容的函式
describe('Products', () => {

  // 宣告兩個變數，用來在整個測試群組中共用
  // component：存放 Products 元件的實例（class 本體，可直接呼叫方法、存取屬性）
  // fixture：ComponentFixture，封裝元件實例與模板 DOM，可觸發變更偵測或操作畫面
  let component: Products;
  let fixture: ComponentFixture<Products>;

  // beforeEach()：在每個 it() 測試案例執行前都會先跑這個區塊
  // async/await 是為了等待 compileComponents() 完成（它是非同步的）
  beforeEach(async () => {

    // 建立測試用的 Angular 模組（測試環境）
    // 因為 Angular 20+ 多採用 Standalone Component，所以直接放在 imports 裡
    await TestBed.configureTestingModule({
      imports: [Products] // 匯入要測試的元件
    })
      // compileComponents()：編譯元件模板與樣式
      // 沒這步的話，Angular 不會建立對應的 HTML 結構，也無法進行 DOM 測試
      .compileComponents();

    // 利用 TestBed 建立 Products 元件的測試實例
    // createComponent() 會回傳一個 ComponentFixture<Products>
    fixture = TestBed.createComponent(Products);

    // 從 fixture 中取得元件的實例（相當於 new Products() 後由 Angular DI 完成注入）
    component = fixture.componentInstance;

    // 觸發 Angular 的變更偵測（Change Detection）
    // 會執行元件的 ngOnInit() 並更新模板繫結的畫面內容
    fixture.detectChanges();
  });

  // it()：定義一個實際的測試案例（Test Spec）
  // 第一個參數是測試描述文字，第二個是測試邏輯
  it('should create', () => {

    // expect()：Jasmine 的斷言函式，用來檢查結果是否符合預期
    // 這裡的測試很簡單：確認 component 是否成功被建立（存在且為真）
    expect(component).toBeTruthy();

  });
});
