// src/server/models/WishlistItem.ts
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // user?: User;
  // product?: Product;
}

export interface CreateWishlistItemInput {
  userId: string;
  productId: string;
}

export interface UpdateWishlistItemInput {
  userId?: string;
  productId?: string;
}