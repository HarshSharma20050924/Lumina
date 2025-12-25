// src/server/models/OrderItem.ts
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // order?: Order;
  // product?: Product;
}

export interface CreateOrderItemInput {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderItemInput {
  orderId?: string;
  productId?: string;
  quantity?: number;
  price?: number;
}