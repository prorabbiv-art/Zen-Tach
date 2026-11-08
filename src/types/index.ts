export type Language = 'en' | 'bn';

export interface ProductVariant {
  name: string; // e.g. "Storage" or "RAM"
  options: string[]; // e.g. ["128GB", "256GB", "512GB"]
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  shortDescription: string;
  regularPrice: number;
  discountPrice?: number | null;
  images: string[];
  thumbnail: string;
  stock: number;
  sku: string;
  warranty: string;
  specifications: Record<string, string>;
  inTheBox?: string[];
  highlights?: string[];
  faqs?: { question: string; answer: string }[];
  warrantyDetails?: {
    period: string;
    type: 'Official Brand' | 'Distributor' | 'International Replacement';
    coverage: string;
    centers: string[];
  };
  badge?: string;
  frequentlyBoughtWith?: string[];
  bundleDiscountPct?: number;
  variants?: ProductVariant[];
  colors?: ProductColor[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  status: 'active' | 'inactive';
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCompareItem {
  product: Product;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  order: number;
  productCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: Record<string, string>;
  unitPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  district: 'Inside Dhaka' | 'Outside Dhaka';
  cityOrArea: string;
  fullAddress: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'sslcommerz';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  thumbnail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor?: string;
  selectedVariant?: Record<string, string>;
}

export interface Order {
  id: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddress;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed?: number;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  deliveryDhaka: number;
  deliveryOutside: number;
  freeDeliveryThreshold: number;
  announcement: string;
  announcementEnabled: boolean;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
}
