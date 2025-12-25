import { Request, Response } from 'express';
import { 
  getCartByUserId, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  getCartTotal 
} from '../services/cartService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const cart = await getCartByUserId(req.user._id);
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          userId: req.user._id,
          items: [],
          totalItems: 0,
          totalAmount: 0
        }
      });
    }

    const totals = await getCartTotal(req.user._id);

    res.status(200).json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalItems: totals.totalItems,
        totalAmount: totals.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const addToCartController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

    const cart = await addToCart({
      userId: req.user._id,
      productId,
      quantity,
      selectedColor,
      selectedSize
    });

    const totals = await getCartTotal(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart: {
        ...cart.toObject(),
        totalItems: totals.totalItems,
        totalAmount: totals.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const updateCartItemController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params; // product id
    const { quantity, selectedColor, selectedSize } = req.body;

    const cart = await updateCartItem(
      req.user._id,
      id,
      quantity,
      selectedColor,
      selectedSize
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const totals = await getCartTotal(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      cart: {
        ...cart.toObject(),
        totalItems: totals.totalItems,
        totalAmount: totals.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const removeCartItemController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params; // product id
    const { selectedColor, selectedSize } = req.body;

    const cart = await removeCartItem(
      req.user._id,
      id,
      selectedColor,
      selectedSize
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const totals = await getCartTotal(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: {
        ...cart.toObject(),
        totalItems: totals.totalItems,
        totalAmount: totals.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const clearCartController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const success = await clearCart(req.user._id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const getCartTotalController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const totals = await getCartTotal(req.user._id);

    res.status(200).json({
      success: true,
      ...totals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};