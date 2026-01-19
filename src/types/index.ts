export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  amount: number;
  isDeleted: boolean;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  type: string;
  method: string | null;
  status: string;
  referenceNumber: string | null;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}



export interface Otp {
  id: number;
  userId: number;
  email: string;
  codeHash: string;
  expiresAt: string;
  consumed: boolean;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  userId: number;
  phone: string | null;
  address: string | null;
  idCard: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}
