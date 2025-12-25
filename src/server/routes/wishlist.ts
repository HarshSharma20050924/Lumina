import express from 'express';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/wishlistController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/:productId', auth, removeFromWishlist);

export default router;