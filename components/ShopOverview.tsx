import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';

const SECTIONS = [
  {
    id: 'women',
    title: 'Women',
    image: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?q=80&w=2000&auto=format&fit=crop',
    description: 'Effortless style for the modern woman.'
  },
  {
    id: 'men',
    title: 'Men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2000&auto=format&fit=crop',
    description: 'Precision tailoring and everyday essentials.'
  },
  {
    id: 'kids',
    title: 'Kids',
    image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2000&auto=format&fit=crop',
    description: 'Comfort and durability for little explorers.'
  }
];

export const ShopOverview = () => {
  const { setFilter } = useStore();

  const handleSectionClick = (sectionId: string) => {
    // This assumes we are filtering by gender or a specific category tag
    // For this mock, we'll map the section ID to a category filter for demonstration
    // In a real app with 'gender' field, you'd set the gender filter
    // Here we will simulate scrolling to grid and setting a filter or just scrolling
    const element = document.getElementById('product-grid');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SECTIONS.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => handleSectionClick(section.id)}
          >
            <div className="absolute inset-0 bg-gray-200">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full text-white">
              <h3 className="text-3xl font-bold mb-2">{section.title}</h3>
              <p className="text-gray-200 mb-6 opacity-90">{section.description}</p>
              
              <Button 
                variant="glass" 
                className="bg-white/20 hover:bg-white text-white hover:text-gray-900 border-white/40"
              >
                Shop {section.title} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};