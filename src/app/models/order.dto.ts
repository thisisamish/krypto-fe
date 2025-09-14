// src/app/models/order.dto.ts
export type AddressDto = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type PlaceOrderRequest = {
  paymentMethod: 'COD';
  shippingAddress: AddressDto;
  notes?: string;
};

export type OrderItemDto = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderResponse = {
  orderNumber: string;
  status: 'CREATED' | string;
  paymentStatus: 'PENDING' | string;
  paymentMethod: 'COD' | string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
  paidAt?: string;
  shippingAddress: AddressDto;
  notes?: string;
  items: OrderItemDto[];
};

export type OrdersPage = {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  content: {
    userId: number;
    orderNumber: string;
    status: string;
    grandTotal: number;
    createdAt: string;
    usernameSnapshot: string;
    paymentStatus: string;
  }[];
};
