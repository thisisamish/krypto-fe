export type UserRole = 'admin' | 'customer';

export interface User {
  id: string; // unique identifier
  name: string; // full display name
  email: string;

  role: UserRole; // 'admin' | 'customer'
  active: boolean; // account active/enabled

  createdAt: string; // ISO timestamp
  lastActiveAt?: string; // ISO timestamp (optional)

  // Optional fields preserved from earlier model (kept optional for compatibility)
  username?: string;
  // Do NOT carry plaintext passwords around the app; keep it off the User read model.
  // password?: string; // intentionally omitted from the listing model
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  contactNo?: string;
}
