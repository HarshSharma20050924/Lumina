import Cart, { ICart, ICartItem } from '../models/Cart';
import Product from '../models/Product';
import { IProduct } from '../models/Product';

interface AddToCartData {
  userId: string;
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export const getCartByUserId = async (userId: string): Promise<ICart | null> => {
  return await Cart.findOne({ userId });
};

export const addToCart = async (cartData: AddToCartData): Promise<ICart> => {
  const { userId, productId, quantity, selectedColor, selectedSize } = cartData;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Find existing cart or create new one
  let cart = await Cart.findOne({ userId });
  
  if (cart) {
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        selectedColor,
        selectedSize
      });
    }
    
    return await cart.save();
  } else {
    // Create new cart
    const newCart = new Cart({
      userId,
      items: [{
        productId,
        quantity,
        selectedColor,
        selectedSize
      }]
    });
    
    return await newCart.save();
  }
};

export const updateCartItem = async (
  userId: string, 
  productId: string, 
  quantity: number,
  selectedColor: string,
  selectedSize: string
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId === productId && 
    item.selectedColor === selectedColor && 
    item.selectedSize === selectedSize
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    return await cart.save();
  }

  throw new Error('Cart item not found');
};

export const removeCartItem = async (
  userId: string, 
  productId: string,
  selectedColor: string,
  selectedSize: string
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    item => !(item.productId === productId && 
    item.selectedColor === selectedColor && 
    item.selectedSize === selectedSize)
  );

  if (cart.items.length === initialLength) {
    throw new Error('Cart item not found');
  }

  return await cart.save();
};

export const clearCart = async (userId: string): Promise<boolean> => {
  const result = await Cart.deleteOne({ userId });
  return result.deletedCount === 1;
};

export const getCartTotal = async (userId: string) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) return { totalItems: 0, totalAmount: 0 };

  let totalItems = 0;
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      totalItems += item.quantity;
      totalAmount += product.price * item.quantity;
    }
  }

  return { totalItems, totalAmount };
};