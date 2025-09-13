export interface RegisterPayload {
  username: string;
  password: string; // only used at submit time
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  address: string;
  contactNo: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  username: string;
  role: string;      // e.g. "ROLE_ADMIN"
  firstName: string;
}

export interface MeResponse {
  username: string;
  role: string;      // e.g. "ROLE_CUSTOMER"
  firstName: string;
}

export type NormalizedRole = 'admin' | 'customer' | null;

export interface AuthUser {
  username: string;
  firstName: string;
  role: NormalizedRole;
}

