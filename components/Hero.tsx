import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export const Hero = () => {
  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-gray-100 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Hero Background"
          className="w-full h-full object-cover object-center opacity-90"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl text-white space-y-6"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-white mb-6"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
              Minimalism
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">
            Discover the Summer 2026 Collection. Engineered for comfort, designed for the modern aesthetic.
          </p>
          
          <div className="flex gap-4 pt-4">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 border-none">
              Shop Collection
            </Button>
            <Button size="lg" variant="glass" className="text-white hover:bg-white/10">
              View Lookbook <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 w-full h-1/2 bg-white"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
};