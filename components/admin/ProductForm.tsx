import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    price: 0,
    category: 'Outerwear',
    gender: 'Men',
    subcategory: '',
    description: '',
    image: '',
    stock: 0,
    isNew: false,
    colors: ['#000000'],
    sizes: ['M']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col max-h-[90vh]">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Product Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label="Price ($)" 
            type="number"
            value={formData.price}
            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value as any})}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>
           </div>
           
           <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Outerwear">Outerwear</option>
              <option value="Essentials">Essentials</option>
              <option value="Tailoring">Tailoring</option>
              <option value="Accessories">Accessories</option>
              <option value="Activewear">Activewear</option>
            </select>
           </div>

           <Input 
            label="Subcategory (e.g. Jeans)" 
            value={formData.subcategory || ''}
            onChange={e => setFormData({...formData, subcategory: e.target.value})}
            placeholder="T-Shirt, Jacket..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px]"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <Input 
          label="Image URL" 
          value={formData.image}
          onChange={e => setFormData({...formData, image: e.target.value, hoverImage: e.target.value})}
          placeholder="https://..."
        />

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
           <div className="flex items-center gap-2">
             <input 
                type="checkbox" 
                id="isNew"
                checked={formData.isNew}
                onChange={e => setFormData({...formData, isNew: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
             />
             <label htmlFor="isNew" className="text-sm font-medium text-gray-700">New Arrival</label>
           </div>
           
           <div className="flex items-center gap-2 ml-4">
             <label className="text-sm font-medium text-gray-700">Stock:</label>
             <input 
               type="number" 
               className="w-20 h-9 rounded border border-gray-300 px-2 text-sm"
               value={formData.stock}
               onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
             />
           </div>
        </div>
      </form>

      <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>{product ? 'Save Changes' : 'Create Product'}</Button>
      </div>
    </div>
  );
};