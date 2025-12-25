import { Request, Response } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductsByCategory, 
  getFeaturedProducts, 
  getCategories 
} from '../services/productService';
import { AuthRequest } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const {
      category,
      gender,
      subcategory,
      minPrice,
      maxPrice,
      colors,
      sizes,
      search,
      page = '1',
      limit = '10'
    } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (gender) filters.gender = gender;
    if (subcategory) filters.subcategory = subcategory;
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (colors) filters.colors = Array.isArray(colors) ? colors : [colors];
    if (sizes) filters.sizes = Array.isArray(sizes) ? sizes : [sizes];
    if (search) filters.search = search;

    const result = await getAllProducts(
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const createProductController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const productData = req.body;
    const product = await createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const updateProductController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;
    const productData = req.body;

    const product = await updateProduct(id, productData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const deleteProductController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;
    const success = await deleteProduct(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const getProductsByCategoryController = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await getProductsByCategory(category);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const getFeaturedProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getFeaturedProducts();

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();

    res.status(200).json({
      success: true,
      ...categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message
    });
  }
};