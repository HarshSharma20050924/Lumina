import express from 'express';
import {
  getCart,
  addToCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController
} from '../controllers/cartController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/items', authenticateToken, addToCartController);
router.put('/items/:id', authenticateToken, updateCartItemController);
router.delete('/items/:id', authenticateToken, removeCartItemController);
router.delete('/clear', authenticateToken, clearCartController);

export default router;