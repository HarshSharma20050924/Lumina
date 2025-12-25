import prisma from '../prisma/prismaService';
import { Prisma, User as PrismaUser } from '@prisma/client';

export class UserRepository {
  // Create a new user
  async create(userData: Prisma.UserCreateInput): Promise<PrismaUser> {
    return await prisma.user.create({
      data: userData,
    });
  }

  // Find user by ID
  async findById(id: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Find user by email with password (for authentication)
  async findByEmailWithPassword(email: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Update user by ID
  async updateById(id: string, updateData: Prisma.UserUpdateInput): Promise<PrismaUser | null> {
    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete user by ID
  async deleteById(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Find all users with pagination
  async findAll(page: number = 1, limit: number = 10): Promise<{ users: PrismaUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);
    return { users, total };
  }

  // Add product to user's wishlist
  async addToWishlist(userId: string, productId: string): Promise<PrismaUser | null> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          create: {
            productId,
          },
        },
      },
    });
  }

  // Remove product from user's wishlist
  async removeFromWishlist(userId: string, productId: string): Promise<PrismaUser | null> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          wishlist: {
            delete: {
              userId_productId: {
                userId,
                productId,
              },
            },
          },
        },
      });
    } catch (error) {
      // If the wishlist item doesn't exist, return the user
      return await this.findById(userId);
    }
  }

  // Get user's wishlist items
  async getUserWishlist(userId: string) {
    return await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  // Check if product is in user's wishlist
  async isProductInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!wishlistItem;
  }

  // Update user's cart
  async updateUserCart(userId: string, cartItems: { productId: string; quantity: number }[]): Promise<PrismaUser | null> {
    // First, clear existing cart items
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    // Then add new cart items
    if (cartItems.length > 0) {
      await prisma.cartItem.createMany({
        data: cartItems.map(item => ({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return await this.findById(userId);
  }

  // Get user's cart items
  async getUserCart(userId: string) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }
}