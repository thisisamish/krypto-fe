export interface Order {
  id: string;
  total: number;
  createdAt: string; // ISO
  customerId: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FULFILLED';
}
