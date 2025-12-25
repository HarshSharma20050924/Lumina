import { Request, Response, NextFunction } from 'express';

export const validateRegisterData = (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ 
      message: 'Email, name, and password are required' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format' 
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  next();
};

export const validateLoginData = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format' 
    });
  }

  next();
};

export const validateProductData = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, category, description } = req.body;

  if (!name || !price || !category || !description) {
    return res.status(400).json({ 
      message: 'Name, price, category, and description are required' 
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ 
      message: 'Price must be a positive number' 
    });
  }

  next();
};

export const validateCartData = (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity, selectedColor, selectedSize } = req.body;

  if (!productId || !selectedColor || !selectedSize) {
    return res.status(400).json({ 
      message: 'Product ID, selected color, and selected size are required' 
    });
  }

  if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ 
      message: 'Quantity is required and must be a positive number' 
    });
  }

  next();
};

export const validateOrderData = (req: Request, res: Response, next: NextFunction) => {
  const { items, shippingAddress, customerName } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      message: 'Order items are required and must be a non-empty array' 
    });
  }

  if (!shippingAddress || !customerName) {
    return res.status(400).json({ 
      message: 'Shipping address and customer name are required' 
    });
  }

  // Validate each item in the order
  for (const item of items) {
    if (!item.productId || !item.name || !item.price || !item.quantity) {
      return res.status(400).json({ 
        message: 'Each order item must have productId, name, price, and quantity' 
      });
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ 
        message: 'Item quantity must be a positive number' 
      });
    }

    if (typeof item.price !== 'number' || item.price < 0) {
      return res.status(400).json({ 
        message: 'Item price must be a non-negative number' 
      });
    }
  }

  next();
};

// Generic validation middleware for IDs
export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ 
      message: 'ID parameter is required' 
    });
  }

  // In a real implementation with MongoDB, we'd validate ObjectId format
  // For now, we'll just check if it's present
  next();
};