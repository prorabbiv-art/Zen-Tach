import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { Order, OrderStatus } from '../types';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Phone,
  FileText
} from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';

interface OrderTrackingPageProps {
  initialOrderId?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ initialOrderId }) => {
  const { orders, cancelOrder, settings } = useStore();
  const { navigateToHome, navigateToShop } = useRouter();

  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setSearchQuery(initialOrderId);
      const found = orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase());
      if (found) {
        setSearchedOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.customerPhone.replace(/\s+/g, '') === clean.replace(/\s+/g, '')
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const stages: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Order Pending', icon: <Clock className="w-4 h-4" /> },
    { key: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'processing', label: 'Processing & Packaged', icon: <Package className="w-4 h-4" /> },
    { key: 'shipped', label: 'Shipped via Courier', icon: <Truck className="w-4 h-4" /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return -1;
    }
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : -1;
  const isCancelled = searchedOrder?.status === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">Live Order Tracking</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Track Your Gadget Shipment
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter your Order ID (e.g. ZT-...) or registered phone number to check status
            </p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Order ID (e.g. ZT-...) or Phone Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
            />
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-[#E53935] hover:bg-red-600 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            Track Order
          </button>
        </form>

        {/* Recent Orders Shortcuts */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-neutral-500 font-medium">Recent Orders:</span>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setSearchQuery(ord.id);
                  setSearchedOrder(ord);
                  setHasSearched(true);
                }}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-mono font-bold cursor-pointer transition-colors"
              >
                {ord.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result State */}
      {hasSearched && !searchedOrder && (
        <div className="p-10 text-center bg-white rounded-3xl border border-neutral-200 space-y-3 shadow-xs">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-bold text-neutral-900 text-base">Order Reference Not Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We couldn't locate an order matching "{searchQuery}". Please check the ID or contact our hotline directly.
          </p>
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Call Hotline: {settings.phone}</span>
          </a>
        </div>
      )}

      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xs space-y-8">
          {/* Order Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                Order Reference
              </span>
              <p className="font-mono text-lg font-black text-neutral-900">
                {searchedOrder.id}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()} at{' '}
                {new Date(searchedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  searchedOrder.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchedOrder.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {searchedOrder.status}
              </span>
              <span className="text-base font-black text-neutral-900">
                Total: ৳{searchedOrder.totalAmount.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-[#E53935] text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs mt-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          {isCancelled ? (
            <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-center text-xs text-red-800 font-semibold">
              This order was cancelled. Reserved items have been returned to warehouse stock.
            </div>
          ) : (
            <div className="py-6 px-2">
              <div className="relative flex items-center justify-between">
                {/* Connecting track line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 -z-0">
                  <div
                    className="h-full bg-[#E53935] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {stages.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#E53935] text-white shadow-md'
                            : 'bg-neutral-200 text-neutral-500'
                        } ${isCurrent ? 'ring-4 ring-red-100 scale-110' : ''}`}
                      >
                        {stage.icon}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 text-center max-w-[80px] leading-tight ${
                          isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details & Purchased Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Delivery details */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <span className="font-bold text-neutral-900 uppercase tracking-wider block text-xs">
                Shipping Address
              </span>
              <p className="font-semibold text-neutral-900">{searchedOrder.customerName}</p>
              <p className="text-neutral-600">Phone: {searchedOrder.customerPhone}</p>
              {searchedOrder.customerEmail && (
                <p className="text-neutral-600">Email: {searchedOrder.customerEmail}</p>
              )}
              <p className="text-neutral-700 mt-2 font-medium">
                {searchedOrder.shippingAddress.fullAddress}, {searchedOrder.shippingAddress.cityOrArea},{' '}
                {searchedOrder.shippingAddress.district}
              </p>
              {searchedOrder.deliveryNotes && (
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 text-[11px]">
                  Note: {searchedOrder.deliveryNotes}
                </p>
              )}
            </div>

            {/* Payment details */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <span className="font-bold text-neutral-900 uppercase tracking-wider block text-xs">
                Payment Breakdown
              </span>
              <p className="text-neutral-800">
                Method:{' '}
                <strong className="uppercase font-bold">
                  {searchedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : searchedOrder.paymentMethod}
                </strong>
              </p>
              <p className="text-neutral-800">
                Status:{' '}
                <span
                  className={`font-bold uppercase ${
                    searchedOrder.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {searchedOrder.paymentStatus}
                </span>
              </p>
              {searchedOrder.transactionId && (
                <p className="text-neutral-600 font-mono">
                  TrxID: {searchedOrder.transactionId}
                </p>
              )}
              <div className="pt-2 border-t border-neutral-200 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{searchedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>৳{searchedOrder.deliveryFee}</span>
                </div>
                {searchedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-৳{searchedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-neutral-900 text-sm pt-1">
                  <span>Total Payable:</span>
                  <span>৳{searchedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
              Items in this Shipment ({searchedOrder.items.length})
            </h3>
            <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-100 overflow-hidden">
              {searchedOrder.items.map((it, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.thumbnail}
                      alt={it.name}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-200"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 text-sm">{it.name}</p>
                      <p className="text-neutral-500">
                        Qty: {it.quantity} × ৳{it.unitPrice.toLocaleString()}{' '}
                        {it.selectedColor ? `• ${it.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900 text-sm">
                    ৳{it.totalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Cancel Eligible Pending Order */}
          {searchedOrder.status === 'pending' && (
            <div className="pt-4 flex justify-between items-center border-t border-neutral-200">
              <span className="text-xs text-neutral-500">
                Need to change delivery address or cancel?
              </span>
              <button
                onClick={() => cancelOrder(searchedOrder.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel This Order</span>
              </button>
            </div>
          )}
        </div>
      )}

      {showInvoice && searchedOrder && (
        <InvoiceModal order={searchedOrder} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};
