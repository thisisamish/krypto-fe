export interface Product {
  id: number;
  name: string;
  description: string;
  size: string;
  price: number;
  stock_quantity: number;
  discount_percent: number;
  image_url: string;
  created_at?: Date;
}

export interface PaginatedProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number; // The current page number
  size: number;
}
