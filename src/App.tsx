import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { RouterProvider, useRouter } from './router/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product } from './types';
import { testConnection } from './firebase/config';

import { lazy, Suspense } from 'react';

// Eager loaded core pages for fast initial paint
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

// Code-split heavy & secondary pages for bundle optimization and admin isolation
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const CustomerAccountPage = lazy(() => import('./pages/CustomerAccountPage').then(m => ({ default: m.CustomerAccountPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PolicyPage = lazy(() => import('./pages/PolicyPage').then(m => ({ default: m.PolicyPage })));

const AppContent: React.FC = () => {
  const { route, navigateToCheckout } = useRouter();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const handleInstantBuyFromQuickView = () => {
    setQuickViewProduct(null);
    navigateToCheckout();
  };

  const renderActivePage = () => {
    switch (route.page) {
      case 'home':
        return <HomePage onSelectProduct={(p) => setQuickViewProduct(p)} />;
      case 'shop':
        return <ShopPage onSelectProduct={(p) => setQuickViewProduct(p)} />;
      case 'categories':
        return <CategoriesPage />;
      case 'category':
        return (
          <ShopPage
            initialCategoryId={route.id}
            onSelectProduct={(p) => setQuickViewProduct(p)}
          />
        );
      case 'product':
        return <ProductDetailPage productId={route.id || ''} />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'track':
        return <OrderTrackingPage initialOrderId={route.id} />;
      case 'wishlist':
        return <WishlistPage />;
      case 'compare':
        return <ComparePage />;
      case 'account':
        return <CustomerAccountPage initialTab={route.subTab} />;
      case 'admin':
        return (
          <AdminPage
            initialSubTab={route.subTab}
            onSelectProduct={(p) => setQuickViewProduct(p)}
          />
        );
      case 'login':
        return <AuthPage initialMode="login" />;
      case 'register':
        return <AuthPage initialMode="register" />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'terms':
        return <PolicyPage policyType="terms" />;
      case 'privacy':
        return <PolicyPage policyType="privacy" />;
      case 'refund':
        return <PolicyPage policyType="refund" />;
      default:
        return <HomePage onSelectProduct={(p) => setQuickViewProduct(p)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900 selection:bg-[#E53935] selection:text-white">
      {/* Global Header with Router integration */}
      <Header onSelectProduct={(p) => setQuickViewProduct(p)} />

      {/* Main Dedicated Page View with Suspense for code-split chunks */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-neutral-300 border-t-[#E53935] rounded-full animate-spin" />
            </div>
          }
        >
          {renderActivePage()}
        </Suspense>
      </main>

      {/* Global Footer with Router integration */}
      <Footer />

      {/* Optional Quick-View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onInstantBuy={handleInstantBuyFromQuickView}
      />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
