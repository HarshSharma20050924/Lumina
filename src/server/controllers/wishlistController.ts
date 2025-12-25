import { Request, Response } from 'express';
import { 
  getWishlist as getWishlistByUserId, 
  addToWishlist as addToWishlistService, 
  removeFromWishlist as removeFromWishlistService 
} from '../services/wishlistService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const wishlist = await getWishlistByUserId(req.user._id);

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { productId } = req.body;

    const wishlist = await addToWishlistService(req.user._id, productId);

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { productId } = req.params;

    const wishlist = await removeFromWishlistService(req.user._id, productId);

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};