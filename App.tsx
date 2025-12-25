import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductDetails } from './components/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { UserProfile } from './components/UserProfile';
import { AdminLayout } from './components/admin/AdminLayout';
import { Footer } from './components/Footer';
import { ToastNotifications } from './components/ui/ToastNotifications';
import { FeaturedCategories } from './components/FeaturedCategories';
import { Testimonials } from './components/Testimonials';
import { NewsletterSignup } from './components/NewsletterSignup';
import { BackToTop } from './components/ui/BackToTop';
import { ShopOverview } from './components/ShopOverview';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useStore } from './store';

const App = () => {
  const { currentView, loadProducts, loadCart, loadOrders } = useStore();

  // Load data from API on app start
  useEffect(() => {
    loadProducts();
    loadCart();
    loadOrders();
  }, [loadProducts, loadCart, loadOrders]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorBoundary>
          <AdminLayout />
          <ToastNotifications />
        </ErrorBoundary>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'checkout':
        return <Checkout />;
      case 'profile':
        return <UserProfile />;
      case 'product-detail':
        return <ProductDetails />;
      case 'home':
      default:
        return (
          <>
            <Hero />

            {/* New Shop Overview Section */}
            <ShopOverview />

            <FeaturedCategories />

            <section id="product-grid" className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 border-t border-gray-100">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                  <CategorySidebar />
                </aside>
                <div className="flex-1 w-full">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">New Arrivals</h2>
                    <p className="text-gray-500">
                      Discover our latest collection of premium essentials.
                    </p>
                  </div>
                  <ProductGrid />
                </div>
              </div>
            </section>

            <Testimonials />

            <NewsletterSignup />
          </>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Header />
        <CartDrawer />
        <ToastNotifications />
        <BackToTop />

        <main className={currentView === 'checkout' || currentView === 'profile' ? 'pt-20' : ''}>
          {renderContent()}
        </main>

        {currentView !== 'checkout' && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;