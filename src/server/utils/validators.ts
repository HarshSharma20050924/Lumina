// Utility functions for validation

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Password must be at least 6 characters long
  return password.length >= 6;
};

export const isValidObjectId = (id: string): boolean => {
  // Simple check for MongoDB ObjectId format (24 hex characters)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidImageFile = (filename: string): boolean => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(fileExtension);
};

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input.replace(/[<>]/g, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Simple phone number validation (10-15 digits)
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
};

export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price >= 0;
};

export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};