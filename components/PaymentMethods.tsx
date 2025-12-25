import React, { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { Input } from './ui/Input';
import { cn } from '../utils';

export const PaymentMethods = () => {
  const [method, setMethod] = useState<'card' | 'wallet'>('card');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>

      {/* Method Selector */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMethod('card')}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
            method === 'card' 
              ? "border-gray-900 bg-gray-50 text-gray-900" 
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
          )}
        >
          <CreditCard className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Credit Card</span>
        </button>
        <button
          onClick={() => setMethod('wallet')}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
            method === 'wallet' 
              ? "border-gray-900 bg-gray-50 text-gray-900" 
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
          )}
        >
          <Wallet className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Digital Wallet</span>
        </button>
      </div>

      {/* Card Form */}
      {method === 'card' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
          <Input label="Card Number" placeholder="0000 0000 0000 0000" icon={<CreditCard className="w-4 h-4" />} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry Date" placeholder="MM/YY" />
            <Input label="CVC" placeholder="123" />
          </div>
          <Input label="Cardholder Name" placeholder="John Doe" />
        </div>
      )}

      {/* Wallet Message */}
      {method === 'wallet' && (
        <div className="text-center py-8 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-4">
          <p className="text-sm text-gray-600 mb-4">You will be redirected to your wallet to complete the purchase.</p>
          <div className="flex justify-center gap-4 grayscale opacity-60">
             {/* Mock icons */}
             <div className="w-12 h-8 bg-black rounded" />
             <div className="w-12 h-8 bg-blue-600 rounded" />
          </div>
        </div>
      )}
    </div>
  );
};