import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import {
  Scale,
  Trash2,
  ShoppingCart,
  ChevronRight,
  Star,
  Check,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, addToCart, products } = useStore();
  const { navigateToHome, navigateToShop, navigateToProduct } = useRouter();

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-neutral-100 rounded-3xl mx-auto flex items-center justify-center text-neutral-400">
          <Scale className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-neutral-900">Your Comparison List is Empty</h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Select up to 4 gadgets from our catalog to compare specifications, battery life, camera setups, and warranties side-by-side.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={navigateToShop}
            className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested popular gadgets to compare */}
        <div className="mt-12 text-left bg-white p-6 rounded-3xl border border-neutral-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-4">
            Popular Comparison Suggestions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {products.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => navigateToProduct(p.id)}
                className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <img src={p.thumbnail} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="truncate">
                  <p className="text-xs font-bold text-neutral-900 truncate">{p.name}</p>
                  <p className="text-xs font-black text-[#E53935]">
                    ৳{(p.discountPrice || p.regularPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gather union of all specification keys across the compared products
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap((p) => Object.keys(p.specifications || {}))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 pb-2 border-b border-neutral-200">
        <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={navigateToShop} className="hover:text-neutral-900 cursor-pointer">
          Shop
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="font-bold text-neutral-900">Gadget Comparison</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-[#E53935]" />
            Side-by-Side Gadget Comparison
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Comparing {compareList.length} of 4 maximum selected products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length < 4 && (
            <button
              onClick={navigateToShop}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-xs font-bold text-neutral-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Product</span>
            </button>
          )}

          <button
            onClick={clearCompare}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-neutral-600 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-neutral-200 divide-x divide-neutral-200">
              <th className="p-4 sm:p-6 w-48 bg-neutral-50 text-xs font-bold uppercase text-neutral-500 tracking-wider align-top">
                Product Details
              </th>
              {compareList.map((product) => (
                <th key={product.id} className="p-4 sm:p-6 w-64 align-top">
                  <div className="relative group space-y-3">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-neutral-100 hover:bg-red-500 hover:text-white rounded-full text-neutral-400 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div
                      onClick={() => navigateToProduct(product.id)}
                      className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200 cursor-pointer"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#E53935]">
                        {product.brand}
                      </span>
                      <h4
                        onClick={() => navigateToProduct(product.id)}
                        className="text-xs sm:text-sm font-bold text-neutral-900 cursor-pointer hover:text-[#E53935] line-clamp-2"
                      >
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-neutral-900">
                        ৳{(product.discountPrice || product.regularPrice).toLocaleString()}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          ৳{product.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock <= 0}
                      className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-[#E53935] disabled:bg-neutral-200 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 text-xs text-neutral-800">
            {/* Stock status */}
            <tr className="divide-x divide-neutral-200 bg-neutral-50/50">
              <td className="p-4 font-bold text-neutral-700">Availability</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4">
                  {p.stock > 0 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> In Stock ({p.stock})
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Ratings */}
            <tr className="divide-x divide-neutral-200">
              <td className="p-4 font-bold text-neutral-700">Customer Rating</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4">
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.rating.toFixed(1)}</span>
                    <span className="text-neutral-400 font-normal">({p.reviewCount} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr className="divide-x divide-neutral-200 bg-neutral-50/50">
              <td className="p-4 font-bold text-neutral-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#E53935]" />
                Warranty
              </td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4">
                  <span className="font-semibold text-neutral-900">{p.warranty}</span>
                </td>
              ))}
            </tr>

            {/* In The Box */}
            <tr className="divide-x divide-neutral-200">
              <td className="p-4 font-bold text-neutral-700 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#E53935]" />
                In The Box
              </td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4">
                  {p.inTheBox && p.inTheBox.length > 0 ? (
                    <ul className="space-y-1 text-[11px] text-neutral-600">
                      {p.inTheBox.map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-neutral-400">Standard packaging</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Key Specifications Rows */}
            {allSpecKeys.map((key) => (
              <tr key={key} className="divide-x divide-neutral-200 even:bg-neutral-50/40">
                <td className="p-4 font-bold text-neutral-800">{key}</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-neutral-600">
                    {p.specifications[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
