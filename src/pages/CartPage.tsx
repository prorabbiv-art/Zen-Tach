import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
  Tag,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AcceptedPaymentGrid } from '../components/PaymentLogos';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    settings
  } = useStore();

  const { navigateToHome, navigateToShop, navigateToCheckout, navigateToProduct } = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const amountForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeDeliveryThreshold) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">Shopping Cart</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Your Shopping Cart
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review and manage your selected tech gadgets ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </p>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-neutral-200 max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Looks like you haven't added any tech items to your cart yet. Explore our genuine collection of smartphones, laptops, earbuds, and gaming gear.
          </p>
          <button
            onClick={navigateToShop}
            className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-neutral-800">
                  <Sparkles className="w-4 h-4 text-[#E53935]" />
                  {amountForFreeDelivery === 0 ? (
                    <span className="text-emerald-600 font-bold">
                      You qualify for FREE Delivery across Bangladesh!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-neutral-900">৳{amountForFreeDelivery.toLocaleString()}</strong> more for FREE delivery
                    </span>
                  )}
                </span>
                <span className="text-neutral-500">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E53935] transition-all duration-500 rounded-full"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Table Container */}
            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div
                    onClick={() => navigateToProduct(item.productId)}
                    className="flex items-center gap-4 cursor-pointer min-w-0"
                  >
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        {item.product.brand}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-neutral-900 hover:text-[#E53935] transition-colors truncate max-w-xs sm:max-w-md">
                        {item.product.name}
                      </h3>

                      {/* Selected options tags */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.selectedColor && (
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedVariant &&
                          Object.entries(item.selectedVariant).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium"
                            >
                              {v}
                            </span>
                          ))}
                      </div>

                      <div className="text-xs text-neutral-500 mt-1">
                        Unit: ৳{item.unitPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-neutral-900 min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total & Delete */}
                    <span className="text-base font-black text-neutral-950 min-w-[90px] text-right">
                      ৳{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={navigateToShop}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Order Summary
              </h3>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-৳
                      {couponDiscount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-red-600 font-bold underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. ZEN10)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        className="w-full pl-8 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs uppercase font-semibold text-neutral-900 focus:outline-none focus:border-[#E53935]"
                      />
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              )}

              {/* Financial Breakdown */}
              <div className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Voucher</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500">
                  <span>Shipping Fee</span>
                  <span>Calculated at checkout (৳60 / ৳120)</span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg font-black text-neutral-950">
                  <span>Estimated Total</span>
                  <span className="text-[#E53935]">
                    ৳{(cartSubtotal - couponDiscount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={navigateToCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-[#E53935] hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery &amp; doorstep verification available</span>
              </div>

              {/* Real Accepted Payment Logos */}
              <div className="pt-2 border-t border-neutral-100">
                <AcceptedPaymentGrid variant="light" showTitle={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
