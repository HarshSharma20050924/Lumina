// src/server/models/CartItem.ts
export interface CartItem {
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

export interface CreateCartItemInput {
  userId: string;
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemInput {
  userId?: string;
  productId?: string;
  quantity?: number;
}