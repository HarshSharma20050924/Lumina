import { Product, CartItem, Order, User, FilterState, SortOption } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Product API functions
export const productAPI = {
  // Get all products with filters
  getProducts: async (filters: {
    category?: string;
    gender?: string;
    subcategory?: string;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: string[];
    search?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';

    return makeRequest(endpoint);
  },

  // Get product by ID
  getProductById: async (id: string) => {
    return makeRequest(`/products/${id}`);
  },

  // Get products by category
  getProductsByCategory: async (category: string) => {
    return makeRequest(`/products/categories/${category}`);
  },

  // Get all categories
  getCategories: async () => {
    return makeRequest('/products/categories');
  },

  // Create a new product (admin only)
  createProduct: async (productData: Product) => {
    return makeRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update a product (admin only)
  updateProduct: async (id: string, productData: Partial<Product>) => {
    return makeRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete a product (admin only)
  deleteProduct: async (id: string) => {
    return makeRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart API functions
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    return makeRequest('/cart');
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number, color: string, size: string) => {
    return makeRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, color, size }),
    });
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number) => {
    return makeRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item from cart
  removeFromCart: async (itemId: string) => {
    return makeRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  clearCart: async () => {
    return makeRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Order API functions
export const orderAPI = {
  // Get user's orders
  getOrders: async () => {
    return makeRequest('/orders');
  },

  // Get order by ID
  getOrderById: async (orderId: string) => {
    return makeRequest(`/orders/${orderId}`);
  },

  // Place a new order
  placeOrder: async (shippingAddress: string, paymentMethod: string) => {
    return makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod }),
    });
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId: string, status: string) => {
    return makeRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Auth API functions
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  },

  // Register
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser: async () => {
    return makeRequest('/auth/me');
  },
};

// Wishlist API functions
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async () => {
    return makeRequest('/wishlist');
  },

  // Add to wishlist
  addToWishlist: async (productId: string) => {
    return makeRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string) => {
    return makeRequest(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
};

// Admin API functions
export const adminAPI = {
  // Get admin dashboard data
  getDashboardData: async () => {
    return makeRequest('/admin/dashboard');
  },

  // Get all users
  getUsers: async () => {
    return makeRequest('/admin/users');
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    return makeRequest('/admin/orders');
  },
};