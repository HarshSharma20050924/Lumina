import { create } from 'zustand';
import { CartItem, Product, Toast, FilterState, SortOption, User, Order, OrderStatus } from './types';
import { MOCK_PRODUCTS } from './utils';
import { productAPI, cartAPI, orderAPI, authAPI, wishlistAPI } from './api';

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

export const useStore = create<AppState>((set, get) => ({
  products: [],

  // Load products from API
  loadProducts: async () => {
    try {
      const response = await productAPI.getProducts();
      set({ products: response.products || response.data || [] });
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to mock data if API fails
      set({ products: MOCK_PRODUCTS });
    }
  },

  addProduct: async (product) => {
    try {
      const response = await productAPI.createProduct(product);
      set((state) => ({
        products: [response.product, ...state.products],
        toasts: [...state.toasts, { id: Math.random().toString(), type: 'success', message: 'Product added' }]
      }));
    } catch (error) {
      console.error('Error adding product:', error);
      set((state) => ({
        toasts: [...state.toasts, { id: Math.random().toString(), type: 'error', message: 'Failed to add product' }]
      }));
    }
  },

  updateProduct: async (updatedProduct) => {
    try {
      const response = await productAPI.updateProduct(updatedProduct.id, updatedProduct);
      set((state) => ({
        products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p),
        toasts: [...state.toasts, { id: Math.random().toString(), type: 'success', message: 'Product updated' }]
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      set((state) => ({
        toasts: [...state.toasts, { id: Math.random().toString(), type: 'error', message: 'Failed to update product' }]
      }));
    }
  },

  deleteProduct: async (productId) => {
    try {
      await productAPI.deleteProduct(productId);
      set((state) => ({
        products: state.products.filter(p => p.id !== productId),
        toasts: [...state.toasts, { id: Math.random().toString(), type: 'info', message: 'Product deleted' }]
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      set((state) => ({
        toasts: [...state.toasts, { id: Math.random().toString(), type: 'error', message: 'Failed to delete product' }]
      }));
    }
  },

  currentPage: 1,
  itemsPerPage: 8,
  setPage: (page) => set({ currentPage: page }),

  cart: [],
  isCartOpen: false,

  // Load cart from API
  loadCart: async () => {
    try {
      const response = await cartAPI.getCart();
      set({ cart: response.cartItems || response.data || [] });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  },

  addToCart: async (product, quantity, color, size) => {
    try {
      // First add to backend
      const response = await cartAPI.addToCart(product.id, quantity, color, size);

      // Then update local state
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
    } catch (error) {
      console.error('Error adding to cart:', error);
      set((state) => {
        const id = Math.random().toString(36).substring(7);
        return {
          toasts: [...state.toasts, { id, type: 'error', message: 'Failed to add to cart', duration: 2000 }]
        };
      });
    }
  },

  removeFromCart: async (cartId) => {
    try {
      // Get the cart item to extract the backend cart item ID
      const cartItem = get().cart.find(item => item.cartId === cartId);
      if (cartItem) {
        await cartAPI.removeFromCart(cartItem.id); // Assuming the backend ID is stored in item.id
      }

      set((state) => ({
        cart: state.cart.filter(item => item.cartId !== cartId)
      }));
    } catch (error) {
      console.error('Error removing from cart:', error);
      set((state) => {
        const id = Math.random().toString(36).substring(7);
        return {
          toasts: [...state.toasts, { id, type: 'error', message: 'Failed to remove from cart', duration: 2000 }]
        };
      });
    }
  },

  updateQuantity: async (cartId, delta) => {
    set((state) => {
      const item = state.cart.find(i => i.cartId === cartId);
      if (!item) return state;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        // If quantity becomes 0 or less, remove the item
        return {
          cart: state.cart.filter(i => i.cartId !== cartId)
        };
      }

      // Update quantity in state
      const updatedCart = state.cart.map(i =>
        i.cartId === cartId ? { ...i, quantity: newQty } : i
      );

      // Sync with backend
      cartAPI.updateCartItem(cartId, newQty).catch(error => {
        console.error('Error updating cart quantity:', error);
      });

      return { cart: updatedCart };
    });
  },

  toggleCart: (isOpen) => set((state) => ({
    isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen
  })),

  clearCart: async () => {
    try {
      await cartAPI.clearCart();
      set({ cart: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  wishlist: [],
  toggleWishlist: async (productId) => {
    set((state) => {
      const exists = state.wishlist.includes(productId);
      const newWishlist = exists
        ? state.wishlist.filter(id => id !== productId)
        : [...state.wishlist, productId];

      const id = Math.random().toString(36).substring(7);
      const message = exists ? `Removed from wishlist` : `Added to wishlist`;

      // Update backend
      if (exists) {
        wishlistAPI.removeFromWishlist(productId).catch(error => {
          console.error('Error removing from wishlist:', error);
        });
      } else {
        wishlistAPI.addToWishlist(productId).catch(error => {
          console.error('Error adding to wishlist:', error);
        });
      }

      return {
        wishlist: newWishlist,
        toasts: [...state.toasts, { id, type: 'info', message, duration: 2000 }]
      };
    });
  },

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
  login: async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      set({
        user: response.user,
        isLoginOpen: false
      });
    } catch (error) {
      console.error('Login error:', error);
      set((state) => {
        const id = Math.random().toString(36).substring(7);
        return {
          toasts: [...state.toasts, { id, type: 'error', message: error.message || 'Login failed', duration: 3000 }]
        };
      });
    }
  },
  logout: () => {
    authAPI.logout();
    set({ user: null, currentView: 'home' });
  },
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),

  checkoutStep: 1,
  setCheckoutStep: (step) => set({ checkoutStep: step }),
  orders: [],

  // Load orders from API
  loadOrders: async () => {
    try {
      const response = await orderAPI.getOrders();
      set({ orders: response.orders || response.data || [] });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  },

  placeOrder: async (shippingAddress) => {
    try {
      const response = await orderAPI.placeOrder(shippingAddress, 'credit_card'); // default payment method

      // Update local state
      set((state) => {
        const total = state.cart.reduce((acc, item) => {
          const price = item.discountPrice || item.price;
          return acc + price * item.quantity;
        }, 0) * 1.08 + 15; // tax and shipping

        const newOrder: Order = {
          id: response.order.id || `ORD-${Date.now()}`,
          date: response.order.date || new Date().toISOString(),
          status: response.order.status || 'processing',
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
      });
    } catch (error) {
      console.error('Error placing order:', error);
      set((state) => {
        const id = Math.random().toString(36).substring(7);
        return {
          toasts: [...state.toasts, { id, type: 'error', message: error.message || 'Failed to place order', duration: 3000 }],
          checkoutStep: 2 // stay on checkout step to retry
        };
      });
    }
  },
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
    toasts: [...state.toasts, { id: Math.random().toString(), type: 'info', message: `Order ${orderId} updated to ${status}` }]
  })),
}));