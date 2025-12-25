import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react';
import { useStore } from '../../store';
import { DashboardCards } from './DashboardCards';
import { InventoryManager } from './InventoryManager';
import { OrderManager } from './OrderManager';

export const AdminLayout = () => {
  const { navigateHome, logout } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 top-16 z-30 hidden lg:block">
        <div className="p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Admin Console</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'dashboard' | 'products' | 'orders')}
                className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100">
           <button 
             onClick={navigateHome}
             className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 w-full mb-3"
           >
             <LogOut className="w-5 h-5 mr-3" /> Exit Admin
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center lg:hidden">
             <div className="flex gap-2">
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as 'dashboard' | 'products' | 'orders')}
                   className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                 >
                   <tab.icon className="w-5 h-5" />
                 </button>
               ))}
             </div>
             <button onClick={navigateHome} className="text-sm font-medium text-gray-600">Exit</button>
          </header>

          <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab} Overview</h1>

          {activeTab === 'dashboard' && <DashboardCards />}
          {activeTab === 'dashboard' && <div className="mt-8"><OrderManager /></div>}
          
          {activeTab === 'products' && <InventoryManager />}
          {activeTab === 'orders' && <OrderManager />}
        </div>
      </main>
    </div>
  );
};