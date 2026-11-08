import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Order, PaymentMethod, OrderItem } from '../types';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowRight,
  ChevronRight,
  PackageCheck,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';
import { BKashLogo, NagadLogo, VisaLogo, MastercardLogo, CodLogo } from '../components/PaymentLogos';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    couponDiscount,
    appliedCoupon,
    calculateDeliveryFee,
    placeOrder,
    showToast
  } = useStore();

  const { currentUser, userProfile } = useAuth();
  const { navigateToHome, navigateToShop, navigateToTracking } = useRouter();

  const [fullName, setFullName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [district, setDistrict] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [cityOrArea, setCityOrArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const deliveryFee = calculateDeliveryFee(district, cartSubtotal);
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee);

  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    return /^01[3-9]\d{8}$/.test(cleaned);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    if (!validatePhone(phone)) {
      showToast('Please enter a valid 11-digit Bangladesh phone number (e.g. 01705285855).', 'error');
      return;
    }

    if (!cityOrArea.trim()) {
      showToast('Please specify your city or neighborhood area.', 'error');
      return;
    }

    if (!fullAddress.trim()) {
      showToast('Please provide your complete street address.', 'error');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      showToast(`Please enter the ${paymentMethod.toUpperCase()} Transaction ID (TrxID).`, 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        brand: item.product.brand,
        thumbnail: item.product.thumbnail || item.product.images[0],
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        selectedColor: item.selectedColor,
        selectedVariant: item.selectedVariant
      }));

      const newOrder = await placeOrder({
        userId: currentUser?.uid || null,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          district,
          cityOrArea: cityOrArea.trim(),
          fullAddress: fullAddress.trim()
        },
        deliveryNotes: deliveryNotes.trim() || undefined,
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending',
        status: 'pending',
        transactionId: transactionId.trim() || undefined
      });

      setCompletedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error placing order:', err);
      showToast('Failed to complete order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'info');
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <PackageCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-neutral-900">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
              Your order is recorded in the ZEN TACH system. Our customer support team will call you at{' '}
              <strong>{completedOrder.customerPhone}</strong> to confirm dispatch.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
              <span className="text-neutral-500 font-medium">Order Reference:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-neutral-900 text-sm">
                  {completedOrder.id}
                </span>
                <button
                  onClick={() => copyToClipboard(completedOrder.id)}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  title="Copy Order ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Total Payable:</span>
              <span className="font-black text-neutral-900 text-sm">
                ৳{completedOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Payment Method:</span>
              <span className="font-bold uppercase text-neutral-800">
                {completedOrder.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : completedOrder.paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Delivery Region:</span>
              <span className="text-neutral-800 font-medium">
                {completedOrder.shippingAddress.district} ({completedOrder.shippingAddress.cityOrArea})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setShowInvoice(true)}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#E53935]" />
              <span>View Tax Invoice</span>
            </button>

            <button
              onClick={() => navigateToTracking(completedOrder.id)}
              className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer"
            >
              <span>Track Live Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={navigateToHome}
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        </div>

        {showInvoice && (
          <InvoiceModal order={completedOrder} onClose={() => setShowInvoice(false)} />
        )}
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Your Cart is Empty</h2>
        <p className="text-xs text-neutral-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={navigateToShop}
          className="px-6 py-2.5 bg-[#E53935] text-white rounded-xl text-xs font-bold"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={navigateToShop} className="hover:text-neutral-900 cursor-pointer">
            Cart
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">Checkout</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Express Checkout
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fast dispatch across Bangladesh with Cash on Delivery and online verification
            </p>
          </div>
        </div>
      </div>

      {/* Main Checkout Form */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer & Delivery Details + Payment Method (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer & Address Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E53935] text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Customer & Shipping Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Phone Number (BD Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={15}
                  placeholder="01705285855"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-neutral-800 mb-1">
                  Email Address (Optional, for digital receipt)
                </label>
                <input
                  type="email"
                  maxLength={100}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Delivery Region *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as 'Inside Dhaka' | 'Outside Dhaka')}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-bold focus:outline-none focus:border-[#E53935] focus:bg-white cursor-pointer"
                >
                  <option value="Inside Dhaka">Inside Dhaka City (৳60)</option>
                  <option value="Outside Dhaka">Outside Dhaka / Whole Bangladesh (৳120)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  City / Area / Thana *
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Dhanmondi, Gulshan, Agrabad"
                  value={cityOrArea}
                  onChange={(e) => setCityOrArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-neutral-800 mb-1">
                  Complete Street Address (House, Road, Apartment) *
                </label>
                <textarea
                  rows={2}
                  required
                  maxLength={300}
                  placeholder="House #12, Road #4, Sector #3..."
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-neutral-800 mb-1">
                  Delivery Notes / Gate Code (Optional)
                </label>
                <input
                  type="text"
                  maxLength={200}
                  placeholder="e.g. Call before delivery, deliver after 2 PM"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E53935] text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {/* Cash on Delivery */}
              <label
                className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#E53935] bg-red-50/50 shadow-sm ring-1 ring-[#E53935]/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#E53935] focus:ring-[#E53935]"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-black text-neutral-900">
                      Cash on Delivery
                    </span>
                    <CodLogo className="scale-90 origin-right" />
                  </div>
                  <span className="block text-[11px] text-neutral-500 leading-tight">
                    Pay in cash when you inspect the gadget at your doorstep
                  </span>
                </div>
              </label>

              {/* bKash */}
              <label
                className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'bkash'
                    ? 'border-[#E2136E] bg-pink-50/50 shadow-sm ring-1 ring-pink-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="mt-1 text-pink-600 focus:ring-pink-600"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-black text-neutral-900">
                      bKash Merchant
                    </span>
                    <BKashLogo size="sm" />
                  </div>
                  <span className="block text-[11px] text-neutral-500 leading-tight">
                    Send money to 01705285855 &amp; verify with TrxID
                  </span>
                </div>
              </label>

              {/* Nagad */}
              <label
                className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'nagad'
                    ? 'border-[#ED1C24] bg-orange-50/50 shadow-sm ring-1 ring-orange-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="mt-1 text-orange-600 focus:ring-orange-600"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-black text-neutral-900">
                      Nagad Payment
                    </span>
                    <NagadLogo size="sm" />
                  </div>
                  <span className="block text-[11px] text-neutral-500 leading-tight">
                    Send payment to 01705285855 &amp; verify with TrxID
                  </span>
                </div>
              </label>

              {/* SSLCommerz Cards */}
              <label
                className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'sslcommerz'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'sslcommerz'}
                  onChange={() => setPaymentMethod('sslcommerz')}
                  className="mt-1 text-blue-600 focus:ring-blue-600"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-black text-neutral-900">
                      Cards &amp; Online Banking
                    </span>
                    <div className="flex items-center gap-1">
                      <VisaLogo />
                      <MastercardLogo />
                    </div>
                  </div>
                  <span className="block text-[11px] text-neutral-500 leading-tight">
                    Visa, Mastercard, AMEX &amp; Internet Banking via SSLCommerz
                  </span>
                </div>
              </label>
            </div>

            {/* TrxID input for bKash or Nagad */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-2 animate-in fade-in text-xs">
                <p className="font-bold text-neutral-900">
                  Payment Instructions for {paymentMethod.toUpperCase()}:
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  1. Open your {paymentMethod.toUpperCase()} app and select <strong>Send Money</strong> or <strong>Payment</strong>.<br />
                  2. Enter official merchant phone: <strong>01705285855</strong>.<br />
                  3. Total Amount: <strong>৳{finalTotal.toLocaleString()}</strong>.<br />
                  4. Enter your Transaction ID (TrxID) below:
                </p>
                <input
                  type="text"
                  required
                  maxLength={40}
                  placeholder="e.g. BL90X92K01"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold text-neutral-900 uppercase"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Placement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
              Review & Complete Order
            </h2>

            {/* Items summary */}
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 border-y border-neutral-100 py-2">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900 shrink-0">
                    ৳{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({district})</span>
                <span className="font-bold text-neutral-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 uppercase font-black">Free</span>
                  ) : (
                    `৳${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg font-black text-neutral-950">
                <span>Total Payable</span>
                <span className="text-[#E53935] text-xl">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ZEN TACH Buyer Protection</span>
              </div>
              <p>7-Day replacement warranty against any manufacturing defects.</p>
            </div>

            {/* Order Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-300 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-900/20 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Recording Order...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Confirm & Place Order (৳{finalTotal.toLocaleString()})
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
