import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { RatingStars } from './ui/RatingStars';
import { SizeSelector } from './ui/SizeSelector';
import { QuantityStepper } from './ui/QuantityStepper';
import { WishlistButton } from './ui/WishlistButton';
import { AccordionFAQ } from './ui/AccordionFAQ';
import { cn, formatPrice } from '../utils';

export const ProductDetails = () => {
  const { selectedProduct, navigateHome, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState(selectedProduct?.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors[0]);
  const [activeImage, setActiveImage] = useState(selectedProduct?.image);
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const images = [selectedProduct.image, selectedProduct.hoverImage, selectedProduct.image, selectedProduct.hoverImage];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-28 min-h-screen">
      <div className="mb-8">
        <Breadcrumbs items={[
          { label: 'Collection', onClick: navigateHome },
          { label: selectedProduct.category, onClick: () => {} },
          { label: selectedProduct.name, isActive: true }
        ]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`product-image-${selectedProduct.id}`}
            className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 w-full relative group"
          >
            <img 
              src={activeImage} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
             <div className="absolute top-4 right-4 z-10">
                <WishlistButton productId={selectedProduct.id} className="bg-white/80 backdrop-blur-sm" />
             </div>
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all relative",
                  activeImage === img ? "border-gray-900 ring-1 ring-gray-900" : "border-transparent hover:border-gray-200"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {activeImage === img && <div className="absolute inset-0 bg-black/10" />}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
              {selectedProduct.category}
            </span>
            {selectedProduct.isNew && (
              <span className="text-sm font-medium text-gray-900 border border-gray-200 px-2 py-1 rounded-md">
                New Season
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-2xl font-medium">
              {selectedProduct.discountPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-red-600">{formatPrice(selectedProduct.discountPrice)}</span>
                  <span className="text-gray-400 text-lg line-through">{formatPrice(selectedProduct.price)}</span>
                </div>
              ) : (
                formatPrice(selectedProduct.price)
              )}
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-1">
              <RatingStars rating={selectedProduct.rating} size="md" />
              <span className="ml-2 text-sm text-gray-500 underline decoration-gray-300 underline-offset-4">
                {selectedProduct.reviewCount} Reviews
              </span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {selectedProduct.description} Designed for those who value understated elegance and superior comfort. 
            Meticulously crafted to ensure durability and style.
          </p>

          <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-8">
            {/* Color Selector */}
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-3">
                Color: <span className="text-gray-500">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                      selectedColor === color 
                        ? "ring-2 ring-offset-2 ring-gray-900 border-transparent scale-110" 
                        : "border-gray-200 hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-900">Select Size</label>
                <button className="text-sm text-gray-500 underline">Size Guide</button>
              </div>
              <SizeSelector 
                sizes={selectedProduct.sizes} 
                selectedSize={selectedSize}
                onChange={setSelectedSize}
              />
            </div>

            {/* Quantity */}
             <div>
                <label className="text-sm font-medium text-gray-900 block mb-3">Quantity</label>
                <QuantityStepper value={quantity} onChange={setQuantity} className="w-32" />
             </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1 text-base h-14"
              onClick={() => selectedSize && selectedColor && addToCart(selectedProduct, quantity, selectedColor, selectedSize)}
            >
              Add to Cart - {formatPrice((selectedProduct.discountPrice || selectedProduct.price) * quantity)}
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-6 border border-gray-200">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Details Accordion */}
          <AccordionFAQ items={[
            {
              title: "Description & Fit",
              content: "Tailored for a regular fit. Fits true to size. Model is 6'1\" and wearing a size M. Features a structured shoulder and fully lined interior."
            },
            {
              title: "Composition & Care",
              content: "100% Organic Cotton. Machine wash cold with like colors. Do not bleach. Tumble dry low. Cool iron if needed."
            },
            {
              title: "Shipping & Returns",
              content: "Free standard shipping on orders over $200. Returns are accepted within 30 days of purchase. Items must be unworn and in original packaging."
            }
          ]} />
        </div>
      </div>
    </div>
  );
};