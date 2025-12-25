// src/server/models/User.ts
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // orders?: Order[];
  // cartItems?: CartItem[];
  // wishlist?: WishlistItem[];
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role?: string;
  isVerified?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  role?: string;
  isVerified?: boolean;
}