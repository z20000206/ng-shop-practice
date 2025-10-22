// 匯入 Angular 測試核心工具
// TestBed：Angular 提供的單元測試環境建構器，可以模擬模組、DI、元件生命週期
// ComponentFixture：封裝元件實例與對應的 DOM，方便在測試中操作
import { ComponentFixture, TestBed } from '@angular/core/testing';

// 匯入要測試的目標元件（假設為 Standalone Component）
import { ProductDetail } from './product-detail';

// describe 是 Jasmine 的測試群組函式，用來包一組相關的測試案例
describe('ProductDetail', () => {

  // 宣告在整個測試區塊中會用到的變數
  // component：存放元件類別的實例，可以直接呼叫它的方法或屬性
  // fixture：Angular 提供的 ComponentFixture，用來控制元件實例、DOM、與變更偵測
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

  // beforeEach()：在每一個 it() 測試案例執行前都會先執行這段程式
  // async 表示裡面有非同步操作（例如 compileComponents()）
  beforeEach(async () => {

    // 建立測試模組（相當於在測試環境中動態建立一個 Angular 模組）
    // 因為 ProductDetail 是 Standalone Component，所以直接放在 imports 陣列即可
    await TestBed.configureTestingModule({
      imports: [ProductDetail]
    })
      // compileComponents()：編譯元件模板與樣式，確保可以建立 DOM 與執行變更偵測
      .compileComponents();

    // 使用 TestBed 建立 ProductDetail 元件的測試實例
    // createComponent() 會回傳一個 ComponentFixture 物件
    fixture = TestBed.createComponent(ProductDetail);

    // 從 fixture 中取得元件的實例（也就是 class ProductDetail 的實例）
    component = fixture.componentInstance;

    // 觸發 Angular 的變更偵測（Change Detection）
    // 會執行元件的 ngOnInit()、ngOnChanges() 等生命週期，並更新模板繫結的值
    fixture.detectChanges();
  });

  // it()：定義一個實際的測試案例（Test Spec）
  // 第一個參數是測試描述，第二個是測試內容函式
  it('should create', () => {

    // expect() 是 Jasmine 的斷言函式，用來檢查結果是否符合預期
    // 這裡檢查 component 是否成功被建立（truthy）
    expect(component).toBeTruthy();

  });
});
