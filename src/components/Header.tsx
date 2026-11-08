import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../router/RouterContext';
import { Product } from '../types';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Phone,
  Mail,
  Shield,
  Menu,
  X,
  LogOut,
  Package,
  Layers,
  ChevronDown,
  Scale
} from 'lucide-react';

interface HeaderProps {
  onSelectProduct?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectProduct }) => {
  const {
    products,
    categories,
    settings,
    cartCount,
    cartSubtotal,
    wishlist,
    compareList,
    language,
    setLanguage
  } = useStore();

  const {
    currentUser,
    userProfile,
    isAdmin,
    logout
  } = useAuth();

  const {
    route,
    navigate,
    navigateToHome,
    navigateToShop,
    navigateToCategory,
    navigateToCart,
    navigateToWishlist,
    navigateToCompare,
    navigateToTracking,
    navigateToAccount,
    navigateToAdmin,
    navigateToAuth,
    navigateToProduct
  } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      {/* 1. Announcement Bar */}
      {settings.announcementEnabled && (
        <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-neutral-400">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E53935]" />
                <span className="font-medium text-neutral-200">{settings.phone}</span>
              </a>
              <span className="hidden sm:inline text-neutral-700">|</span>
              <a
                href={`mailto:${settings.email}`}
                className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#E53935]" />
                <span>{settings.email}</span>
              </a>
            </div>

            <div className="text-center font-medium text-neutral-200 text-xs truncate max-w-md hidden md:block">
              {settings.announcement}
            </div>

            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              <button
                onClick={() => navigateToTracking()}
                className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#E53935]" />
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}</span>
              </button>

              <span className="text-neutral-700">|</span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-neutral-800 rounded px-1.5 py-0.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    language === 'en' ? 'bg-[#E53935] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    language === 'bn' ? 'bg-[#E53935] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  বাং
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official ZEN TACH Logo */}
          <button
            onClick={navigateToHome}
            className="flex items-center gap-2 group cursor-pointer shrink-0 text-left"
          >
            <img
              src="/assets/aistudio/Zen_Tach_Smart_Tech_Logo_b93b53fb.png"
              alt="ZEN TACH - Smarter Tech. Better Life."
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </button>

          {/* Desktop Live Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={language === 'bn' ? 'স্মার্টফোন, ল্যাপটপ বা গ্যাজেট সার্চ করুন...' : 'Search gadgets, iPhone, laptops, audio...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-100 border border-transparent rounded-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/20 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500 px-3">
                  <span>Found {searchResults.length} tech gadgets</span>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToShop();
                    }}
                    className="text-[#E53935] font-semibold hover:underline cursor-pointer"
                  >
                    View All in Shop
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        navigateToProduct(product.id);
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          {product.brand}
                        </div>
                        <div className="text-sm font-semibold text-neutral-900 truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-[#E53935]">
                            ৳{(product.discountPrice || product.regularPrice).toLocaleString()}
                          </span>
                          {product.discountPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              ৳{product.regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Compare Link */}
            <button
              onClick={navigateToCompare}
              className={`relative p-2 sm:p-2.5 rounded-full transition-colors cursor-pointer ${
                route.page === 'compare'
                  ? 'bg-red-50 text-[#E53935]'
                  : 'text-neutral-700 hover:text-[#E53935] hover:bg-neutral-100'
              }`}
              aria-label="Compare Products"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E53935] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Page Link */}
            <button
              onClick={navigateToWishlist}
              className={`relative p-2.5 rounded-full transition-colors cursor-pointer ${
                route.page === 'wishlist'
                  ? 'bg-red-50 text-[#E53935]'
                  : 'text-neutral-700 hover:text-[#E53935] hover:bg-neutral-100'
              }`}
              aria-label="Wishlist Page"
              title="My Wishlist"
            >
              <Heart className={`w-5 h-5 ${route.page === 'wishlist' ? 'fill-[#E53935]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E53935] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Dedicated Cart Page Link */}
            <button
              onClick={navigateToCart}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-full transition-colors cursor-pointer ${
                route.page === 'cart'
                  ? 'bg-red-50 text-[#E53935] border border-red-200'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
              }`}
              aria-label="Shopping Cart Page"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-neutral-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E53935] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-neutral-500 leading-none">
                  Cart
                </span>
                <span className="text-xs font-bold text-neutral-900 leading-tight">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              </div>
            </button>

            {/* Account / Login Dropdown */}
            <div ref={accountRef} className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-200"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
                </button>
              ) : (
                <button
                  onClick={() => navigateToAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full transition-colors shadow-xs cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-neutral-300" />
                  <span className="hidden sm:inline">
                    {language === 'bn' ? 'লগইন' : 'Sign In'}
                  </span>
                </button>
              )}

              {/* Account Dropdown */}
              {isAccountMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-medium text-neutral-500">Signed in as</p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {currentUser.displayName || currentUser.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-[#E53935] text-[10px] font-bold rounded">
                        Administrator
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigateToAccount();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-neutral-500" />
                    My Account Page
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigateToTracking();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-neutral-500" />
                    Track Orders Page
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        navigateToAdmin();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#E53935] hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#E53935]" />
                      Admin Control Center
                    </button>
                  )}

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      logout();
                      navigateToHome();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Navigation Links */}
        <nav className="hidden md:flex items-center justify-between border-t border-neutral-100 mt-3 pt-2 text-sm font-medium">
          <div className="flex items-center gap-6">
            <button
              onClick={navigateToHome}
              className={`transition-colors cursor-pointer ${
                route.page === 'home'
                  ? 'text-[#E53935] font-black'
                  : 'text-neutral-800 hover:text-[#E53935]'
              }`}
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </button>

            <button
              onClick={navigateToShop}
              className={`transition-colors cursor-pointer ${
                route.page === 'shop'
                  ? 'text-[#E53935] font-black'
                  : 'text-neutral-800 hover:text-[#E53935]'
              }`}
            >
              {language === 'bn' ? 'সব গ্যাজেট' : 'Shop All'}
            </button>

            {/* Categories Dropdown & Page Link */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className={`flex items-center gap-1 transition-colors cursor-pointer ${
                  route.page === 'categories' || route.page === 'category'
                    ? 'text-[#E53935] font-black'
                    : 'text-neutral-800 hover:text-[#E53935]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoriesDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in"
                >
                  <button
                    onClick={() => {
                      setIsCategoriesDropdownOpen(false);
                      navigate('/categories');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-[#E53935] hover:bg-neutral-50 flex items-center justify-between border-b border-neutral-100"
                  >
                    <span>View All Categories Directory</span>
                    <span>→</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigateToCategory(cat.id);
                        setIsCategoriesDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#E53935] flex items-center justify-between cursor-pointer"
                    >
                      <span>{language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={navigateToCompare}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
                route.page === 'compare'
                  ? 'text-[#E53935] font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{language === 'bn' ? 'তুলনা করুন' : 'Compare'}</span>
              {compareList.length > 0 && (
                <span className="px-1.5 py-0.2 bg-[#E53935] text-white text-[10px] font-bold rounded-full">
                  {compareList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/about')}
              className={`transition-colors cursor-pointer ${
                route.page === 'about'
                  ? 'text-[#E53935] font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About ZEN TACH'}
            </button>

            <button
              onClick={() => navigate('/contact')}
              className={`transition-colors cursor-pointer ${
                route.page === 'contact'
                  ? 'text-[#E53935] font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {language === 'bn' ? 'যোগাযোগ' : 'Contact Support'}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-500">
            <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Genuine Tech
            </span>
            <span>COD Available All Over Bangladesh</span>
          </div>
        </nav>
      </div>

      {/* 4. Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white p-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3 font-medium text-sm">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateToHome();
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              Home Page
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateToShop();
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              Shop All Gadgets
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/categories');
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              Browse Categories
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateToCart();
              }}
              className="text-left py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#E53935] text-xs font-bold">
                {cartCount}
              </span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateToWishlist();
              }}
              className="text-left py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold">
                {wishlist.length}
              </span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateToCompare();
              }}
              className="text-left py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Gadget Comparison</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#E53935] text-xs font-bold">
                {compareList.length}
              </span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateToTracking();
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              Track Order Page
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/about');
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              About ZEN TACH
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/contact');
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              Contact Support
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateToAccount();
                }}
                className="text-left py-2 text-neutral-900 font-bold"
              >
                My Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateToAuth('login');
                }}
                className="text-left py-2 text-[#E53935] font-bold"
              >
                Sign In / Register
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateToAdmin();
                }}
                className="text-left py-2 text-[#E53935] font-bold flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard Page
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
