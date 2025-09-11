// Corresponds to your backend's OrderStatus enum
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

// Corresponds to your backend's PaymentStatus enum
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// Corresponds to your backend's PaymentMethod enum
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'COD';

// For paginated list at /api/v1/orders
export interface OrderSummary {
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  grandTotal: number;
  createdAt: string; // ISO date string
  usernameSnapshot: string;
  paymentStatus: PaymentStatus;
}

// For individual order at /api/v1/orders/{orderNumber}
export interface OrderDetails {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  createdAt: string; // ISO date string
  paidAt?: string; // ISO date string, optional
  shippingAddress: Address;
  notes?: string;
  items: OrderItem[];
}

export interface Address {
  // Define based on what your AddressDto contains
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  // Define based on what your OrderItemDto contains
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

// For the paginated API response structure
export interface PaginatedOrderResponse {
  content: OrderSummary[];
  totalPages: number;
  totalElements: number;
  number: number; // The current page number
  size: number;
}
