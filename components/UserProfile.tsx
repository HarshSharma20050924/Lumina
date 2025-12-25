import React, { useState } from 'react';
import { User, Settings, ShoppingBag, Heart, MapPin, LogOut, Shield } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tabs } from './ui/Tabs';
import { OrderHistory } from './OrderHistory';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS } from '../utils';
import { Breadcrumbs } from './ui/Breadcrumbs';

export const UserProfile = () => {
  const { user, logout, navigateHome, orders, wishlist, updateUser, addToast } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  if (!user) {
    navigateHome();
    return null;
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    addToast({ type: 'success', message: 'Profile updated successfully' });
  };

  const wishlistProducts = MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));

  const ProfileTab = () => (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-500">Manage your personal details and delivery address.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            disabled={!isEditing}
          />
          <Input 
            label="Email Address" 
            type="email"
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            disabled={!isEditing}
          />
          <Input 
            label="Phone Number" 
            type="tel"
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            disabled={!isEditing}
          />
          <Input 
            label="Default Address" 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})}
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        )}
      </form>

      <div className="mt-12 pt-8 border-t border-gray-100">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
         <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-gray-100 rounded-full">
               <Shield className="w-5 h-5 text-gray-600" />
             </div>
             <div>
               <p className="font-medium text-gray-900">Password</p>
               <p className="text-sm text-gray-500">Last changed 3 months ago</p>
             </div>
           </div>
           <Button variant="ghost" size="sm">Update</Button>
         </div>
      </div>
    </div>
  );

  const WishlistTab = () => (
    <div>
      <div className="mb-6">
         <h2 className="text-lg font-semibold text-gray-900">Saved Items ({wishlist.length})</h2>
         <p className="text-sm text-gray-500">Items you've bookmarked for later.</p>
      </div>
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
           <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-500">Your wishlist is empty</p>
           <Button variant="ghost" onClick={navigateHome} className="mt-2">Start Shopping</Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Home', onClick: navigateHome },
          { label: 'Account', isActive: true }
        ]} className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
              <div>
                <h2 className="font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {/* Note: The tabs are controlled by the Tabs component, this is just visual consistency if we wanted a sidebar nav */}
            </nav>

            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => { logout(); navigateHome(); }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Tabs 
              tabs={[
                { 
                  id: 'orders', 
                  label: 'Order History', 
                  content: <OrderHistory orders={orders} />
                },
                { 
                  id: 'profile', 
                  label: 'Profile & Settings', 
                  content: <ProfileTab />
                },
                { 
                  id: 'wishlist', 
                  label: 'Wishlist', 
                  content: <WishlistTab />
                }
              ]}
              defaultTab="orders"
            />
          </main>
        </div>
      </div>
    </div>
  );
};