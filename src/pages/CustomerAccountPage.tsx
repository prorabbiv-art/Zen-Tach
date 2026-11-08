import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import {
  User as UserIcon,
  Package,
  Heart,
  LogOut,
  MapPin,
  ExternalLink,
  Shield,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  FileText
} from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';
import { Order } from '../types';

interface CustomerAccountPageProps {
  initialTab?: string;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({ initialTab }) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { orders, wishlist } = useStore();
  const { navigateToHome, navigateToTracking, navigateToWishlist, navigateToAdmin, navigateToAuth } = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>(
    initialTab === 'profile' ? 'profile' : 'orders'
  );
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Please Sign In</h2>
        <p className="text-xs text-neutral-500">
          Sign in to your customer account to view your past orders, profile, and delivery history.
        </p>
        <button
          onClick={() => navigateToAuth('login')}
          className="px-6 py-2.5 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const customerOrders = orders.filter((o) => {
    if (o.userId === currentUser.uid) return true;
    if (currentUser.email && o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">My Account</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white font-black flex items-center justify-center text-xl shadow-md">
              {(userProfile?.fullName || currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
                  {userProfile?.fullName || currentUser?.displayName || 'ZEN TACH Customer'}
                </h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#E53935] text-[10px] font-bold">
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => navigateToAdmin()}
                className="px-4 py-2 bg-red-50 text-[#E53935] hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-red-200 shadow-xs"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Suite</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                navigateToHome();
              }}
              className="px-4 py-2 bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#E53935] text-[#E53935]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-[#E53935] text-[#E53935]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile & Shipping Addresses</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3 shadow-xs">
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-neutral-900 text-base">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Your past gadgets orders and live dispatch updates will be listed here.
              </p>
            </div>
          ) : (
            customerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition-colors shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div>
                    <span className="font-mono text-sm font-black text-neutral-900">
                      {order.id}
                    </span>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>

                      <button
                        onClick={() => navigateToTracking(order.id)}
                        className="px-3.5 py-1.5 bg-neutral-900 hover:bg-[#E53935] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <span>Track</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                        />
                        <span className="font-bold text-neutral-900 truncate max-w-xs sm:max-w-md">
                          {item.quantity}x {item.name}{' '}
                          {item.selectedColor ? `(${item.selectedColor})` : ''}
                        </span>
                      </div>
                      <span className="font-black text-neutral-900">
                        ৳{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs">
                  <span className="text-neutral-500">
                    Payment Method: <strong className="uppercase">{order.paymentMethod}</strong> (Status: {order.paymentStatus})
                  </span>
                  <span className="font-black text-neutral-950 text-base">
                    Total: ৳{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
              <span className="text-neutral-400 font-bold block uppercase tracking-wider">Full Name</span>
              <p className="font-bold text-neutral-900 text-sm">
                {userProfile?.fullName || currentUser.displayName || 'Not Provided'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
              <span className="text-neutral-400 font-bold block uppercase tracking-wider">Email</span>
              <p className="font-bold text-neutral-900 text-sm">{currentUser.email}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
              <span className="text-neutral-400 font-bold block uppercase tracking-wider">Role</span>
              <p className="font-bold text-neutral-900 text-sm uppercase">{userProfile?.role || 'Customer'}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
              <span className="text-neutral-400 font-bold block uppercase tracking-wider">Firebase UID</span>
              <p className="font-mono text-neutral-600 text-xs truncate">{currentUser.uid}</p>
            </div>
          </div>

          {/* Wishlist Shortcut Banner */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center">
                <Heart className="w-5 h-5 fill-[#E53935]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Saved Wishlist</h4>
                <p className="text-xs text-neutral-500">You currently have {wishlist.length} saved gadgets</p>
              </div>
            </div>
            <button
              onClick={navigateToWishlist}
              className="px-4 py-2 bg-neutral-900 hover:bg-[#E53935] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              View Wishlist
            </button>
          </div>

          {/* Delivery Note */}
          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900">
              <MapPin className="w-4 h-4 text-[#E53935]" />
              <span>Address Management</span>
            </div>
            <p>
              Your delivery address is automatically captured and confirmed for every order. You can specify whether you are located Inside Dhaka or in any other district across Bangladesh during checkout.
            </p>
          </div>
        </div>
      )}

      {activeInvoiceOrder && (
        <InvoiceModal order={activeInvoiceOrder} onClose={() => setActiveInvoiceOrder(null)} />
      )}
    </div>
  );
};
