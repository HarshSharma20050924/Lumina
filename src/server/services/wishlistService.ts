import User, { IUser } from '../models/User';

export const getWishlist = async (userId: string) => {
  const user = await User.findById(userId).populate('wishlist');
  if (!user) {
    throw new Error('User not found');
  }
  return user.wishlist;
};

export const addToWishlist = async (userId: string, productId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.wishlist) {
    user.wishlist = [];
  }

  // Check if product is already in wishlist
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  return user;
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.wishlist) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
  }

  return user;
};

export const isProductInWishlist = async (userId: string, productId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return user.wishlist?.includes(productId) || false;
};