import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Order, PaymentMethod, OrderItem } from '../types';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { BKashLogo, NagadLogo, VisaLogo, MastercardLogo, CodLogo } from './PaymentLogos';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrderTracking: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onViewOrderTracking
}) => {
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

  // Form Fields
  const [fullName, setFullName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [district, setDistrict] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [cityOrArea, setCityOrArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');

  // Processing state & Completed Order
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const deliveryFee = calculateDeliveryFee(district, cartSubtotal);
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee);

  const validatePhone = (num: string) => {
    // Bangladesh mobile number pattern: starts with 01, followed by 9 digits
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#E53935]" />
            <h2 className="text-base sm:text-lg font-black text-neutral-900">
              {completedOrder ? 'Order Confirmed!' : 'Express Checkout & Delivery'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State A: Order Completed Successfully */}
        {completedOrder ? (
          <div className="p-6 sm:p-10 text-center space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <PackageCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                Order Received
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">
                Thank You for Your Order!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Your order has been recorded in the ZEN TACH system. Our customer support will call you at{' '}
                <strong>{completedOrder.customerPhone}</strong> to confirm dispatch.
              </p>
            </div>

            {/* Order Card info */}
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
                <span className="text-neutral-500">Delivery Area:</span>
                <span className="text-neutral-800 font-medium">
                  {completedOrder.shippingAddress.district} ({completedOrder.shippingAddress.cityOrArea})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  onClose();
                  onViewOrderTracking(completedOrder.id);
                }}
                className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer"
              >
                <span>Track This Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          /* State B: Checkout Form */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
            {/* Left: Customer Info & Payment (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-neutral-200">
              {/* 1. Customer Information */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                  <span>1. Customer & Shipping Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Phone Number (BD Mobile) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01705285855"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Email Address (Optional, for invoices)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                    />
                  </div>

                  {/* District selector for delivery fee */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Delivery Region *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value as 'Inside Dhaka' | 'Outside Dhaka')}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white font-medium"
                    >
                      <option value="Inside Dhaka">Inside Dhaka City (৳60)</option>
                      <option value="Outside Dhaka">Outside Dhaka / Whole Bangladesh (৳120)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      City / Area / Thana *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhanmondi / Agrabad"
                      value={cityOrArea}
                      onChange={(e) => setCityOrArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Complete Street Address (House, Road, Block) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House #12, Road #4, Sector #3..."
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Delivery Notes / Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Call before delivery, deliver after 3 PM"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Selection */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-4">
                  2. Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#E53935] bg-red-50/50 shadow-xs'
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
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-bold text-neutral-900">
                          Cash on Delivery
                        </span>
                        <CodLogo className="scale-85 origin-right" />
                      </div>
                      <span className="block text-[11px] text-neutral-500">
                        Pay in cash when you inspect gadget at doorstep
                      </span>
                    </div>
                  </label>

                  {/* bKash */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-[#E2136E] bg-pink-50/50 shadow-xs'
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
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-bold text-neutral-900">
                          bKash Merchant
                        </span>
                        <BKashLogo size="sm" />
                      </div>
                      <span className="block text-[11px] text-neutral-500">
                        Send to 01705285855 &amp; provide TrxID
                      </span>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-[#ED1C24] bg-orange-50/50 shadow-xs'
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
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-bold text-neutral-900">
                          Nagad Payment
                        </span>
                        <NagadLogo size="sm" />
                      </div>
                      <span className="block text-[11px] text-neutral-500">
                        Send to 01705285855 &amp; provide TrxID
                      </span>
                    </div>
                  </label>

                  {/* SSLCommerz */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'sslcommerz'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
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
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-bold text-neutral-900">
                          Cards &amp; Online Banking
                        </span>
                        <div className="flex items-center gap-1">
                          <VisaLogo />
                          <MastercardLogo />
                        </div>
                      </div>
                      <span className="block text-[11px] text-neutral-500">
                        Visa, Mastercard, AMEX &amp; Internet Banking
                      </span>
                    </div>
                  </label>
                </div>

                {/* TrxID input for bKash or Nagad */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-2 animate-in fade-in">
                    <p className="text-xs font-bold text-neutral-800">
                      Payment Instructions for {paymentMethod.toUpperCase()}:
                    </p>
                    <p className="text-xs text-neutral-600">
                      1. Open your {paymentMethod.toUpperCase()} app and choose <strong>Send Money</strong> or <strong>Payment</strong>.<br />
                      2. Enter official merchant number: <strong>01705285855</strong>.<br />
                      3. Amount: <strong>৳{finalTotal.toLocaleString()}</strong>.<br />
                      4. Copy and paste your Transaction ID (TrxID) below:
                    </p>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BL90X92K01"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-bold text-neutral-900 uppercase"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-50 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                </h3>

                {/* Items snapshot list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-neutral-200 border-y border-neutral-200 py-2">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.thumbnail || item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-neutral-200"
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

                {/* Subtotals & Fees */}
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">৳{cartSubtotal.toLocaleString()}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Coupon ({appliedCoupon?.code})</span>
                      <span>-৳{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery ({district})</span>
                    <span className="font-bold text-neutral-900">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 uppercase font-black">Free</span>
                      ) : (
                        `৳${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-black text-neutral-950">
                    <span>Total Amount</span>
                    <span className="text-[#E53935] text-xl">
                      ৳{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-[11px] text-neutral-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safe & Reliable Shopping Guarantee</span>
                  </div>
                  <p>Check gadget in front of delivery officer for 100% peace of mind.</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 px-6 rounded-2xl bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-300 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-900/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Securing Order...
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
        )}
      </div>
    </div>
  );
};
