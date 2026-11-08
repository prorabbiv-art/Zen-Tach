import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Keyboard,
  Tv,
  BatteryCharging,
  Gamepad2,
  ArrowRight,
  ChevronRight,
  Layers
} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products, language } = useStore();
  const { navigateToHome, navigateToCategory } = useRouter();

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Watch':
        return <Watch className="w-6 h-6" />;
      case 'Keyboard':
        return <Keyboard className="w-6 h-6" />;
      case 'Tv':
        return <Tv className="w-6 h-6" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-6 h-6" />;
      default:
        return <Gamepad2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">All Categories</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Browse by Department
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Explore authentic tech products curated across {categories.length} technology classifications
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryProducts = products.filter((p) => p.categoryId === cat.id);
          const count = categoryProducts.length;

          return (
            <div
              key={cat.id}
              onClick={() => navigateToCategory(cat.id)}
              className="group bg-white rounded-3xl border border-neutral-200 hover:border-[#E53935] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white leading-tight">
                        {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                      </h3>
                      <span className="text-[11px] text-neutral-300">
                        {count} {count === 1 ? 'gadget' : 'gadgets'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-bold text-[#E53935]">
                  <span>Explore Department</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
