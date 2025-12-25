// src/server/models/Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  categoryId: string;
  brandId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // category?: Category;
  // brand?: Brand;
  // cartItems?: CartItem[];
  // orderItems?: OrderItem[];
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  inStock?: boolean;
  stockCount?: number;
  categoryId: string;
  brandId?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  images?: string[];
  inStock?: boolean;
  stockCount?: number;
  categoryId?: string;
  brandId?: string;
}