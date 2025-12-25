import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { useStore } from '../store';
import { MOCK_PRODUCTS } from '../utils';
import { SortDropdown } from './ui/SortDropdown';
import { ShoppingBag } from 'lucide-react';
import { Button } from './ui/Button';
import { Pagination } from './ui/Pagination';
import { ActiveFilters } from './ActiveFilters';
import { EmptyState } from './ui/EmptyState';

export const ProductGrid = () => {
  const { filters, sortOption, searchQuery, setSortOption, resetFilters, currentPage, itemsPerPage, setPage } = useStore();

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Colors
    if (filters.colors.length > 0) {
      result = result.filter(p => p.colors.some(c => filters.colors.includes(c)));
    }

    // Sizes
    if (filters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
    }

    // Sort
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        // Mock newest by preserving order or explicit field if available
        break;
    }

    return result;
  }, [filters, sortOption, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <p className="text-gray-500 text-sm">
          Showing <span className="font-medium text-gray-900">{paginatedProducts.length}</span> of {filteredProducts.length} results
        </p>
        <SortDropdown value={sortOption} onChange={setSortOption} />
      </div>

      <ActiveFilters />

      {filteredProducts.length === 0 ? (
        <EmptyState 
          icon={ShoppingBag}
          title="No products found"
          description="We couldn't find any products matching your filters. Try adjusting your search criteria."
          actionLabel="Clear all filters"
          onAction={resetFilters}
        />
      ) : (
        <>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};