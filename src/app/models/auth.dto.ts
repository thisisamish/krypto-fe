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
  username: string; // you already use "username" (not email)
  password: string;
}
