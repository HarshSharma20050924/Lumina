import express from 'express';
import { 
  getOrders, 
  getOrderByIdController as getOrderById, 
  createOrder, 
  updateOrderStatus 
} from '../controllers/orderController';
import { auth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.put('/:id/status', auth, requireAdmin, updateOrderStatus);

export default router;