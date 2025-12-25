import React from 'react';
import { Facebook, Twitter, Instagram, Github, Mail, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tracking-tighter text-gray-900">Lumina</div>
              <div className="h-2 w-2 rounded-full bg-primary-500 mt-1" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Crafting the future of digital commerce with minimalist aesthetics and human-centric design. Experience the difference of quality.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Github].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {['New Arrivals', 'Best Sellers', 'Essentials', 'Accessories', 'Sale'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {['About Us', 'Sustainability', 'Careers', 'Press', 'Affiliates'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {['Help Center', 'Shipping & Returns', 'Size Guide', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-semibold text-gray-900">Stay Updated</h4>
            <p className="text-xs text-gray-500">
              Subscribe to our newsletter for exclusive drops.
            </p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                />
              </div>
              <Button size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 Lumina Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};