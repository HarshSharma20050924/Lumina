import Product from '../models/Product';
import { IProduct } from '../models/Product';

interface SearchOptions {
  query?: string;
  category?: string;
  gender?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

interface SearchResults {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const searchProducts = async (options: SearchOptions): Promise<SearchResults> => {
  const {
    query,
    category,
    gender,
    subcategory,
    minPrice,
    maxPrice,
    colors,
    sizes,
    sortBy = 'newest',
    page = 1,
    limit = 10
  } = options;

  const filter: any = {};

  // Text search
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }

  // Category filters
  if (category) filter.category = category;
  if (gender) filter.gender = gender;
  if (subcategory) filter.subcategory = subcategory;

  // Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  // Color and size filters
  if (colors && colors.length > 0) {
    filter.colors = { $in: colors };
  }
  if (sizes && sizes.length > 0) {
    filter.sizes = { $in: sizes };
  }

  // Sorting options
  const sortOptions: any = {};
  switch (sortBy) {
    case 'price-asc':
      sortOptions.price = 1;
      break;
    case 'price-desc':
      sortOptions.price = -1;
      break;
    case 'rating':
      sortOptions.rating = -1;
      break;
    case 'newest':
    default:
      sortOptions.createdAt = -1;
      break;
  }

  const skip = (page - 1) * limit;

  // Execute search
  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const getSearchSuggestions = async (query: string) => {
  if (!query) return [];

  // Find products that match the query for suggestions
  const regex = new RegExp(query, 'i');
  const products = await Product.find({
    $or: [
      { name: { $regex: regex } },
      { category: { $regex: regex } },
      { subcategory: { $regex: regex } }
    ]
  })
  .limit(10)
  .select('name category subcategory');

  // Extract unique suggestions
  const suggestions = new Set<string>();
  
  products.forEach(product => {
    if (product.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(product.name);
    }
    if (product.category.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(product.category);
    }
    if (product.subcategory && product.subcategory.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(product.subcategory);
    }
  });

  return Array.from(suggestions).slice(0, 10);
};

export const getFacetedSearchData = async () => {
  // Get distinct values for filtering
  const categories = await Product.distinct('category');
  const subcategories = await Product.distinct('subcategory');
  const genders = await Product.distinct('gender');
  const colors = await Product.distinct('colors');
  const sizes = await Product.distinct('sizes');
  
  // Get price range
  const priceRange = await Product.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    }
  ]);

  return {
    categories: categories.filter(cat => cat !== undefined),
    subcategories: subcategories.filter(sub => sub !== undefined),
    genders: genders.filter(gender => gender !== undefined),
    colors: colors.filter(color => color !== undefined),
    sizes: sizes.filter(size => size !== undefined),
    priceRange: priceRange[0] ? {
      min: priceRange[0].minPrice,
      max: priceRange[0].maxPrice
    } : { min: 0, max: 0 }
  };
};