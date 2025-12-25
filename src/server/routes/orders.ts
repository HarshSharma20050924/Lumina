import express from 'express';
import { 
  getOrders, 
  getOrderByIdController, 
  createOrder, 
  updateOrderStatus 
} from '../controllers/orderController';
import { auth } from '../middleware/authMiddleware';
import { admin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.put('/:id/status', auth, admin, updateOrderStatus);

export default router;