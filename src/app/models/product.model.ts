export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  active: boolean;
  description?: string;
  images?: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
