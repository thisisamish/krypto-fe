export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // The current page number (often 0-indexed)
  size: number;
}
