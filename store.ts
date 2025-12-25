import { create } from 'zustand';
import { CartItem, Product, Toast, FilterState, SortOption, User, Order, OrderStatus } from './types';
import { MOCK_PRODUCTS } from './utils';

interface AppState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  setPage: (page: number) => void;

  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity: number, color: string, size: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  toggleCart: (isOpen?: boolean) => void;
  clearCart: () => void;
  
  // Wishlist State
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;

  // Navigation State
  currentView: 'home' | 'product-detail' | 'checkout' | 'profile' | 'admin';
  selectedProduct: Product | null;
  navigateToProduct: (product: Product) => void;
  navigateHome: () => void;
  navigateToCheckout: () => void;
  navigateToProfile: () => void;
  navigateToAdmin: () => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Auth
  user: User | null;
  isLoginOpen: boolean;
  toggleLoginModal: (isOpen?: boolean) => void;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  // Checkout & Orders
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  orders: Order[];
  placeOrder: (shippingAddress: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const initialFilters: FilterState = {
  priceRange: [0, 1000],
  categories: [],
  colors: [],
  sizes: []
};

// Mock Initial Orders
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-25-1024',
    date: '2025-12-15T10:30:00Z',
    status: 'delivered',
    total: 325.00,
    shippingAddress: '123 Main St, New York, NY 10001',
    customerName: 'Alice Johnson',
    items: [
      { ...MOCK_PRODUCTS[0], cartId: 'h', quantity: 1, selectedColor: '#000000', selectedSize: 'L' },
      { ...MOCK_PRODUCTS[3], cartId: 'b', quantity: 1, selectedColor: '#E5E7EB', selectedSize: 'One Size' }
    ]
  },
  {
    id: 'ORD-26-0012',
    date: '2026-01-05T14:20:00Z',
    status: 'processing',
    total: 45.00,
    shippingAddress: '456 Market St, San Francisco, CA 94103',
    customerName: 'Bob Smith',
    items: [
       { ...MOCK_PRODUCTS[1], cartId: 'c', quantity: 1, selectedColor: '#FFFFFF', selectedSize: 'M' }
    ]
  }
];

export const useStore = create<AppState>((set) => ({
  products: MOCK_PRODUCTS,
  
  addProduct: (product) => set((state) => ({ 
    products: [product, ...state.products],
    toasts: [...state.toasts, { id: Math.random().toString(), type: 'success', message: 'Product added' }]
  })),

  updateProduct: (updatedProduct) => set((state) => ({
    products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p),
    toasts: [...state.toasts, { id: Math.random().toString(), type: 'success', message: 'Product updated' }]
  })),

  deleteProduct: (productId) => set((state) => ({
    products: state.products.filter(p => p.id !== productId),
    toasts: [...state.toasts, { id: Math.random().toString(), type: 'info', message: 'Product deleted' }]
  })),

  currentPage: 1,
  itemsPerPage: 8,
  setPage: (page) => set({ currentPage: page }),

  cart: [],
  isCartOpen: false,
  
  addToCart: (product, quantity, color, size) => {
    set((state) => {
      const existingItem = state.cart.find(
        item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item => 
          item.cartId === existingItem.cartId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          ...product,
          cartId: `${product.id}-${Date.now()}`,
          quantity,
          selectedColor: color,
          selectedSize: size,
        };
        newCart = [...state.cart, newItem];
      }

      const id = Math.random().toString(36).substring(7);
      return { 
        cart: newCart,
        isCartOpen: true,
        toasts: [...state.toasts, { id, type: 'success', message: `Added ${product.name}`, duration: 2000 }]
      };
    });
  },

  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(item => item.cartId !== cartId)
  })),

  updateQuantity: (cartId, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    })
  })),

  toggleCart: (isOpen) => set((state) => ({
    isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen
  })),

  clearCart: () => set({ cart: [] }),

  wishlist: [],
  toggleWishlist: (productId) => set((state) => {
    const exists = state.wishlist.includes(productId);
    const newWishlist = exists 
      ? state.wishlist.filter(id => id !== productId)
      : [...state.wishlist, productId];
      
    const id = Math.random().toString(36).substring(7);
    const message = exists ? `Removed from wishlist` : `Added to wishlist`;
    
    return { 
      wishlist: newWishlist,
      toasts: [...state.toasts, { id, type: 'info', message, duration: 2000 }]
    };
  }),

  currentView: 'home',
  selectedProduct: null,
  navigateToProduct: (product) => set({ currentView: 'product-detail', selectedProduct: product }),
  navigateHome: () => set({ currentView: 'home', selectedProduct: null }),
  navigateToCheckout: () => set({ currentView: 'checkout', isCartOpen: false }),
  navigateToProfile: () => set({ currentView: 'profile', isCartOpen: false }),
  navigateToAdmin: () => set({ currentView: 'admin', isCartOpen: false }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filters: initialFilters,
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    currentPage: 1 // Reset page on filter change
  })),
  sortOption: 'newest',
  setSortOption: (option) => set({ sortOption: option }),
  resetFilters: () => set({ filters: initialFilters, searchQuery: '', currentPage: 1 }),

  toasts: [],
  addToast: (toast) => set((state) => {
    const id = Math.random().toString(36).substring(7);
    return { toasts: [...state.toasts, { ...toast, id, duration: toast.duration || 3000 }] };
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),

  user: null,
  isLoginOpen: false,
  toggleLoginModal: (isOpen) => set((state) => ({ 
    isLoginOpen: isOpen !== undefined ? isOpen : !state.isLoginOpen 
  })),
  login: async (email, name) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ 
      user: { 
        id: '123', 
        name: name || 'Admin User', 
        email, 
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Admin User')}&background=0D8ABC&color=fff`,
        address: '123 Fashion Ave',
        role: email.includes('admin') ? 'admin' : 'user'
      },
      isLoginOpen: false
    });
  },
  logout: () => set({ user: null, currentView: 'home' }),
  updateUser: (data) => set((state) => ({ 
    user: state.user ? { ...state.user, ...data } : null 
  })),

  checkoutStep: 1,
  setCheckoutStep: (step) => set({ checkoutStep: step }),
  orders: MOCK_ORDERS,
  placeOrder: (shippingAddress) => set((state) => {
    const total = state.cart.reduce((acc, item) => {
      const price = item.discountPrice || item.price;
      return acc + price * item.quantity;
    }, 0) * 1.08 + 15;

    const newOrder: Order = {
      id: `ORD-26-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      status: 'processing',
      total,
      items: [...state.cart],
      shippingAddress: shippingAddress || '123 Main St',
      customerName: state.user?.name || 'Guest'
    };
    
    return {
      orders: [newOrder, ...state.orders],
      cart: [],
      checkoutStep: 3
    };
  }),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
    toasts: [...state.toasts, { id: Math.random().toString(), type: 'info', message: `Order ${orderId} updated to ${status}` }]
  })),
}));