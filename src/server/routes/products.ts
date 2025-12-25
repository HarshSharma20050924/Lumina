import express from 'express';
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsByCategoryController,
  getCategoriesController,
} from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/', getAllProductsController);
router.get('/search', getAllProductsController);

// Important: Specific static routes must come before dynamic parameters (/:id)
router.get('/categories', getCategoriesController);
router.get('/categories/:category', getProductsByCategoryController);

router.get('/:id', getProductByIdController);

/**
 * Protected Admin Routes
 */
router.post('/', authenticateToken, requireAdmin, createProductController);
router.put('/:id', authenticateToken, requireAdmin, updateProductController);
router.delete('/:id', authenticateToken, requireAdmin, deleteProductController);

export default router;