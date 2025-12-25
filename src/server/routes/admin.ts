import express from 'express';
import { 
  getDashboardStats, 
  getAdminOrders, 
  getAdminProducts, 
  getAdminUsers 
} from '../controllers/adminController';
import { auth } from '../middleware/authMiddleware';
import { admin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/dashboard/stats', auth, admin, getDashboardStats);
router.get('/orders', auth, admin, getAdminOrders);
router.get('/products', auth, admin, getAdminProducts);
router.get('/users', auth, admin, getAdminUsers);

export default router;