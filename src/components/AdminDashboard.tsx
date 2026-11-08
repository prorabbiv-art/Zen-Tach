import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order, OrderStatus, PaymentStatus, Category, Coupon, Banner, StoreSettings } from '../types';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Sliders,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  Database,
  ExternalLink,
  Shield,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const {
    products,
    categories,
    orders,
    coupons,
    banners,
    settings,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    updateOrderStatus,
    saveCoupon,
    deleteCoupon,
    saveBanner,
    deleteBanner,
    saveSettings,
    seedCatalogToFirestore,
    resetCatalogToInitial,
    showToast
  } = useStore();

  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'categories' | 'inventory' | 'coupons' | 'banners' | 'settings' | 'seed'
  >('overview');

  // Search & Filters in admin
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Editing Product Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Editing Category Modal State
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Editing Coupon Modal State
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  if (!isOpen) return null;

  // 1. Analytics Calculations
  const verifiedPaidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = verifiedPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: '',
      brand: 'Apple',
      categoryId: categories[0]?.id || 'cat-smartphones',
      regularPrice: 0,
      discountPrice: null,
      stock: 10,
      sku: `ZT-${Date.now().toString().slice(-4)}`,
      warranty: '1 Year Official Warranty',
      shortDescription: '',
      description: '',
      thumbnail: '',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'],
      status: 'active',
      featured: false,
      bestSeller: false,
      newArrival: true,
      specifications: {
        'Brand Warranty': 'Yes',
        'Official BD Stock': 'Yes'
      }
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await saveProduct(editingProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory({
      name: '',
      nameBn: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      icon: 'Smartphone'
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategoryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    await saveCategory(editingCategory);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleOpenAddCoupon = () => {
    setEditingCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 2000,
      active: true
    });
    setIsCouponModalOpen(true);
  };

  const handleSaveCouponForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    await saveCoupon(editingCoupon);
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSaveSettingsForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settingsForm);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative bg-white w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95">
        {/* 1. Admin Bar Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">ZEN TACH Administration Suite</h2>
              </div>
              <p className="text-xs text-neutral-400">
                Logged in as: {currentUser?.email || 'Authorized Administrator (TubyJ10MBxRu4n34WlbaC34Jw1J3)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Restore all 16 original official gadget products?')) {
                  resetCatalogToInitial();
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 rounded-xl transition-colors cursor-pointer border border-neutral-700"
              title="Restore default 16 flagship gadget catalog"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Restore 16 Products</span>
            </button>

            <button
              onClick={seedCatalogToFirestore}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 rounded-xl transition-colors cursor-pointer border border-neutral-700"
              title="Populate/Update Firestore with gadgets"
            >
              <Database className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Sync to Firestore</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close admin dashboard"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 2. Admin Layout: Sidebar + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-56 bg-neutral-900 text-neutral-300 border-r border-neutral-800 flex flex-col justify-between p-3 shrink-0 hidden md:flex">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Stock Radar</span>
                </div>
                {lowStockProducts.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {lowStockProducts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Coupons & Vouchers</span>
              </button>

              <button
                onClick={() => setActiveTab('banners')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Hero Promotions</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Store Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('seed')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'seed'
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Database Sync</span>
              </button>
            </nav>

            <div className="p-3 bg-neutral-800/60 rounded-xl text-[11px] text-neutral-400">
              <span className="font-bold text-neutral-200 block">ZEN TACH Engine</span>
              <span>Firestore v2 ABAC security</span>
            </div>
          </aside>

          {/* Main Work Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-50">
            {/* Mobile Tab Pills */}
            <div className="flex md:hidden overflow-x-auto gap-2 pb-4 mb-4 border-b border-neutral-200 text-xs">
              {(['overview', 'products', 'orders', 'categories', 'inventory', 'coupons', 'settings', 'seed'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize whitespace-nowrap cursor-pointer ${
                      activeTab === tab ? 'bg-[#E53935] text-white' : 'bg-white text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Store Analytics & Health</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Real-time metrics calculated from verified customer orders and live inventory
                  </p>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between text-neutral-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-neutral-900">
                      ৳{totalRevenue.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      From {verifiedPaidOrders.length} verified paid orders
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between text-neutral-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-neutral-900">
                      {totalOrdersCount}
                    </div>
                    <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                      {pendingOrdersCount} pending fulfillment
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between text-neutral-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Catalog Gadgets</span>
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-neutral-900">
                      {products.length}
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Across {categories.length} active departments
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between text-neutral-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Low Stock Radar</span>
                      <AlertTriangle className="w-4 h-4 text-[#E53935]" />
                    </div>
                    <div className="text-2xl font-black text-[#E53935]">
                      {lowStockProducts.length}
                    </div>
                    <span className="text-[11px] text-red-600 font-bold mt-1 block">
                      Products with ≤ 5 units remaining
                    </span>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-neutral-900">Recent Customer Transactions</h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#E53935] hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-4 text-center">
                      No orders placed yet. Customer orders will appear here in real time.
                    </p>
                  ) : (
                    <div className="divide-y divide-neutral-100 text-xs">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <span className="font-mono font-bold text-neutral-900">{ord.id}</span>
                            <p className="text-neutral-500">
                              {ord.customerName} ({ord.customerPhone}) • {ord.items.length} items
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                            <span className="font-black text-neutral-900">
                              ৳{ord.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-neutral-900">Manage Tech Catalog</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Add, update specs, modify pricing, and control inventory
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2.5 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Gadget</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search by product name, brand, or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935]"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.thumbnail || p.images[0]}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                                />
                                <div>
                                  <span className="font-bold text-neutral-900 block max-w-xs truncate">
                                    {p.name}
                                  </span>
                                  <span className="text-[11px] text-neutral-400">
                                    {p.brand} • SKU: {p.sku}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-neutral-600 font-medium">{p.categoryName}</td>
                            <td className="p-3">
                              <span className="font-black text-neutral-900 block">
                                ৳{(p.discountPrice || p.regularPrice).toLocaleString()}
                              </span>
                              {p.discountPrice && (
                                <span className="text-[10px] text-neutral-400 line-through">
                                  ৳{p.regularPrice.toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-bold ${
                                  p.stock <= 5 ? 'text-red-600' : 'text-neutral-800'
                                }`}
                              >
                                {p.stock} units
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  p.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-neutral-900">Customer Orders & Dispatch</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Verify payments, update fulfillment lifecycle, and manage customer shipments
                    </p>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search Order ID, customer name, or phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E53935]"
                    />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-800 font-bold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-500">
                      No matching orders found.
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                          <div>
                            <span className="font-mono font-black text-sm text-neutral-900">
                              {ord.id}
                            </span>
                            <span className="ml-3 text-xs text-neutral-400">
                              {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Fulfillment Status Selector */}
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {/* Payment Status Selector */}
                            <select
                              value={ord.paymentStatus}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, ord.status, e.target.value as PaymentStatus)
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="pending">Payment Pending</option>
                              <option value="paid">Paid</option>
                              <option value="refunded">Refunded</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer & Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1 text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                            <span className="font-bold text-neutral-900 block">Customer Information:</span>
                            <p className="font-semibold text-neutral-900">{ord.customerName}</p>
                            <p>Phone: <a href={`tel:${ord.customerPhone}`} className="text-[#E53935] font-bold">{ord.customerPhone}</a></p>
                            {ord.customerEmail && <p>Email: {ord.customerEmail}</p>}
                            <p className="mt-1 text-neutral-700">
                              {ord.shippingAddress.fullAddress}, {ord.shippingAddress.cityOrArea} (<strong>{ord.shippingAddress.district}</strong>)
                            </p>
                            {ord.deliveryNotes && (
                              <p className="text-amber-800 bg-amber-50 p-1.5 rounded mt-2 text-[11px]">
                                Note: {ord.deliveryNotes}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <span className="font-bold text-neutral-900 block">Purchased Items:</span>
                            <div className="divide-y divide-neutral-100 max-h-36 overflow-y-auto">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="py-1.5 flex justify-between items-center text-xs">
                                  <span className="truncate max-w-xs font-medium text-neutral-800">
                                    {it.quantity}x {it.name}
                                  </span>
                                  <span className="font-bold text-neutral-900">
                                    ৳{it.totalPrice.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-neutral-200 flex justify-between font-black text-sm text-neutral-950">
                              <span>Total ({ord.paymentMethod.toUpperCase()})</span>
                              <span className="text-[#E53935]">৳{ord.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-neutral-900">Gadget Categories</h3>
                    <p className="text-xs text-neutral-500 mt-1">Organize catalog navigation</p>
                  </div>
                  <button
                    onClick={handleOpenAddCategory}
                    className="px-4 py-2 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{cat.name}</h4>
                          <span className="text-[11px] text-neutral-500">{cat.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: INVENTORY RADAR */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Inventory & Stock Radar</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Manage stock levels and restock fast-selling gadgets
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Current Stock</th>
                          <th className="p-3">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="p-3 font-bold text-neutral-900">{p.name}</td>
                            <td className="p-3 font-mono text-neutral-500">{p.sku}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  p.stock <= 5
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {p.stock} units
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => saveProduct({ id: p.id, stock: p.stock + 5 })}
                                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => saveProduct({ id: p.id, stock: p.stock + 10 })}
                                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                >
                                  +10
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-neutral-900">Discount Coupons</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Promotional vouchers for campaigns and customer incentives
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddCoupon}
                    className="px-4 py-2 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Coupon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-base text-[#E53935] tracking-wider">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {c.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-600 space-y-1">
                        <p>
                          Discount:{' '}
                          <strong>
                            {c.discountType === 'percentage'
                              ? `${c.discountValue}% OFF`
                              : `৳${c.discountValue} Fixed OFF`}
                          </strong>
                        </p>
                        {c.minOrderAmount && (
                          <p>Min Order: ৳{c.minOrderAmount.toLocaleString()}</p>
                        )}
                        <p>Times Used: {c.timesUsed || 0}</p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => deleteCoupon(c.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: BANNERS */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Hero Promotions & Slides</h3>
                  <p className="text-xs text-neutral-500 mt-1">Customize storefront promotional banners</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-neutral-100">
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-900/80 text-white rounded text-[10px] font-bold">
                          {b.tag || 'Slide'}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-neutral-900 text-sm">{b.title}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-2">{b.subtitle}</p>
                        <div className="pt-2 flex justify-between items-center text-xs">
                          <span className="text-[#E53935] font-bold">{b.ctaText}</span>
                          <button
                            onClick={() => deleteBanner(b.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: STORE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Official Store Settings</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Manage delivery fees, phone numbers, and notification banner
                  </p>
                </div>

                <form onSubmit={handleSaveSettingsForm} className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">Official Brand Name</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Support Phone Hotline</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Inside Dhaka Fee (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryDhaka}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryDhaka: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Outside Dhaka Fee (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryOutside}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryOutside: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Free Delivery Min (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.freeDeliveryThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">Top Announcement Message</label>
                    <textarea
                      rows={2}
                      value={settingsForm.announcement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#E53935] hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Save Store Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 9: DATABASE SYNC */}
            {activeTab === 'seed' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Firestore Cloud Database Sync</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Direct integration with your <strong>zentach</strong> Firebase Firestore instance
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center font-bold">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">One-Click Catalog Seeder</h4>
                      <p className="text-neutral-500">
                        Populates Firestore collections (products, categories, banners, coupons, settings)
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 font-mono text-[11px] text-neutral-600">
                    <p>Project ID: zentach</p>
                    <p>Auth Domain: zentach.firebaseapp.com</p>
                    <p>Authorized Admin: TubyJ10MBxRu4n34WlbaC34Jw1J3</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        if (window.confirm('Restore all 16 original official gadget products?')) {
                          resetCatalogToInitial();
                        }
                      }}
                      className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-neutral-300"
                    >
                      <RefreshCw className="w-4 h-4 text-neutral-600" />
                      <span>Restore 16 Original Products</span>
                    </button>

                    <button
                      onClick={seedCatalogToFirestore}
                      className="flex-1 py-3 bg-[#E53935] hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                    >
                      <Database className="w-4 h-4 text-white" />
                      <span>Run Sync to Firestore Database</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="font-bold text-sm text-neutral-900">
                {editingProduct.id ? 'Edit Gadget' : 'Add New Tech Gadget'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Category *</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.regularPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Discount Price (৳, Optional)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Warranty Details</label>
                  <input
                    type="text"
                    value={editingProduct.warranty || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Image URL (High-res photo)</label>
                  <input
                    type="url"
                    value={editingProduct.thumbnail || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E53935] hover:bg-red-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="font-bold text-sm text-neutral-900">Category Details</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryForm} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Category Name (Bangla)</label>
                <input
                  type="text"
                  value={editingCategory.nameBn || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameBn: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editingCategory.image || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E53935] text-white rounded-xl font-bold cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT COUPON */}
      {isCouponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="font-bold text-sm text-neutral-900">Create Discount Voucher</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCouponForm} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER10"
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Type</label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.discountValue || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Minimum Order Amount (৳)</label>
                <input
                  type="number"
                  value={editingCoupon.minOrderAmount || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E53935] text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
