export interface Product {         // 商品資料型別
  id: number;                      // 主鍵（json-server 自動產生）
  title: string;                   // 名稱
  price: number;                   // 價格
  stock: number;                   // 庫存
  cover?: string;                  // 圖片（可選）
}