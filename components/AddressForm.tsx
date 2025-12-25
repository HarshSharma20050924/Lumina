import React from 'react';
import { Input } from './ui/Input';

export const AddressForm = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="John" />
        <Input label="Last Name" placeholder="Doe" />
      </div>

      <Input label="Email Address" type="email" placeholder="john@example.com" />
      <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
      
      <Input label="Address" placeholder="123 Main St" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="City" placeholder="New York" />
        <Input label="State" placeholder="NY" />
        <Input label="ZIP Code" placeholder="10001" />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" id="save-address" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
        <label htmlFor="save-address" className="text-sm text-gray-600">
          Save this information for next time
        </label>
      </div>
    </div>
  );
};