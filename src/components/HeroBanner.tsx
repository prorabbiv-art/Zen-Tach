import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onNavigateShop: () => void;
  onNavigateCategory: (categoryId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigateShop,
  onNavigateCategory
}) => {
  const { banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[currentSlide] || activeBanners[0];

  const handleCta = () => {
    if (banner.ctaLink.startsWith('cat-')) {
      onNavigateCategory(banner.ctaLink);
    } else if (banner.ctaLink === 'smartphones') {
      onNavigateCategory('cat-smartphones');
    } else if (banner.ctaLink === 'laptops') {
      onNavigateCategory('cat-laptops');
    } else if (banner.ctaLink === 'earbuds') {
      onNavigateCategory('cat-earbuds');
    } else {
      onNavigateShop();
    }
  };

  return (
    <div className="relative overflow-hidden bg-neutral-950 text-white rounded-3xl mx-4 sm:mx-6 my-4 shadow-xl border border-neutral-800">
      <div className="relative min-h-[420px] md:min-h-[500px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover object-center brightness-60 transition-all duration-700 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-12 space-y-6">
          {banner.tag && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-[#E53935] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
              <span>{banner.tag}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
            {banner.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
            {banner.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleCta}
              className="px-6 py-3.5 bg-[#E53935] hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <span>{banner.ctaText || 'Shop Collection'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateShop}
              className="px-6 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold rounded-xl border border-neutral-700 backdrop-blur-md transition-all text-sm cursor-pointer"
            >
              Explore All Gadgets
            </button>
          </div>
        </div>

        {/* Slide Controls */}
        {activeBanners.length > 1 && (
          <div className="absolute right-6 bottom-6 z-20 flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide ? 'w-8 bg-[#E53935]' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
              }
              className="w-10 h-10 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
              className="w-10 h-10 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
