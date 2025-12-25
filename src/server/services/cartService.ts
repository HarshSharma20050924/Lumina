import { CartRepository } from '../repository/cartRepository';
import { ProductRepository } from '../repository/productRepository';
import { Prisma, CartItem as PrismaCartItem, User as PrismaUser } from '@prisma/client';

// Define types for cart operations
interface AddToCartData {
  userId: string;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

export const getCartByUserId = async (userId: string): Promise<PrismaCartItem[] | null> => {
  return await cartRepository.getUserCart(userId);
};

export const addToCart = async (cartData: AddToCartData): Promise<PrismaCartItem> => {
  const { userId, productId, quantity, selectedColor, selectedSize } = cartData;

  // Validate product exists
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Prepare selected options
  const selectedOptions = {
    color: selectedColor,
    size: selectedSize
  };

  // Add item to cart using repository
  const updatedUser = await cartRepository.addItem(userId, productId, quantity, selectedOptions);
  
  if (!updatedUser) {
    throw new Error('Failed to add item to cart');
  }

  return updatedUser;
};

export const updateCartItem = async (
  userId: string, 
  productId: string, 
  quantity: number,
  selectedColor?: string,
  selectedSize?: string
): Promise<PrismaCartItem | null> => {
  // Update item quantity in cart using repository
  const updatedUser = await cartRepository.updateItemQuantity(userId, productId, quantity);
  
  if (!updatedUser) {
    throw new Error('Failed to update cart item');
  }

  return updatedUser;
};

export const removeCartItem = async (
  userId: string, 
  productId: string,
  selectedColor?: string,
  selectedSize?: string
): Promise<PrismaCartItem | null> => {
  // Remove item from cart using repository
  const updatedUser = await cartRepository.removeItem(userId, productId);
  
  if (!updatedUser) {
    throw new Error('Failed to remove cart item');
  }

  return updatedUser;
};

export const clearCart = async (userId: string): Promise<boolean> => {
  const result = await cartRepository.clearCart(userId);
  return !!result;
};

export const getCartTotal = async (userId: string) => {
  const cartItems = await cartRepository.getCartItemsWithDetails(userId);
  
  let totalItems = 0;
  let totalAmount = 0;

  for (const item of cartItems) {
    totalItems += item.quantity;
    totalAmount += item.subtotal;
  }

  return { totalItems, totalAmount };
};