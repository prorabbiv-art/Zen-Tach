import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface RouteState {
  page:
    | 'home'
    | 'shop'
    | 'categories'
    | 'category'
    | 'product'
    | 'cart'
    | 'checkout'
    | 'track'
    | 'wishlist'
    | 'compare'
    | 'account'
    | 'admin'
    | 'login'
    | 'register'
    | 'about'
    | 'contact'
    | 'terms'
    | 'privacy'
    | 'refund';
  id?: string;
  subTab?: string;
}

interface RouterContextType {
  route: RouteState;
  navigate: (path: string) => void;
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (categoryId: string) => void;
  navigateToShop: () => void;
  navigateToCart: () => void;
  navigateToCheckout: () => void;
  navigateToTracking: (orderId?: string) => void;
  navigateToAccount: () => void;
  navigateToWishlist: () => void;
  navigateToCompare: () => void;
  navigateToAdmin: (subTab?: string) => void;
  navigateToAuth: (mode?: 'login' | 'register') => void;
  navigateToHome: () => void;
  navigateToAbout: () => void;
  navigateToContact: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

/**
 * Parses any path string (e.g. "product/prod-123", "/admin/orders", "#/shop")
 * into a structured RouteState.
 */
export function parseRouteString(rawString: string): RouteState {
  if (!rawString) return { page: 'home' };

  // Remove leading hashes, query params, and leading/trailing slashes
  const clean = rawString
    .replace(/^#\/?/, '')
    .split('?')[0]
    .replace(/^\/+|\/+$/g, '')
    .trim();

  if (!clean || clean === 'index.html') {
    return { page: 'home' };
  }

  const parts = clean.split('/');
  const main = (parts[0] || '').toLowerCase();
  const sub = parts[1];

  switch (main) {
    case 'shop':
      return { page: 'shop' };
    case 'categories':
      return { page: 'categories' };
    case 'category':
      return { page: 'category', id: sub };
    case 'product':
      return { page: 'product', id: sub };
    case 'cart':
      return { page: 'cart' };
    case 'checkout':
      return { page: 'checkout' };
    case 'track':
    case 'orders':
      return { page: 'track', id: sub };
    case 'wishlist':
      return { page: 'wishlist' };
    case 'compare':
      return { page: 'compare' };
    case 'account':
      return { page: 'account', subTab: sub };
    case 'admin':
      return { page: 'admin', subTab: sub };
    case 'login':
      return { page: 'login' };
    case 'register':
      return { page: 'register' };
    case 'about':
      return { page: 'about' };
    case 'contact':
      return { page: 'contact' };
    case 'terms':
      return { page: 'terms' };
    case 'privacy':
      return { page: 'privacy' };
    case 'refund':
      return { page: 'refund' };
    default:
      return { page: 'home' };
  }
}

/**
 * Resolves current route from both window.location.hash and window.location.pathname.
 * This ensures full compatibility with static hosting (cPanel Apache rewrite to index.html)
 * as well as legacy/fallback hash routing (#/shop).
 */
export function resolveCurrentRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { page: 'home' };
  }

  // 1. Check hash first if present (#/product/123 or #admin)
  if (window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '').trim();
    if (hashClean) {
      return parseRouteString(hashClean);
    }
  }

  // 2. Check pathname (e.g. /shop, /admin, /product/123)
  if (window.location.pathname) {
    const pathClean = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
    if (pathClean && pathClean !== 'index.html') {
      return parseRouteString(pathClean);
    }
  }

  return { page: 'home' };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteState>(() => resolveCurrentRoute());

  // Listen to both popstate (browser back/forward & pushState) and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = resolveCurrentRoute();
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    const cleanPath = path.trim();

    // If explicit hash was passed (e.g., "#/shop")
    if (cleanPath.startsWith('#')) {
      if (window.location.hash === cleanPath) {
        setRoute(parseRouteString(cleanPath));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.hash = cleanPath;
      }
      return;
    }

    // Standard SPA Clean Path (e.g., "/shop", "/product/abc", "/admin")
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    // Update history state smoothly without full page reload
    if (window.location.pathname !== normalizedPath || window.location.hash) {
      window.history.pushState(null, '', normalizedPath);
    }

    setRoute(parseRouteString(normalizedPath));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToProduct = useCallback((productId: string) => navigate(`/product/${productId}`), [navigate]);
  const navigateToCategory = useCallback((categoryId: string) => navigate(`/category/${categoryId}`), [navigate]);
  const navigateToShop = useCallback(() => navigate('/shop'), [navigate]);
  const navigateToCart = useCallback(() => navigate('/cart'), [navigate]);
  const navigateToCheckout = useCallback(() => navigate('/checkout'), [navigate]);
  const navigateToTracking = useCallback((orderId?: string) => navigate(orderId ? `/track/${orderId}` : '/track'), [navigate]);
  const navigateToAccount = useCallback(() => navigate('/account'), [navigate]);
  const navigateToWishlist = useCallback(() => navigate('/wishlist'), [navigate]);
  const navigateToCompare = useCallback(() => navigate('/compare'), [navigate]);
  const navigateToAdmin = useCallback((subTab?: string) => navigate(subTab ? `/admin/${subTab}` : '/admin'), [navigate]);
  const navigateToAuth = useCallback((mode?: 'login' | 'register') => navigate(mode === 'register' ? '/register' : '/login'), [navigate]);
  const navigateToHome = useCallback(() => navigate('/'), [navigate]);
  const navigateToAbout = useCallback(() => navigate('/about'), [navigate]);
  const navigateToContact = useCallback(() => navigate('/contact'), [navigate]);

  return (
    <RouterContext.Provider
      value={{
        route,
        navigate,
        navigateToProduct,
        navigateToCategory,
        navigateToShop,
        navigateToCart,
        navigateToCheckout,
        navigateToTracking,
        navigateToAccount,
        navigateToWishlist,
        navigateToCompare,
        navigateToAdmin,
        navigateToAuth,
        navigateToHome,
        navigateToAbout,
        navigateToContact
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
