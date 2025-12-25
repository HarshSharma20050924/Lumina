import { User } from '../models/User';
import { Document, Types } from 'mongoose';

// Define the User document type
interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

export class UserRepository {
  // Create a new user
  async create(userData: Partial<User>): Promise<UserDocument> {
    const user = new User(userData);
    return await user.save();
  }

  // Find user by ID
  async findById(id: string): Promise<UserDocument | null> {
    return await User.findById(id).lean();
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email }).lean();
  }

  // Find user by email with password (for authentication)
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email }).select('+password');
  }

  // Update user by ID
  async updateById(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  // Delete user by ID
  async deleteById(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  // Find all users with pagination
  async findAll(page: number = 1, limit: number = 10): Promise<{ users: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit).lean();
    const total = await User.countDocuments();
    return { users, total };
  }

  // Update user's cart
  async updateUserCart(userId: string, cartItems: any[]): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { cart: cartItems },
      { new: true }
    ).lean();
  }

  // Update user's wishlist
  async updateUserWishlist(userId: string, wishlistItems: any[]): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { wishlist: wishlistItems },
      { new: true }
    ).lean();
  }

  // Add product to user's wishlist
  async addToWishlist(userId: string, productId: string): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
      { new: true }
    ).lean();
  }

  // Remove product from user's wishlist
  async removeFromWishlist(userId: string, productId: string): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).lean();
  }

  // Get user's wishlist
  async getWishlist(userId: string): Promise<UserDocument | null> {
    return await User.findById(userId).populate('wishlist').lean();
  }

  // Check if product is in user's wishlist
  async isProductInWishlist(userId: string, productId: string): Promise<boolean> {
    const user = await User.findById(userId).lean();
    if (!user || !user.wishlist) return false;
    return user.wishlist.some((id: any) => id.toString() === productId);
  }
}