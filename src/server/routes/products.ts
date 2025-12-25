import express from 'express';
import { 
  getAllProductsController, 
  getProductByIdController, 
  createProductController, 
  updateProductController, 
  deleteProductController, 
  getProductsByCategoryController,
  getCategoriesController
} from '../controllers/productController';
import { auth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', getAllProductsController);
router.get('/search', getAllProductsController);
router.get('/categories/:category', getProductsByCategoryController);
router.get('/categories', getCategoriesController);
router.get('/:id', getProductByIdController);
router.post('/', auth, requireAdmin, createProductController);
router.put('/:id', auth, requireAdmin, updateProductController);
router.delete('/:id', auth, requireAdmin, deleteProductController);

export default router;