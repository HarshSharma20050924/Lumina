import express from 'express';
import { 
  getDashboardStats, 
  getAdminOrders, 
  getAdminProducts, 
  getAdminUsers 
} from '../controllers/adminController';
import { auth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/dashboard/stats', auth, requireAdmin, getDashboardStats);
router.get('/orders', auth, requireAdmin, getAdminOrders);
router.get('/products', auth, requireAdmin, getAdminProducts);
router.get('/users', auth, requireAdmin, getAdminUsers);

export default router;