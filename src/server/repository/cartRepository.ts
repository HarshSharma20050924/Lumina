import prisma from '../prisma/prismaService';
import { Prisma, CartItem as PrismaCartItem } from '@prisma/client';

export class CartRepository {
  // Add item to cart
  async addItem(userId: string, productId: string, quantity: number): Promise<PrismaCartItem> {
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      return await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Create new cart item
      return await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
  }

  // Update item quantity in cart
  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<PrismaCartItem | null> {
    if (quantity <= 0) {
      return await this.removeItem(userId, productId);
    }

    return await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity,
      },
    });
  }

  // Remove item from cart
  async removeItem(userId: string, productId: string): Promise<PrismaCartItem | null> {
    try {
      return await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
    } catch (error) {
      // If item doesn't exist, return null
      return null;
    }
  }

  // Clear entire cart
  async clearCart(userId: string): Promise<boolean> {
    try {
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get user's cart
  async getUserCart(userId: string) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
    });
  }

  // Get cart total items count
  async getCartItemCount(userId: string): Promise<number> {
    const items = await prisma.cartItem.findMany({
      where: { userId },
    });
    
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total price
  async getCartTotal(userId: string): Promise<number> {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    return items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  // Check if product exists in cart
  async isProductInCart(userId: string, productId: string): Promise<boolean> {
    const item = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!item;
  }

  // Get cart items with product details
  async getCartItemsWithDetails(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
    });

    return items.map(item => ({
      ...item,
      subtotal: item.product.discountPrice 
        ? item.product.discountPrice * item.quantity 
        : item.product.price * item.quantity,
    }));
  }
}