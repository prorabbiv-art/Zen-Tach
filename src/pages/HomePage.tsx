import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { HeroBanner } from '../components/HeroBanner';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Zap,
  Sparkles,
  ChevronRight,
  Mail,
  Send,
  Clock,
  ArrowRight,
  Layers
} from 'lucide-react';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct }) => {
  const { products, language, showToast } = useStore();
  const { navigateToShop, navigateToCategory, navigateToProduct } = useRouter();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Flash Deal Countdown for ZEN10
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Full product collections
  const trendingProducts = products.filter((p) => p.bestSeller || p.featured);
  const discountedProducts = products.filter((p) => p.discountPrice);
  const newArrivals = products.filter((p) => p.newArrival);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Subscribed! You will receive exclusive tech deals in your inbox.', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 0. Live Animated Promotional Ticker */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white border-y border-neutral-800/80 py-2.5 overflow-hidden shadow-inner">
        <div className="flex items-center gap-8 text-xs font-semibold whitespace-nowrap animate-pulse px-4 max-w-7xl mx-auto justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[#E53935] font-black uppercase tracking-wider">Flash Promo:</span>
            <span className="text-neutral-200">Use code <strong className="text-white underline">ZEN10</strong> for extra 10% off on all orders above ৳5,000</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-neutral-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Truck className="w-3.5 h-3.5 text-[#E53935]" />
              Same-day courier inside Dhaka
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Original Brand Serial Verification
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              7-Day Doorstep Replacement Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* 1. Hero Promotional Banner Carousel */}
      <HeroBanner
        onNavigateShop={navigateToShop}
        onNavigateCategory={navigateToCategory}
      />

      {/* 2. Value Proposition Pillars (Animated Hover Cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#E53935] transition-colors">100% Genuine Tech</h4>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">Official serial verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#E53935] transition-colors">Cash on Delivery</h4>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">Inspect parcel at doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#E53935] transition-colors">7-Day Replacement</h4>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#E53935] transition-colors">01705285855 Hotline</h4>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">Daily 10 AM – 10 PM BD time</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Featured Categories Directory */}
      <FeaturedCategories onSelectCategory={navigateToCategory} />

      {/* 4. Section 1: Trending & Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E53935] text-[11px] font-black uppercase tracking-wider mb-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Top Rated Tech</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {language === 'bn' ? 'জনপ্রিয় ও বেস্টসেলার গ্যাজেট' : 'Trending & Best Sellers'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Top trending devices chosen by tech enthusiasts across Bangladesh
            </p>
          </div>
          <button
            onClick={navigateToShop}
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.slice(0, 8).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={() => navigateToProduct(prod.id)}
              onQuickView={() => onSelectProduct(prod)}
            />
          ))}
        </div>
      </section>

      {/* 5. Special Promotional Voucher Callout with Live Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/40 text-[#E53935] text-xs font-black uppercase tracking-wider rounded-full backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Limited Time Flash Voucher</span>
            </div>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
              Upgrade to Premium Tech with Code <span className="text-[#E53935] underline decoration-wavy decoration-red-500/40">ZEN10</span>
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Enjoy an instant <strong>10% discount</strong> on high-end laptops, ANC earbuds, smartwatches, and accessories across Bangladesh. Applies automatically on checkout.
            </p>

            {/* Countdown Display */}
            <div className="flex items-center gap-3 pt-2">
              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl px-3.5 py-2 text-center min-w-[64px]">
                <span className="block text-xl sm:text-2xl font-black text-white font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Hours</span>
              </div>

              <span className="text-xl font-bold text-neutral-500">:</span>

              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl px-3.5 py-2 text-center min-w-[64px]">
                <span className="block text-xl sm:text-2xl font-black text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Mins</span>
              </div>

              <span className="text-xl font-bold text-neutral-500">:</span>

              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl px-3.5 py-2 text-center min-w-[64px] border-red-500/40 bg-red-950/20">
                <span className="block text-xl sm:text-2xl font-black text-[#E53935] font-mono animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Secs</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={navigateToShop}
                className="px-6 py-3.5 bg-[#E53935] hover:bg-red-600 text-white font-black rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-red-900/40 cursor-pointer inline-flex items-center gap-2 hover:-translate-y-0.5 active:scale-97"
              >
                <span>Claim Voucher &amp; Shop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-video md:aspect-square rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
              alt="Hi-Fi Audio Promotion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <span className="text-xs text-white/90 font-bold">Audiophile Grade Sound</span>
                <p className="text-[11px] text-neutral-300">Active Noise Cancelling &amp; Hi-Res Wireless</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 2: Special Offers & Flash Discounts */}
      {discountedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E53935] text-[11px] font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Price Drops &amp; Savings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {language === 'bn' ? 'বিশেষ ছাড় ও অফার' : 'Exclusive Deals & Price Drops'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Verified genuine products with limited-time direct discounts
              </p>
            </div>
            <button
              onClick={navigateToShop}
              className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All Deals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {discountedProducts.slice(0, 8).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={() => navigateToProduct(prod.id)}
                onQuickView={() => onSelectProduct(prod)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Section 3: Brand New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Latest Global Releases</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {language === 'bn' ? 'নতুন কালেকশন' : 'Brand New Arrivals'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                The freshest gadget releases straight from global launches
              </p>
            </div>
            <button
              onClick={navigateToShop}
              className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Newest</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 8).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={() => navigateToProduct(prod.id)}
                onQuickView={() => onSelectProduct(prod)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. Why Choose ZEN TACH? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-white via-neutral-50 to-white rounded-3xl p-8 sm:p-12 border border-neutral-200/80 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#E53935] font-black text-xs uppercase tracking-wider">
              The ZEN TACH Difference
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
              Why Bangladesh Chooses ZEN TACH
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              We eliminate counterfeit electronics and unreliable delivery with genuine brand-backed inventory and nationwide service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/30 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-black">
                1
              </div>
              <h4 className="font-bold text-neutral-900 text-base">Direct Official Sourcing</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                All smartphones, laptops, and wearables are imported through certified regional distributors, accompanied by serial numbers and warranty cards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/30 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-black">
                2
              </div>
              <h4 className="font-bold text-neutral-900 text-base">Nationwide Cash on Delivery</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Shop with complete peace of mind. We deliver inside Dhaka in 24–48 hours and across all 64 districts with full doorstep parcel verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-red-500/30 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-black">
                3
              </div>
              <h4 className="font-bold text-neutral-900 text-base">Dedicated Tech Support</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Have questions about specs or compatibility? Call our direct hotline at <strong>01705285855</strong> or chat with our experts 7 days a week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white p-8 sm:p-12 text-center max-w-3xl mx-auto border border-neutral-800 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-[#E53935] flex items-center justify-center mx-auto border border-red-500/30">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Join the ZEN TACH Tech Club
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Subscribe to receive early notifications on flagship pre-orders, flash discount coupons, and exclusive gadget drops.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700/80 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#E53935] transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
