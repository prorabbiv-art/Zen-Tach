import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  LogOut,
  MapPin,
  ExternalLink,
  Shield
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTracking: (orderId?: string) => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenTracking,
  onOpenWishlist,
  onOpenAdmin
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { orders, wishlist } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  if (!isOpen) return null;

  // Filter orders for this customer (by userId or by email)
  const customerOrders = orders.filter((o) => {
    if (currentUser && o.userId === currentUser.uid) return true;
    if (currentUser?.email && o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-sm">
              {(userProfile?.fullName || currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900">
                {userProfile?.fullName || currentUser?.displayName || 'ZEN TACH Customer'}
              </h2>
              <p className="text-xs text-neutral-500">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 bg-red-50 text-[#E53935] hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 px-6 pt-3 gap-6 bg-neutral-50/50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#E53935] text-[#E53935]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile & Addresses</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-neutral-800 text-sm">No orders placed yet</h4>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    When you order smartphones, laptops, audio or accessories, they will show up here.
                  </p>
                </div>
              ) : (
                customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {order.id}
                        </span>
                        <p className="text-[11px] text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenTracking(order.id);
                          }}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-neutral-700">
                          <span className="truncate max-w-xs">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-semibold text-neutral-900">
                            ৳{item.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
                      <span className="text-neutral-500">
                        Payment: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
                      </span>
                      <span className="font-black text-neutral-900 text-sm">
                        Total: ৳{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-400 block font-bold mb-1">Full Name</span>
                  <p className="font-semibold text-neutral-900">
                    {userProfile?.fullName || currentUser?.displayName || 'Not specified'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-400 block font-bold mb-1">Email</span>
                  <p className="font-semibold text-neutral-900">{currentUser?.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-400 block font-bold mb-1">Account Role</span>
                  <p className="font-bold uppercase text-neutral-900">{userProfile?.role || 'Customer'}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-400 block font-bold mb-1">Account ID</span>
                  <p className="font-mono text-neutral-600 truncate">{currentUser?.uid}</p>
                </div>
              </div>

              {/* Wishlist Shortcut */}
              <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#E53935]" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">My Saved Wishlist</h4>
                    <p className="text-[11px] text-neutral-500">You have {wishlist.length} gadgets in your wishlist</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWishlist();
                  }}
                  className="px-4 py-1.5 bg-[#E53935] text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
                >
                  View Wishlist
                </button>
              </div>

              {/* Saved Delivery Addresses notice */}
              <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <MapPin className="w-4 h-4 text-[#E53935]" />
                  <span>Default Shipping Area</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Your delivery address is automatically confirmed during each checkout and saved with your orders for fast re-ordering.
                </p>
              </div>

              {/* Sign Out */}
              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="px-4 py-2 bg-neutral-100 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
