import { User } from '../models/User';
import { Document, Types } from 'mongoose';

// Define the User document type for cart operations
interface UserDocument extends Document {
  _id: Types.ObjectId;
  cart: Array<{
    product: Types.ObjectId;
    quantity: number;
    selectedOptions?: any;
  }>;
}

export class CartRepository {
  // Add item to cart
  async addItem(userId: string, productId: string, quantity: number, selectedOptions?: any): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { product: productId } }, // Remove existing item to avoid duplicates
        $push: {
          cart: {
            product: productId,
            quantity,
            selectedOptions: selectedOptions || {}
          }
        }
      },
      { new: true, upsert: true }
    ).lean();
  }

  // Update item quantity in cart
  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<UserDocument | null> {
    if (quantity <= 0) {
      return await this.removeItem(userId, productId);
    }
    
    return await User.findOneAndUpdate(
      { _id: userId, 'cart.product': productId },
      { $set: { 'cart.$.quantity': quantity } },
      { new: true }
    ).lean();
  }

  // Remove item from cart
  async removeItem(userId: string, productId: string): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { product: productId } } },
      { new: true }
    ).lean();
  }

  // Clear entire cart
  async clearCart(userId: string): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } },
      { new: true }
    ).lean();
  }

  // Get user's cart
  async getUserCart(userId: string): Promise<UserDocument | null> {
    return await User.findById(userId)
      .populate({
        path: 'cart.product',
        select: 'name price images discountPercentage'
      })
      .lean();
  }

  // Get cart total items count
  async getCartItemCount(userId: string): Promise<number> {
    const user = await User.findById(userId).lean();
    if (!user || !user.cart) return 0;
    return user.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total price
  async getCartTotal(userId: string): Promise<number> {
    const user = await User.findById(userId)
      .populate({
        path: 'cart.product',
        select: 'price discountPercentage'
      })
      .lean();

    if (!user || !user.cart) return 0;

    return user.cart.reduce((total, item) => {
      const product = item.product as any;
      // Calculate price considering any discounts
      const discountedPrice = product.discountPercentage 
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      return total + (discountedPrice * item.quantity);
    }, 0);
  }

  // Check if product exists in cart
  async isProductInCart(userId: string, productId: string): Promise<boolean> {
    const user = await User.findOne({
      _id: userId,
      'cart.product': productId
    }).lean();
    
    return !!user;
  }

  // Update cart item options
  async updateItemOptions(userId: string, productId: string, options: any): Promise<UserDocument | null> {
    return await User.findOneAndUpdate(
      { _id: userId, 'cart.product': productId },
      { $set: { 'cart.$.selectedOptions': options } },
      { new: true }
    ).lean();
  }

  // Get cart items with product details
  async getCartItemsWithDetails(userId: string): Promise<any[]> {
    const user = await User.findById(userId)
      .populate({
        path: 'cart.product',
        populate: [
          {
            path: 'category',
            select: 'name'
          }
        ],
        select: 'name price images discountPercentage description category stock'
      })
      .lean();

    if (!user || !user.cart) return [];

    return user.cart.map(item => ({
      ...item,
      product: item.product,
      subtotal: this.calculateItemSubtotal(item)
    }));
  }

  // Calculate individual item subtotal
  private calculateItemSubtotal(cartItem: any): number {
    const product = cartItem.product;
    // Calculate price considering any discounts
    const discountedPrice = product.discountPercentage 
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;
    return discountedPrice * cartItem.quantity;
  }
}