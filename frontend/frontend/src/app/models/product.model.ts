export interface Product {
  id: number;
  productName: string;
  barcode: string;
  url: string;
  clientName: string;
  mrp: number;
  quantity: number;
}

export interface ProductListData {
  products: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 