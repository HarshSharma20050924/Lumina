// src/server/models/Order.ts
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingAddress: any; // Using any for now since it's a Json field in Prisma
  billingAddress: any;  // Using any for now since it's a Json field in Prisma
  paymentMethod?: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // user?: User;
  // orderItems?: OrderItem[];
}

export interface CreateOrderInput {
  userId: string;
  orderNumber: string;
  status?: string;
  totalAmount: number;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod?: string;
  paymentStatus?: string;
}

export interface UpdateOrderInput {
  userId?: string;
  orderNumber?: string;
  status?: string;
  totalAmount?: number;
  shippingAddress?: any;
  billingAddress?: any;
  paymentMethod?: string;
  paymentStatus?: string;
}