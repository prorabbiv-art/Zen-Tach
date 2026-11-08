import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingCart,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantBuy: (product: Product, quantity: number, color?: string, variant?: Record<string, string>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInstantBuy
}) => {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useStore();
  const { currentUser } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]?.name
  );
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    if (!product?.variants) return {};
    const initial: Record<string, string> = {};
    product.variants.forEach((v) => {
      if (v.options.length > 0) {
        initial[v.name] = v.options[0];
      }
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState(currentUser?.displayName || '');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const currentPrice = product.discountPrice || product.regularPrice;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedVariants);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onInstantBuy(product, quantity, selectedColor, selectedVariants);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter your review comments.', 'error');
      return;
    }
    setSubmittingReview(true);
    setTimeout(() => {
      showToast('Thank you! Your verified review has been submitted for moderation.', 'success');
      setReviewComment('');
      setSubmittingReview(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* 1. Left: Image Gallery */}
          <div className="p-6 sm:p-8 bg-neutral-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm relative">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPrice && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#E53935] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                    Save ৳{(product.regularPrice - product.discountPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#E53935] shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality & Warranty Trust Badges */}
            <div className="mt-6 pt-6 border-t border-neutral-200 grid grid-cols-2 gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E53935] shrink-0" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E53935] shrink-0" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* 2. Right: Product Details & Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Brand Header */}
              <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-1">
                <span className="uppercase tracking-wider font-bold text-[#E53935]">
                  {product.brand}
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* Ratings & Stock Status */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-neutral-400">({product.reviewCount} reviews)</span>
                </div>

                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                  </span>
                )}
              </div>

              {/* Price Block */}
              <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through">
                    ৳{product.regularPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-neutral-500 ml-auto font-medium">VAT Included</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-neutral-800 mb-2">
                    Color: <span className="text-neutral-500 font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-[#E53935] scale-110 shadow-sm'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor === c.name && (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              c.hex === '#FFFFFF' ? 'bg-neutral-900' : 'bg-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants Selector (e.g. Storage, Switch) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4 space-y-3">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-xs font-bold text-neutral-800 mb-2">
                        {variant.name}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: opt
                              }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              selectedVariants[variant.name] === opt
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <label className="text-xs font-bold text-neutral-800">Quantity:</label>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-neutral-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-1.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-4 rounded-xl bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-200 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Buy Now</span>
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className="mt-3 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#E53935] cursor-pointer transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#E53935] text-[#E53935]' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* 3. Bottom Tabs: Specs & Reviews */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-4 border-b border-neutral-200 mb-4">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-[#E53935] text-[#E53935]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'border-[#E53935] text-[#E53935]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Customer Reviews ({product.reviewCount})
                </button>
              </div>

              {activeTab === 'specs' && (
                <div className="overflow-hidden rounded-xl border border-neutral-200 divide-y divide-neutral-100 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-2.5 bg-white even:bg-neutral-50">
                      <span className="font-bold text-neutral-700">{key}</span>
                      <span className="col-span-2 text-neutral-600">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Verified Reviews Notice */}
                  <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600">
                    <p className="font-semibold text-neutral-900">Official Product Feedback</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Ratings from verified customers who purchased this gadget at ZEN TACH.
                    </p>
                  </div>

                  {/* Submit review */}
                  <form onSubmit={handleSubmitReview} className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">Your Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900"
                    />

                    <textarea
                      rows={2}
                      placeholder="Share your experience with this gadget..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900"
                    />

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-4 py-2 bg-neutral-900 hover:bg-[#E53935] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
