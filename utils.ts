import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Tech Parka',
    price: 245,
    category: 'Outerwear',
    gender: 'Men',
    subcategory: 'Jacket',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80',
    isNew: true,
    rating: 4.8,
    reviewCount: 124,
    colors: ['#000000', '#565E63', '#9CA3AF'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Engineered for urban exploration. This parka features a water-resistant shell, breathable lining, and a modular hood system.',
    stock: 45
  },
  {
    id: '2',
    name: 'Organic Cotton Basic Tee',
    price: 45,
    category: 'Essentials',
    gender: 'Women',
    subcategory: 'T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    isSale: true,
    discountPrice: 35,
    rating: 4.5,
    reviewCount: 89,
    colors: ['#FFFFFF', '#000000', '#D1D5DB'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'The perfect everyday tee. Made from 100% organic cotton with a relaxed fit and reinforced seams.',
    stock: 120
  },
  {
    id: '3',
    name: 'Structure Wool Blazer',
    price: 350,
    category: 'Tailoring',
    gender: 'Men',
    subcategory: 'Jacket',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c472997?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    rating: 4.9,
    reviewCount: 56,
    colors: ['#1F2937', '#4B5563'],
    sizes: ['46', '48', '50', '52', '54'],
    description: 'Modern tailoring meets classic silhouette. Italian wool blend with a soft shoulder construction.',
    stock: 20
  },
  {
    id: '4',
    name: 'Everyday Canvas Tote',
    price: 85,
    category: 'Accessories',
    gender: 'Unisex',
    subcategory: 'Bag',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    isNew: true,
    rating: 4.7,
    reviewCount: 230,
    colors: ['#E5E7EB', '#9CA3AF'],
    sizes: ['One Size'],
    description: 'Durable, spacious, and stylish. Fits a 16-inch laptop and all your daily essentials.',
    stock: 80
  }
];