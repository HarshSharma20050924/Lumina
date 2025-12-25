import express from 'express';
import { 
  getOrders, 
  getOrderByIdController as getOrderById, 
  createOrder, 
  updateOrderStatus 
} from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, createOrder);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;