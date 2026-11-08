import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, moveToCartFromWishlist } = useStore();
  const { navigateToHome, navigateToShop, navigateToProduct } = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">My Wishlist</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <Heart className="w-6 h-6 fill-[#E53935]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Saved Wishlist
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Saved tech gadgets for future purchases ({wishlist.length} items)
            </p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-neutral-200 max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-red-50 text-[#E53935] flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Save items that catch your eye while browsing. They will stay safely here until you are ready to complete your purchase.
          </p>
          <button
            onClick={navigateToShop}
            className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Explore Tech Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const currentPrice = product.discountPrice || product.regularPrice;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div
                  onClick={() => navigateToProduct(product.id)}
                  className="relative aspect-square overflow-hidden bg-neutral-100 cursor-pointer"
                >
                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-600 flex items-center justify-center shadow-md cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      {product.brand}
                    </span>
                    <h3
                      onClick={() => navigateToProduct(product.id)}
                      className="font-bold text-sm text-neutral-900 hover:text-[#E53935] transition-colors line-clamp-2 leading-snug cursor-pointer mt-1"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-black text-neutral-900">
                        ৳{currentPrice.toLocaleString()}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          ৳{product.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => moveToCartFromWishlist(product)}
                      disabled={isOutOfStock}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-[#E53935] disabled:bg-neutral-200 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
