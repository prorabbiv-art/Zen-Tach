import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Keyboard,
  Tv,
  BatteryCharging,
  Gamepad2,
  ArrowRight
} from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const { categories, products, language } = useStore();

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Watch':
        return <Watch className="w-5 h-5" />;
      case 'Keyboard':
        return <Keyboard className="w-5 h-5" />;
      case 'Tv':
        return <Tv className="w-5 h-5" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5" />;
      case 'Gamepad2':
      default:
        return <Gamepad2 className="w-5 h-5" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {language === 'bn' ? 'জনপ্রিয় গ্যাজেট ক্যাটাগরি' : 'Featured Gadget Categories'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Browse our verified inventory by technology department
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 hover:border-[#E53935] hover:shadow-lg transition-all p-4 text-left flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-red-50 text-neutral-700 group-hover:text-[#E53935] flex items-center justify-center transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-neutral-600">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#E53935] transition-colors leading-snug">
                  {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                </h3>
                <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 flex items-center text-xs font-semibold text-neutral-400 group-hover:text-[#E53935] transition-colors gap-1">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
