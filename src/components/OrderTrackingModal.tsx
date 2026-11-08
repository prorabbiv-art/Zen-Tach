import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  preselectedOrderId
}) => {
  const { orders, cancelOrder } = useStore();
  const [searchId, setSearchId] = useState(preselectedOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (preselectedOrderId) {
      setSearchId(preselectedOrderId);
      const found = orders.find((o) => o.id.toLowerCase() === preselectedOrderId.toLowerCase());
      if (found) {
        setSearchedOrder(found);
        setHasSearched(true);
      }
    }
  }, [preselectedOrderId, orders]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.customerPhone.replace(/\s+/g, '') === clean.replace(/\s+/g, '')
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const stages: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" /> },
    { key: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E53935]" />
            <h2 className="text-base sm:text-lg font-black text-neutral-900">
              Live Order Tracking
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ZT-...) or Phone Number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-[#E53935] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Result */}
          {hasSearched && !searchedOrder && (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-neutral-900 text-sm">No Order Found</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Please verify your Order ID or contact ZEN TACH support hotline at 01705285855 for direct dispatch assistance.
              </p>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-6">
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                    Order Reference
                  </span>
                  <p className="font-mono text-base font-black text-neutral-900">
                    {searchedOrder.id}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()} at{' '}
                    {new Date(searchedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
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
                  <span className="text-xs font-black text-neutral-900">
                    ৳{searchedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              {isCancelled ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center text-xs text-red-800 font-semibold">
                  This order was cancelled. Any reserved stock has been returned to inventory.
                </div>
              ) : (
                <div className="py-4">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
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
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-[#E53935] text-white shadow-md'
                                : 'bg-neutral-200 text-neutral-500'
                            } ${isCurrent ? 'ring-4 ring-red-100 scale-110' : ''}`}
                          >
                            {stage.icon}
                          </div>
                          <span
                            className={`text-[11px] font-bold mt-2 ${
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

              {/* Items Purchased Snapshot */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
                  Order Items ({searchedOrder.items.length})
                </h4>
                <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-100 overflow-hidden">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-100"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">{item.name}</p>
                          <p className="text-[11px] text-neutral-500">
                            Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}{' '}
                            {item.selectedColor ? `• ${item.selectedColor}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900">
                        ৳{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div>
                  <span className="font-bold text-neutral-500 block mb-1">Customer & Shipping:</span>
                  <p className="font-semibold text-neutral-900">{searchedOrder.customerName}</p>
                  <p className="text-neutral-600">{searchedOrder.customerPhone}</p>
                  <p className="text-neutral-600 mt-1">
                    {searchedOrder.shippingAddress.fullAddress},{' '}
                    {searchedOrder.shippingAddress.cityOrArea},{' '}
                    {searchedOrder.shippingAddress.district}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-neutral-500 block mb-1">Payment Information:</span>
                  <p className="text-neutral-800">
                    Method:{' '}
                    <strong className="uppercase">
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
                    <p className="text-neutral-600 font-mono mt-1">
                      TrxID: {searchedOrder.transactionId}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Cancel Eligible Order */}
              {searchedOrder.status === 'pending' && (
                <div className="pt-2 flex justify-end">
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
        </div>
      </div>
    </div>
  );
};
