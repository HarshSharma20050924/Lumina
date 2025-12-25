import express from 'express';
import { 
  getCart, 
  addToCartController, 
  updateCartItemController, 
  removeCartItemController, 
  clearCartController 
} from '../controllers/cartController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/items', auth, addToCartController);
router.put('/items/:id', auth, updateCartItemController);
router.delete('/items/:id', auth, removeCartItemController);
router.delete('/clear', auth, clearCartController);

export default router;