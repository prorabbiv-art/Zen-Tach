import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { wishlist, toggleWishlist, moveToCartFromWishlist } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E53935] fill-[#E53935]" />
            <h2 className="text-base sm:text-lg font-black text-neutral-900">
              My Saved Wishlist ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#E53935] flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-neutral-900 text-base">Your Wishlist is Empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Tap the heart icon on any smartphone, laptop, or gadget to save it here for later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {wishlist.map((product) => {
                const currentPrice = product.discountPrice || product.regularPrice;
                const isOutOfStock = product.stock <= 0;

                return (
                  <div
                    key={product.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="flex items-center gap-3 cursor-pointer min-w-0"
                    >
                      <img
                        src={product.thumbnail || product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200 group-hover:border-[#E53935] transition-colors"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-neutral-400">
                          {product.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#E53935] transition-colors truncate max-w-xs sm:max-w-md">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-neutral-950">
                            ৳{currentPrice.toLocaleString()}
                          </span>
                          {product.discountPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              ৳{product.regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => moveToCartFromWishlist(product)}
                        disabled={isOutOfStock}
                        className="px-3 py-2 bg-neutral-900 hover:bg-[#E53935] disabled:bg-neutral-200 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
