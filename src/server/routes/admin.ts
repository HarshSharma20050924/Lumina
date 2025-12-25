import express from 'express';
import { 
  getDashboardStats, 
  getAdminOrders, 
  getAdminProducts, 
  getAdminUsers 
} from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/dashboard/stats', authenticateToken, requireAdmin, getDashboardStats);
router.get('/orders', authenticateToken, requireAdmin, getAdminOrders);
router.get('/products', authenticateToken, requireAdmin, getAdminProducts);
router.get('/users', authenticateToken, requireAdmin, getAdminUsers);

export default router;