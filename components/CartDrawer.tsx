import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { formatPrice } from '../utils';

export const CartDrawer = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, navigateToCheckout } = useStore();
  
  const subtotal = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Your Cart ({cart.length})</h2>
              <Button variant="ghost" size="icon" onClick={() => toggleCart(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                  <Button onClick={() => toggleCart(false)}>Start Shopping</Button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.cartId} 
                    className="flex gap-4"
                  >
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                        <div className="mt-1 flex gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{item.selectedSize}</span>
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200" 
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-lg">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                            onClick={() => updateQuantity(item.cartId, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-r-lg"
                            onClick={() => updateQuantity(item.cartId, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartId)}
                          className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>{formatPrice(subtotal)}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button className="w-full" size="lg" onClick={navigateToCheckout}>
                  Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  );
}