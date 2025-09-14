// src/app/models/cart.dto.ts
export type CartItemDto = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type CartResponse = {
  items: CartItemDto[];
  subtotal: number;
  itemCount: number;
};

export type AddCartItemRequest = { productId: number; quantity: number };
export type UpdateCartItemRequest = { quantity: number };
