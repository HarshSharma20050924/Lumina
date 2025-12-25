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
import { admin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', getAllProductsController);
router.get('/search', getAllProductsController);
router.get('/categories/:category', getProductsByCategoryController);
router.get('/categories', getCategoriesController);
router.get('/:id', getProductByIdController);
router.post('/', auth, admin, createProductController);
router.put('/:id', auth, admin, updateProductController);
router.delete('/:id', auth, admin, deleteProductController);

export default router;