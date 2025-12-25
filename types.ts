export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // e.g. "Outerwear", "Essentials"
  gender?: 'Men' | 'Women' | 'Kids' | 'Unisex';
  subcategory?: string; // e.g. "Jeans", "Jacket", "T-Shirt"
  image: string;
  hoverImage: string;
  isNew?: boolean;
  isSale?: boolean;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  description: string;
  stock?: number;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
  sizes: string[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin';
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: CartItem[];
  shippingAddress: string;
  customerName?: string;
}