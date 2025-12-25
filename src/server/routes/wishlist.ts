import express from 'express';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/wishlistController';
import { authenticateToken  } from '../middleware/authMiddleware';
import auth from './auth';

const router = express.Router();

router.get('/', authenticateToken, getWishlist);
router.post('/', authenticateToken, addToWishlist);
router.delete('/:productId', authenticateToken, removeFromWishlist);

export default router;