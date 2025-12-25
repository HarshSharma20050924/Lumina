import { UserRepository } from '../repository/userRepository';

const userRepository = new UserRepository();

export const getWishlist = async (userId: string) => {
  const user = await userRepository.getWishlist(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.wishlist || [];
};

export const addToWishlist = async (userId: string, productId: string) => {
  const user = await userRepository.addToWishlist(userId, productId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const user = await userRepository.removeFromWishlist(userId, productId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const isProductInWishlist = async (userId: string, productId: string) => {
  return await userRepository.isProductInWishlist(userId, productId);
};