import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { AcceptedPaymentGrid } from '../components/PaymentLogos';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingCart,
  Zap,
  Check,
  AlertCircle,
  Share2,
  Phone,
  PackageCheck,
  HelpCircle,
  ChevronDown,
  Scale,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
}

const BD_DISTRICTS = [
  { name: 'Dhaka (Metro)', zone: 'Inside Dhaka', time: 'Within 24 Hours (Next Day)', fee: 60 },
  { name: 'Gazipur / Savar / Narayanganj', zone: 'Inside Dhaka', time: '24 - 48 Hours', fee: 60 },
  { name: 'Chattogram (Metro)', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Sylhet', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Rajshahi', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Khulna', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Barishal', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Rangpur', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Cumilla', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: 'Bogura', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 },
  { name: "Cox's Bazar", zone: 'Outside Dhaka', time: '3 - 4 Business Days', fee: 120 },
  { name: 'Mymensingh', zone: 'Outside Dhaka', time: '48 - 72 Hours', fee: 120 }
];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const {
    products,
    categories,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    settings,
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    addBundleToCart
  } = useStore();

  const {
    navigateToHome,
    navigateToShop,
    navigateToCategory,
    navigateToProduct,
    navigateToCheckout,
    navigateToCompare
  } = useRouter();

  const { currentUser, userProfile } = useAuth();

  const product = products.find((p) => p.id === productId) || products[0];

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
  const [activeTab, setActiveTab] = useState<'specs' | 'inbox' | 'warranty' | 'faqs' | 'reviews'>('specs');

  // Delivery Calculator State
  const [selectedDistrict, setSelectedDistrict] = useState(BD_DISTRICTS[0].name);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Reviews form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <button
          onClick={navigateToShop}
          className="px-6 py-2.5 bg-[#E53935] text-white rounded-xl text-xs font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;
  const currentPrice = product.discountPrice || product.regularPrice;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const categoryObj = categories.find((c) => c.id === product.categoryId);

  // Calculate delivery estimate based on district selection
  const districtInfo = BD_DISTRICTS.find((d) => d.name === selectedDistrict) || BD_DISTRICTS[0];
  const isDeliveryFree = currentPrice >= settings.freeDeliveryThreshold && districtInfo.zone === 'Inside Dhaka';
  const calculatedFee = isDeliveryFree ? 0 : (districtInfo.zone === 'Inside Dhaka' ? settings.deliveryDhaka : settings.deliveryOutside);

  // Find bundle products if configured
  const bundleProducts = (product.frequentlyBoughtWith || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is typeof product => Boolean(p));

  const bundleAll = [product, ...bundleProducts];
  const bundleRawTotal = bundleAll.reduce((sum, p) => sum + (p.discountPrice || p.regularPrice), 0);
  const bundleDiscountPct = product.bundleDiscountPct || 10;
  const bundleSavings = Math.round((bundleRawTotal * bundleDiscountPct) / 100);
  const bundleFinalTotal = bundleRawTotal - bundleSavings;

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedVariants);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor, selectedVariants);
    navigateToCheckout();
  };

  const handleToggleCompare = () => {
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddBundle = () => {
    addBundleToCart(bundleAll, bundleDiscountPct);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ZEN TACH Bangladesh`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product URL copied to clipboard!', 'info');
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap pb-2 border-b border-neutral-200">
        <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <button onClick={navigateToShop} className="hover:text-neutral-900 cursor-pointer">
          Shop
        </button>
        {categoryObj && (
          <>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <button
              onClick={() => navigateToCategory(categoryObj.id)}
              className="hover:text-neutral-900 cursor-pointer"
            >
              {categoryObj.name}
            </button>
          </>
        )}
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="font-bold text-neutral-900 truncate max-w-xs">{product.name}</span>
      </div>

      {/* 2. Product Showcase Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xs">
        {/* Left Column: Multi-Image Gallery & Assurance (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-200 relative shadow-xs flex items-center justify-center">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E53935]" />
                {product.badge}
              </span>
            )}
            {product.discountPrice && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-[#E53935] text-white text-xs font-black uppercase tracking-wider shadow-sm">
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
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
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

          {/* Highlights Mini Card */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
                Key Product Highlights
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-700">
                {product.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assurance Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs text-neutral-700">
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#E53935] shrink-0" />
              <div>
                <span className="font-bold block text-neutral-900">Official Warranty</span>
                <span className="text-[11px] text-neutral-500">{product.warranty}</span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#E53935] shrink-0" />
              <div>
                <span className="font-bold block text-neutral-900">Cash on Delivery</span>
                <span className="text-[11px] text-neutral-500">Unbox & inspect before payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Prices, Selectors, Buy & Delivery Calculator (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Header: Brand & Action icons */}
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="uppercase tracking-wider font-black text-[#E53935] text-sm">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">SKU: {product.sku}</span>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400">({product.reviewCount} customer reviews)</span>
              </div>

              {isOutOfStock ? (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="mt-5 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-neutral-900">
                ৳{currentPrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-base sm:text-lg text-neutral-400 line-through">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-neutral-500 ml-auto font-medium">
                Official Bangladesh Retail Price (VAT Incl.)
              </span>
            </div>

            {/* Short Description */}
            <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Select Color: <span className="text-neutral-500 font-normal">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
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

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-5 space-y-4">
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
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            selectedVariants[variant.name] === opt
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
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
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 rounded-xl bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-200 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Buy Now</span>
              </button>
            </div>

            {/* Secondary Actions: Wishlist, Compare & Hotline */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="flex items-center gap-1.5 font-semibold text-neutral-600 hover:text-[#E53935] cursor-pointer transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#E53935] text-[#E53935]' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={handleToggleCompare}
                  className="flex items-center gap-1.5 font-semibold text-neutral-600 hover:text-[#E53935] cursor-pointer transition-colors"
                >
                  <Scale className={`w-4 h-4 ${isCompared ? 'text-[#E53935]' : ''}`} />
                  <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
                </button>
              </div>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 text-neutral-600 hover:text-[#E53935] font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#E53935]" />
                <span>Hotline: {settings.phone}</span>
              </a>
            </div>

            {/* 3. Interactive Delivery Calculator */}
            <div className="mt-6 p-4.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
                  Check Delivery Time & Cost in Bangladesh
                </span>
                <span className="text-[11px] font-semibold text-neutral-500">
                  Select your district
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#E53935]"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.zone})
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  <span className="text-neutral-500">Delivery Fee:</span>
                  <span className="font-black text-neutral-900">
                    {isDeliveryFree ? (
                      <span className="text-emerald-600 font-bold">FREE Delivery</span>
                    ) : (
                      `৳${calculatedFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1 border-t border-neutral-200">
                <Clock className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                <span>
                  Estimated Arrival:{' '}
                  <strong className="text-neutral-900">{districtInfo.time}</strong> via Express Courier.
                </span>
              </div>
            </div>

            {/* Accepted Payments & Safe Checkout Guarantee */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
              <AcceptedPaymentGrid variant="light" showTitle={true} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Frequently Bought Together Bundle Deals Widget */}
      {bundleProducts.length > 0 && (
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#E53935] text-white text-[10px] font-black uppercase tracking-wider">
                Special Combo Savings
              </span>
              <h3 className="text-xl sm:text-2xl font-black">Frequently Bought Together</h3>
              <p className="text-xs text-neutral-300 max-w-xl">
                Pair your {product.name} with authentic accessories and save an extra {bundleDiscountPct}% on the complete setup.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15">
              <div>
                <span className="text-[11px] text-neutral-300 block">Bundle Price (Save ৳{bundleSavings.toLocaleString()})</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">৳{bundleFinalTotal.toLocaleString()}</span>
                  <span className="text-xs text-neutral-400 line-through">৳{bundleRawTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleAddBundle}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#E53935] hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Bundle to Cart</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
            {bundleAll.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center gap-3 bg-neutral-900/60 p-2.5 rounded-xl border border-white/10">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-white max-w-[140px] truncate">{item.name}</p>
                    <p className="text-[#E53935] font-black">
                      ৳{(item.discountPrice || item.regularPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
                {idx < bundleAll.length - 1 && (
                  <span className="text-lg font-black text-neutral-400">+</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* 4. Deep Specifications, In The Box, Warranty & FAQ Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xs space-y-6">
        <div className="flex items-center gap-4 sm:gap-8 border-b border-neutral-200 pb-3 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'specs'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            In The Box
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'warranty'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            BD Warranty & Centers
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faqs'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Product FAQs
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Customer Reviews ({product.reviewCount})
          </button>
        </div>

        {/* Tab 1: Specs */}
        {activeTab === 'specs' && (
          <div className="max-w-4xl space-y-4">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 divide-y divide-neutral-100 text-xs sm:text-sm">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-white even:bg-neutral-50">
                  <span className="font-bold text-neutral-800">{key}</span>
                  <span className="sm:col-span-2 text-neutral-600 mt-1 sm:mt-0">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400">
              * Specifications are sourced directly from the manufacturer’s official documentation and verified by ZEN TACH QA lab.
            </p>
          </div>
        )}

        {/* Tab 2: In The Box */}
        {activeTab === 'inbox' && (
          <div className="max-w-3xl space-y-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-sm mb-1">Authentic Packaging Contents</h4>
              <p className="text-xs text-neutral-500">
                Every unit sold at ZEN TACH is 100% factory sealed with official holographic brand seals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(product.inTheBox && product.inTheBox.length > 0
                ? product.inTheBox
                : [
                    `${product.name} Device`,
                    'Original Factory Charging / Data Cable',
                    'User Documentation & Quick Start Guide',
                    'Official Warranty Card'
                  ]
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: BD Warranty & Service Centers */}
        {activeTab === 'warranty' && (
          <div className="max-w-4xl space-y-6">
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900">
                  Warranty Coverage: {product.warranty}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  {product.warrantyDetails?.type || 'Official Brand'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {product.warrantyDetails?.coverage ||
                  'Covers all internal manufacturing hardware faults and defects. Free servicing and genuine part replacement during the warranty period.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E53935]" />
                Authorized Bangladesh Service Centers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(product.warrantyDetails?.centers || [
                  'Bashundhara City Level 5, Panthapath, Dhaka',
                  'Jamuna Future Park Level 4 (Shop #4C-021), Kuril, Dhaka',
                  'Multiplan Center Level 4, Elephant Road, Dhaka',
                  'Agrabad Commercial Area, Center Point, Chattogram'
                ]).map((loc, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex items-start gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-black">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{loc}</p>
                      <span className="text-[11px] text-neutral-500">
                        Open Saturday – Thursday, 10:00 AM – 8:00 PM
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Product FAQs */}
        {activeTab === 'faqs' && (
          <div className="max-w-3xl space-y-3">
            {(product.faqs && product.faqs.length > 0
              ? product.faqs
              : [
                  {
                    question: 'Is this unit brand new, authentic, and factory sealed?',
                    answer: 'Yes! ZEN TACH only sells 100% authentic, brand-new products with original manufacturer packaging and official serial verification.'
                  },
                  {
                    question: 'Can I inspect the parcel before paying Cash on Delivery?',
                    answer: 'Yes, our delivery partners allow open-box outer inspection to verify seal integrity before handing over payment.'
                  },
                  {
                    question: 'What happens if there is an issue during the first 7 days?',
                    answer: 'We provide a 7-day instant replacement guarantee for any manufacturing defects.'
                  }
                ]
            ).map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-50"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-neutral-900 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openFaqIndex === idx ? 'rotate-180 text-[#E53935]' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 border-t border-neutral-200/60 pt-3 bg-white leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl space-y-6">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600">
              <p className="font-bold text-neutral-900 text-sm">Verified Product Feedback</p>
              <p className="text-xs text-neutral-500 mt-1">
                All ratings are verified purchases from genuine gadget buyers across Bangladesh.
              </p>
            </div>

            {/* Submit Review */}
            <form onSubmit={handleSubmitReview} className="space-y-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-xs uppercase text-neutral-900 tracking-wider">
                Write a Customer Review
              </h4>

              <div className="flex items-center gap-3">
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
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Share detailed performance notes, battery life, sound quality, build, etc..."
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-[#E53935] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {submittingReview ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating Compare Notification Bar if items exist */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#E53935]" />
            <div className="text-xs">
              <span className="font-bold">{compareList.length} Products in Compare</span>
              <p className="text-[11px] text-neutral-400">Side-by-side spec comparison</p>
            </div>
          </div>
          <button
            onClick={navigateToCompare}
            className="px-4 py-2 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-black text-neutral-900">
            Related Products in {product.categoryName || 'This Category'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={() => navigateToProduct(rel.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
