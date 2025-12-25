// src/server/models/CartItem.ts
export interface Cart {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // user?: User;
  // product?: Product;
}

export interface CreateCartInput {
  userId: string;
  productId: string;
  quantity?: number;
}

export interface UpdateCartInput {
  userId?: string;
  productId?: string;
  quantity?: number;
}