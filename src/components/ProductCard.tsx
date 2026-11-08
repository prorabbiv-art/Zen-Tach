import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Heart, Star, Eye, Check, Scale, Shield, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView
}) => {
  const { addToCart, toggleWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare } = useStore();
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const currentPrice = product.discountPrice || product.regularPrice;
  const discountAmount = product.discountPrice ? product.regularPrice - product.discountPrice : 0;
  const discountPercentage = product.discountPrice
    ? Math.round((discountAmount / product.regularPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-red-500/40 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* 1. Image Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#E53935] to-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md shadow-red-600/30">
              {discountPercentage}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="px-2 py-0.5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              NEW
            </span>
          )}
          {product.bestSeller && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
              HOT
            </span>
          )}
        </div>

        {/* Quick Actions (Floating Right) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
              isWishlisted
                ? 'bg-red-50 text-[#E53935] border border-red-200 scale-105'
                : 'bg-white/90 text-neutral-600 hover:text-[#E53935] hover:bg-white hover:scale-110'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isWishlisted ? 'fill-[#E53935]' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isCompared) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
              isCompared
                ? 'bg-[#E53935] text-white scale-105'
                : 'bg-white/90 text-neutral-600 hover:text-[#E53935] hover:bg-white hover:scale-110'
            }`}
            aria-label="Compare"
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-700 hover:text-neutral-900 flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Quick View"
              title="Quick Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold mb-1">
            <span className="uppercase tracking-wider text-[#E53935] font-black text-[11px]">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50/80 px-1.5 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-neutral-900 font-bold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-sm text-neutral-900 group-hover:text-[#E53935] transition-colors line-clamp-2 leading-snug cursor-pointer mb-1.5"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Warranty & Delivery Pill */}
          <div className="flex items-center justify-between gap-1 text-[10.5px] text-neutral-500 pb-2 mb-2 border-b border-neutral-100">
            <span className="flex items-center gap-1 font-medium truncate">
              <Shield className="w-3 h-3 text-emerald-600 shrink-0" />
              {product.warranty || 'Official Warranty'}
            </span>
            <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
              COD Available
            </span>
          </div>

          {/* Price & Stock */}
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              <span className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                ৳{currentPrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="ml-2 text-xs text-neutral-400 line-through">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {isLowStock && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">
                Only {product.stock} left
              </span>
            )}
            {!isLowStock && !isOutOfStock && (
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <Check className="w-3 h-3 stroke-[3]" /> In Stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-97 shadow-xs ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 hover:bg-[#E53935] hover:shadow-md hover:shadow-red-900/20 text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
