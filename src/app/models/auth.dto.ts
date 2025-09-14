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

// src/app/models/auth.dto.ts
export type LoginPayload = { identifier: string; password: string };

export type LoginResponse = {
  accessToken: string;
  roles: string[]; // e.g. ["CUSTOMER"]
  expiresIn: number; // seconds
  tokenType: 'Bearer'; // or generic string
};
