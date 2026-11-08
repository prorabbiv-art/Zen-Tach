import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import {
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

interface ShopPageProps {
  initialCategoryId?: string;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategoryId,
  onSelectProduct
}) => {
  const { products, categories, language } = useStore();
  const { navigateToHome, navigateToProduct } = useRouter();

  const [selectedCatId, setSelectedCatId] = useState<string | null>(initialCategoryId || null);
  const [priceMax, setPriceMax] = useState<number>(350000);
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const availableBrands = Array.from(new Set(products.map((p) => p.brand)));

  const filteredProducts = products.filter((prod) => {
    if (selectedCatId && prod.categoryId !== selectedCatId) return false;
    const effectivePrice = prod.discountPrice || prod.regularPrice;
    if (effectivePrice > priceMax) return false;
    if (filterBrand !== 'all' && prod.brand !== filterBrand) return false;
    if (inStockOnly && prod.stock <= 0) return false;
    if (onSaleOnly && !prod.discountPrice) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.regularPrice;
    const priceB = b.discountPrice || b.regularPrice;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const currentCategoryObj = categories.find((c) => c.id === selectedCatId);

  const handleResetFilters = () => {
    setSelectedCatId(null);
    setFilterBrand('all');
    setPriceMax(350000);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
              Home
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-700">Shop</span>
            {currentCategoryObj && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="font-bold text-neutral-900">{currentCategoryObj.name}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            {currentCategoryObj ? currentCategoryObj.name : 'All Technology Gadgets'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Showing {sortedProducts.length} authentic products in Bangladesh
          </p>
        </div>

        {/* Sorting & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold flex items-center gap-2 text-neutral-800"
          >
            <Filter className="w-4 h-4 text-[#E53935]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-neutral-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Shop Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Filter Sidebar */}
        <aside
          className={`lg:block ${
            isMobileFilterOpen ? 'block' : 'hidden'
          } space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 h-fit shadow-xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#E53935]" />
              <span>Filter Products</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#E53935] hover:underline font-semibold cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-900">Department</label>
            <div className="space-y-1 text-xs max-h-64 overflow-y-auto">
              <button
                onClick={() => setSelectedCatId(null)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition-colors cursor-pointer flex justify-between ${
                  selectedCatId === null
                    ? 'bg-red-50 text-[#E53935] font-bold'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span>All Gadgets</span>
                <span className="text-neutral-400">({products.length})</span>
              </button>

              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCatId(c.id)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition-colors cursor-pointer flex justify-between ${
                      selectedCatId === c.id
                        ? 'bg-red-50 text-[#E53935] font-bold'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{language === 'bn' && c.nameBn ? c.nameBn : c.name}</span>
                    <span className="text-neutral-400">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <div className="flex justify-between text-xs font-bold">
              <span>Max Price</span>
              <span className="text-[#E53935]">৳{priceMax.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={350000}
              step={2000}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#E53935] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>৳1,000</span>
              <span>৳350,000</span>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <label className="block text-xs font-bold text-neutral-900">Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium cursor-pointer"
            >
              <option value="all">All Tech Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Stock & Discount Toggles */}
          <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#E53935] focus:ring-[#E53935]"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="rounded text-[#E53935] focus:ring-[#E53935]"
              />
              <span>On Sale / Discounted</span>
            </label>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
              <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900">No matching gadgets found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try relaxing your filter criteria or price limits to view more products.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#E53935] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={() => navigateToProduct(p.id)}
                  onQuickView={() => onSelectProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
