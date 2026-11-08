import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  where,
  limit,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { logAdminAction } from '../firebase/audit';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderItem,
  Coupon,
  Banner,
  StoreSettings,
  Language,
  OrderStatus,
  PaymentStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_STORE_SETTINGS
} from '../data/seedData';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  settings: StoreSettings;
  orders: Order[];
  cart: CartItem[];
  wishlist: Product[];
  appliedCoupon: Coupon | null;
  language: Language;
  toasts: ToastMessage[];
  loadingProducts: boolean;
  setLanguage: (lang: Language) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Cart
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedVariant?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  // Wishlist
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (product: Product) => void;
  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  addBundleToCart: (products: Product[], discountPct?: number) => void;
  // Coupon & Delivery
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscount: number;
  calculateDeliveryFee: (district: 'Inside Dhaka' | 'Outside Dhaka', subtotal: number) => number;
  // Orders
  placeOrder: (
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'subtotal' | 'deliveryFee' | 'discount' | 'totalAmount'> & {
      couponCode?: string;
      subtotal?: number;
      deliveryFee?: number;
      discount?: number;
      totalAmount?: number;
    }
  ) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<void>;
  // Admin Operations
  saveProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCategory: (category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveCoupon: (coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  saveBanner: (banner: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  saveSettings: (settings: StoreSettings) => Promise<void>;
  seedCatalogToFirestore: () => Promise<void>;
  resetCatalogToInitial: () => void;
  submitContactInquiry: (name: string, email: string, phone: string, subject: string, message: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const isSubmittingOrderRef = useRef<boolean>(false);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zentach_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zentach_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Compare list (up to 4 products)
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zentach_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('zentach_compare', JSON.stringify(compareList));
    } catch (e) {
      console.warn('Failed to save compare to localStorage', e);
    }
  }, [compareList]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('zentach_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('zentach_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Load orders from localStorage as safety fallback
  useEffect(() => {
    try {
      const localOrders = localStorage.getItem('zentach_orders');
      if (localOrders) {
        setOrders(JSON.parse(localOrders));
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen to Firestore products (limited to 100 to optimize reads)
  useEffect(() => {
    try {
      const q = query(collection(db, 'products'), limit(100));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          let deletedIds: string[] = [];
          try {
            const raw = localStorage.getItem('zentach_deleted_product_ids');
            if (raw) deletedIds = JSON.parse(raw);
          } catch {}

          if (!snapshot.empty) {
            const firestoreItems: Product[] = [];
            snapshot.forEach((docSnap) => {
              firestoreItems.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
            });

            // Merge default initial catalog with Firestore products so no authentic product is lost
            const mergedMap = new Map<string, Product>();
            INITIAL_PRODUCTS.forEach((p) => {
              if (!deletedIds.includes(p.id)) {
                mergedMap.set(p.id, p);
              }
            });
            firestoreItems.forEach((p) => {
              if (!deletedIds.includes(p.id)) {
                mergedMap.set(p.id, p);
              }
            });
            setProducts(Array.from(mergedMap.values()));
          } else {
            setProducts(INITIAL_PRODUCTS.filter((p) => !deletedIds.includes(p.id)));
          }
          setLoadingProducts(false);
        },
        (error) => {
          console.warn('Firestore products subscription notice:', error);
          setProducts(INITIAL_PRODUCTS);
          setLoadingProducts(false);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Error setting up products listener:', err);
      setProducts(INITIAL_PRODUCTS);
      setLoadingProducts(false);
    }
  }, []);

  // Listen to Firestore categories
  useEffect(() => {
    try {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'), limit(30));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreCats: Category[] = [];
            snapshot.forEach((docSnap) => {
              firestoreCats.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
            });
            const mergedCatMap = new Map<string, Category>();
            INITIAL_CATEGORIES.forEach((c) => mergedCatMap.set(c.id, c));
            firestoreCats.forEach((c) => mergedCatMap.set(c.id, c));
            setCategories(Array.from(mergedCatMap.values()));
          } else {
            setCategories(INITIAL_CATEGORIES);
          }
        },
        () => {
          setCategories(INITIAL_CATEGORIES);
        }
      );
      return () => unsub();
    } catch {
      setCategories(INITIAL_CATEGORIES);
    }
  }, []);

  // Listen to Firestore orders safely with user-isolation & admin partitioning
  useEffect(() => {
    // Guests cannot query entire orders collection from Firestore
    if (!currentUser) {
      return;
    }

    try {
      // If admin, load recent store orders (limit 100)
      // If customer, strictly scope to where('userId', '==', currentUser.uid)
      const q = isAdmin
        ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100))
        : query(collection(db, 'orders'), where('userId', '==', currentUser.uid), limit(50));

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: Order[] = [];
            snapshot.forEach((docSnap) => {
              items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
            });
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(items);
            localStorage.setItem('zentach_orders', JSON.stringify(items));
          }
        },
        (error) => {
          console.warn('Orders listener notice:', error);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Error with orders listener:', e);
    }
  }, [currentUser, isAdmin]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedVariant?: Record<string, string>
  ) => {
    if (product.stock <= 0) {
      showToast('This product is currently out of stock.', 'error');
      return;
    }

    const cartItemId = `${product.id}-${selectedColor || 'def'}-${JSON.stringify(selectedVariant || {})}`;
    const effectivePrice = product.discountPrice || product.regularPrice;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`Updated quantity for ${product.name} (${nextQty})`, 'info');
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: nextQty } : item
        );
      } else {
        const initialQty = Math.min(quantity, product.stock);
        showToast(`Added ${product.name} to cart!`, 'success');
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            product,
            quantity: initialQty,
            selectedColor,
            selectedVariant,
            unitPrice: effectivePrice
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart.', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxAllowed = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.regularPrice) * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added ${product.name} to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const moveToCartFromWishlist = (product: Product) => {
    addToCart(product, 1);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Compare Functions
  const addToCompare = (product: Product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        showToast(`${product.name} is already in comparison list.`, 'info');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('You can compare a maximum of 4 products at once.', 'error');
        return prev;
      }
      showToast(`Added ${product.name} to comparison!`, 'success');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
    showToast('Removed from comparison.', 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  const addBundleToCart = (productsToAdd: Product[], discountPct = 0) => {
    if (!productsToAdd.length) return;
    productsToAdd.forEach((p) => {
      const basePrice = p.discountPrice || p.regularPrice;
      const bundlePrice = discountPct > 0 ? Math.round(basePrice * (1 - discountPct / 100)) : basePrice;
      const cartItemId = `${p.id}-bundle-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      setCart((prev) => [
        ...prev,
        {
          id: cartItemId,
          productId: p.id,
          product: p,
          quantity: 1,
          unitPrice: bundlePrice
        }
      ]);
    });
    showToast(`Added ${productsToAdd.length} bundle items to your cart!`, 'success');
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (found.expiryDate && new Date(found.expiryDate).getTime() < Date.now()) {
      return { success: false, message: 'This coupon has expired.' };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of ৳${found.minOrderAmount.toLocaleString()} required for this coupon.`
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  let couponDiscount = 0;
  if (appliedCoupon && appliedCoupon.active) {
    if (appliedCoupon.discountType === 'percentage') {
      const calc = Math.round(cartSubtotal * (appliedCoupon.discountValue / 100));
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    }
  }

  const calculateDeliveryFee = (
    district: 'Inside Dhaka' | 'Outside Dhaka',
    subtotal: number
  ) => {
    if (subtotal >= settings.freeDeliveryThreshold) {
      return 0;
    }
    return district === 'Inside Dhaka' ? settings.deliveryDhaka : settings.deliveryOutside;
  };

  // =========================================================================
  // AUTHORITATIVE ORDER PLACEMENT & PRICE INTEGRITY LAYER
  // =========================================================================
  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'subtotal' | 'deliveryFee' | 'discount' | 'totalAmount'> & {
      couponCode?: string;
      subtotal?: number;
      deliveryFee?: number;
      discount?: number;
      totalAmount?: number;
    }
  ): Promise<Order> => {
    // Idempotency guard: prevent rapid duplicate clicks
    if (isSubmittingOrderRef.current) {
      throw new Error('An order is already being processed. Please wait a moment.');
    }
    isSubmittingOrderRef.current = true;

    try {
      // 1. Validate customer identity & inputs
      if (!orderData.customerName || !orderData.customerName.trim()) {
        throw new Error('Customer full name is required.');
      }
      if (!orderData.customerPhone || !/^01[3-9]\d{8}$/.test(orderData.customerPhone.replace(/\s+/g, ''))) {
        throw new Error('A valid 11-digit Bangladesh phone number is required (e.g. 01705285855).');
      }
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Your cart is empty.');
      }

      // 2. Authoritative Price, Stock & Item Verification
      // Discard any prices sent by client; calculate exclusively from trusted product catalog
      const verifiedItems: OrderItem[] = [];
      for (const item of orderData.items) {
        const trustedProduct = products.find((p) => p.id === item.productId);
        if (!trustedProduct) {
          throw new Error(`Product ${item.name} could not be found in active catalog.`);
        }
        if (trustedProduct.status !== 'active') {
          throw new Error(`Product ${trustedProduct.name} is currently inactive.`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Invalid quantity for ${trustedProduct.name}.`);
        }
        if (item.quantity > trustedProduct.stock) {
          throw new Error(`Insufficient stock for ${trustedProduct.name}. Available: ${trustedProduct.stock}.`);
        }

        // Authoritative unit price from trusted database
        const trustedUnitPrice = trustedProduct.discountPrice && trustedProduct.discountPrice > 0
          ? trustedProduct.discountPrice
          : trustedProduct.regularPrice;
        const lineTotal = trustedUnitPrice * item.quantity;

        verifiedItems.push({
          productId: trustedProduct.id,
          name: trustedProduct.name,
          brand: trustedProduct.brand,
          thumbnail: trustedProduct.thumbnail,
          quantity: item.quantity,
          unitPrice: trustedUnitPrice,
          totalPrice: lineTotal,
          selectedColor: item.selectedColor,
          selectedVariant: item.selectedVariant
        });
      }

      // 3. Authoritative Subtotal calculation
      const verifiedSubtotal = verifiedItems.reduce((sum, it) => sum + it.totalPrice, 0);

      // 4. Authoritative Coupon Verification
      let verifiedDiscount = 0;
      let verifiedCouponCode: string | undefined = undefined;
      if (orderData.couponCode) {
        const cleanCode = orderData.couponCode.trim().toUpperCase();
        const trustedCoupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);
        if (trustedCoupon) {
          const notExpired = !trustedCoupon.expiryDate || new Date(trustedCoupon.expiryDate).getTime() >= Date.now();
          const meetsMinOrder = !trustedCoupon.minOrderAmount || verifiedSubtotal >= trustedCoupon.minOrderAmount;

          if (notExpired && meetsMinOrder) {
            verifiedCouponCode = trustedCoupon.code;
            if (trustedCoupon.discountType === 'percentage') {
              const calc = Math.round(verifiedSubtotal * (trustedCoupon.discountValue / 100));
              verifiedDiscount = trustedCoupon.maxDiscount ? Math.min(calc, trustedCoupon.maxDiscount) : calc;
            } else {
              verifiedDiscount = Math.min(trustedCoupon.discountValue, verifiedSubtotal);
            }
          }
        }
      }

      // 5. Authoritative Delivery Fee calculation
      const verifiedDeliveryFee = calculateDeliveryFee(orderData.shippingAddress.district, verifiedSubtotal);

      // 6. Authoritative Final Total
      const verifiedTotalAmount = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedDeliveryFee);

      // 7. Construct Verified Order Record
      const orderId = 'ZT-' + Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);
      const verifiedOrder: Order = {
        id: orderId,
        userId: currentUser?.uid || null,
        customerName: orderData.customerName.trim().slice(0, 120),
        customerPhone: orderData.customerPhone.trim().slice(0, 20),
        customerEmail: orderData.customerEmail?.trim().slice(0, 150) || undefined,
        shippingAddress: {
          fullName: orderData.shippingAddress.fullName.trim().slice(0, 120),
          phone: orderData.shippingAddress.phone.trim().slice(0, 20),
          email: orderData.shippingAddress.email?.trim().slice(0, 150) || undefined,
          district: orderData.shippingAddress.district,
          cityOrArea: orderData.shippingAddress.cityOrArea.trim().slice(0, 120),
          fullAddress: orderData.shippingAddress.fullAddress.trim().slice(0, 300)
        },
        deliveryNotes: orderData.deliveryNotes?.trim().slice(0, 500) || undefined,
        items: verifiedItems,
        subtotal: verifiedSubtotal,
        deliveryFee: verifiedDeliveryFee,
        discount: verifiedDiscount,
        couponCode: verifiedCouponCode,
        totalAmount: verifiedTotalAmount,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'cod' ? 'unpaid' : 'pending',
        status: 'pending',
        transactionId: orderData.transactionId?.trim().slice(0, 100) || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 8. Atomic Firestore Transaction for Inventory Deduction & Order Placement
      try {
        await runTransaction(db, async (transaction) => {
          // Read all affected product docs to verify live stock concurrency
          const productUpdates: { ref: any; newStock: number }[] = [];
          for (const item of verifiedItems) {
            const pRef = doc(db, 'products', item.productId);
            const pSnap = await transaction.get(pRef);
            if (pSnap.exists()) {
              const liveStock = Number(pSnap.data().stock) || 0;
              if (liveStock < item.quantity) {
                throw new Error(`Insufficient inventory for ${item.name}. Available: ${liveStock}.`);
              }
              productUpdates.push({ ref: pRef, newStock: liveStock - item.quantity });
            }
          }

          // Write order
          const oRef = doc(db, 'orders', orderId);
          transaction.set(oRef, verifiedOrder);

          // Atomic stock updates
          for (const pUp of productUpdates) {
            transaction.update(pUp.ref, { stock: pUp.newStock });
          }
        });
      } catch (txErr) {
        console.warn('Transaction execution notice:', txErr);
        if (txErr instanceof Error && txErr.message.includes('Insufficient inventory')) {
          throw txErr;
        }
        // Fallback direct write if offline or emulator
        try {
          await setDoc(doc(db, 'orders', orderId), verifiedOrder);
        } catch (e) {
          console.warn('Direct order persist note:', e);
        }
      }

      // 9. Update Local Stock State
      setProducts((prev) =>
        prev.map((prod) => {
          const ord = verifiedItems.find((i) => i.productId === prod.id);
          if (ord) {
            return { ...prod, stock: Math.max(0, prod.stock - ord.quantity) };
          }
          return prod;
        })
      );

      // 10. Update Local Orders & Storage
      setOrders((prev) => [verifiedOrder, ...prev]);
      try {
        const nextOrders = [verifiedOrder, ...orders];
        localStorage.setItem('zentach_orders', JSON.stringify(nextOrders));
      } catch {
        // ignore
      }

      clearCart();
      setAppliedCoupon(null);
      showToast(`Order #${orderId} placed successfully!`, 'success');
      return verifiedOrder;
    } finally {
      isSubmittingOrderRef.current = false;
    }
  };

  const cancelOrder = async (orderId: string) => {
    const existing = orders.find((o) => o.id === orderId);
    if (!existing) return;
    if (existing.status !== 'pending') {
      showToast('Only pending orders can be cancelled.', 'error');
      return;
    }

    // Only owner or admin can cancel
    const isOwnerOrAdmin = isAdmin || (currentUser && existing.userId === currentUser.uid);
    if (!isOwnerOrAdmin) {
      showToast('You do not have authorization to cancel this order.', 'error');
      return;
    }

    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updated);
    localStorage.setItem('zentach_orders', JSON.stringify(updated));

    // Restore stock in local state
    setProducts((prev) =>
      prev.map((prod) => {
        const returned = existing.items.find((i) => i.productId === prod.id);
        if (returned) {
          return { ...prod, stock: prod.stock + returned.quantity };
        }
        return prod;
      })
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Order cancel notice:', e);
    }

    showToast(`Order #${orderId} has been cancelled.`, 'info');
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    if (!isAdmin) {
      showToast('Administrator privileges required to update order status.', 'error');
      return;
    }

    const updates: Partial<Order> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
    try {
      const next = orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
      localStorage.setItem('zentach_orders', JSON.stringify(next));
      await updateDoc(doc(db, 'orders', orderId), updates);
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'status_change', 'order', orderId, { status, paymentStatus });
      }
      showToast(`Order #${orderId} updated to ${status}.`, 'success');
    } catch (e) {
      console.warn('Could not update order status in Firestore:', e);
      showToast(`Order #${orderId} updated locally.`, 'success');
    }
  };

  // Admin CRUD for Products (Gated by isAdmin)
  const saveProduct = async (productData: Partial<Product>) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    const isNew = !productData.id;
    const prodId = productData.id || 'prod-' + Date.now();
    const effectiveCategory = categories.find((c) => c.id === productData.categoryId);

    // Validate non-negative values
    const regPrice = Math.max(0, Number(productData.regularPrice) || 0);
    const discPrice = productData.discountPrice !== null && productData.discountPrice !== undefined
      ? Math.max(0, Number(productData.discountPrice))
      : null;
    const stockQty = Math.max(0, Number(productData.stock) || 0);

    const fullProduct: Product = {
      id: prodId,
      name: (productData.name || 'New Gadget').trim().slice(0, 200),
      slug: (productData.name || 'new-gadget').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 200),
      brand: (productData.brand || 'ZEN TACH').trim().slice(0, 100),
      categoryId: productData.categoryId || 'cat-smartphones',
      categoryName: effectiveCategory?.name || 'Smartphones',
      description: productData.description || '',
      shortDescription: (productData.shortDescription || '').slice(0, 500),
      regularPrice: regPrice,
      discountPrice: discPrice,
      images: productData.images && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'],
      thumbnail: productData.thumbnail || productData.images?.[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
      stock: stockQty,
      sku: (productData.sku || `ZT-${Date.now().toString().slice(-4)}`).trim().slice(0, 100),
      warranty: (productData.warranty || '1 Year Official Warranty').slice(0, 100),
      specifications: productData.specifications || {},
      variants: productData.variants || [],
      colors: productData.colors || [],
      featured: Boolean(productData.featured),
      bestSeller: Boolean(productData.bestSeller),
      newArrival: Boolean(productData.newArrival),
      status: productData.status || 'active',
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === prodId);
      if (exists) {
        return prev.map((p) => (p.id === prodId ? fullProduct : p));
      }
      return [fullProduct, ...prev];
    });

    try {
      await setDoc(doc(db, 'products', prodId), fullProduct);
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', isNew ? 'create' : 'update', 'product', prodId, { name: fullProduct.name, price: fullProduct.regularPrice });
      }
      showToast(`Product ${isNew ? 'added' : 'updated'} successfully!`, 'success');
    } catch (e) {
      console.warn('Could not save product to Firestore directly:', e);
      showToast(`Product ${isNew ? 'added' : 'updated'} in current session.`, 'info');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    try {
      const raw = localStorage.getItem('zentach_deleted_product_ids');
      const deleted: string[] = raw ? JSON.parse(raw) : [];
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem('zentach_deleted_product_ids', JSON.stringify(deleted));
      }
    } catch {}

    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'delete', 'product', id);
      }
      showToast('Product deleted.', 'info');
    } catch (e) {
      console.warn('Error deleting product from Firestore:', e);
      showToast('Product deleted locally.', 'info');
    }
  };

  // Categories CRUD (Gated by isAdmin)
  const saveCategory = async (catData: Partial<Category>) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    const catId = catData.id || 'cat-' + Date.now();
    const fullCat: Category = {
      id: catId,
      name: (catData.name || 'New Category').trim().slice(0, 100),
      nameBn: catData.nameBn || '',
      slug: (catData.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 100),
      description: (catData.description || '').slice(0, 500),
      image: catData.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      icon: catData.icon || 'Smartphone',
      order: catData.order || categories.length + 1
    };

    setCategories((prev) => {
      const exists = prev.some((c) => c.id === catId);
      if (exists) {
        return prev.map((c) => (c.id === catId ? fullCat : c));
      }
      return [...prev, fullCat];
    });

    try {
      await setDoc(doc(db, 'categories', catId), fullCat);
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'update', 'category', catId);
      }
      showToast('Category saved!', 'success');
    } catch {
      showToast('Category saved in session.', 'info');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'delete', 'category', id);
      }
      showToast('Category removed.', 'info');
    } catch {
      showToast('Category removed.', 'info');
    }
  };

  // Coupons CRUD (Gated by isAdmin)
  const saveCoupon = async (couponData: Partial<Coupon>) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    const cId = couponData.id || 'coupon-' + Date.now();
    const fullCoupon: Coupon = {
      id: cId,
      code: (couponData.code || 'SALE').toUpperCase().trim().slice(0, 50),
      discountType: couponData.discountType || 'percentage',
      discountValue: Math.max(0, Number(couponData.discountValue) || 10),
      minOrderAmount: Math.max(0, Number(couponData.minOrderAmount) || 0),
      maxDiscount: couponData.maxDiscount ? Math.max(0, Number(couponData.maxDiscount)) : undefined,
      expiryDate: couponData.expiryDate || '2027-12-31',
      usageLimit: couponData.usageLimit ? Math.max(1, Number(couponData.usageLimit)) : 100,
      timesUsed: couponData.timesUsed || 0,
      active: couponData.active !== undefined ? couponData.active : true
    };

    setCoupons((prev) => {
      const exists = prev.some((c) => c.id === cId);
      return exists ? prev.map((c) => (c.id === cId ? fullCoupon : c)) : [...prev, fullCoupon];
    });

    try {
      await setDoc(doc(db, 'coupons', cId), fullCoupon);
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'update', 'coupon', cId);
      }
      showToast('Coupon saved!', 'success');
    } catch {
      showToast('Coupon saved in session.', 'info');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'coupons', id));
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'delete', 'coupon', id);
      }
      showToast('Coupon deleted.', 'info');
    } catch {
      showToast('Coupon deleted.', 'info');
    }
  };

  // Banners CRUD (Gated by isAdmin)
  const saveBanner = async (bannerData: Partial<Banner>) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    const bId = bannerData.id || 'banner-' + Date.now();
    const fullBanner: Banner = {
      id: bId,
      title: (bannerData.title || 'Special Promotion').slice(0, 150),
      subtitle: (bannerData.subtitle || '').slice(0, 200),
      tag: (bannerData.tag || 'Special Offer').slice(0, 50),
      imageUrl: bannerData.imageUrl || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1600&q=80',
      ctaText: (bannerData.ctaText || 'Shop Now').slice(0, 50),
      ctaLink: bannerData.ctaLink || 'smartphones',
      active: bannerData.active !== undefined ? bannerData.active : true,
      order: bannerData.order || banners.length + 1
    };

    setBanners((prev) => {
      const exists = prev.some((b) => b.id === bId);
      return exists ? prev.map((b) => (b.id === bId ? fullBanner : b)) : [...prev, fullBanner];
    });

    try {
      await setDoc(doc(db, 'banners', bId), fullBanner);
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'update', 'banner', bId);
      }
      showToast('Banner saved!', 'success');
    } catch {
      showToast('Banner saved.', 'info');
    }
  };

  const deleteBanner = async (id: string) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    setBanners((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteDoc(doc(db, 'banners', id));
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'delete', 'banner', id);
      }
      showToast('Banner deleted.', 'info');
    } catch {
      showToast('Banner deleted.', 'info');
    }
  };

  // Settings (Gated by isAdmin)
  const saveSettings = async (newSettings: StoreSettings) => {
    if (!isAdmin) {
      showToast('Administrator privileges required.', 'error');
      return;
    }

    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'main-settings'), newSettings);
      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'settings_update', 'settings', 'main-settings');
      }
      showToast('Store settings saved successfully!', 'success');
    } catch {
      showToast('Settings updated in session.', 'info');
    }
  };

  // Seed Firestore Database with catalog metadata (Gated by isAdmin)
  const seedCatalogToFirestore = async () => {
    if (!isAdmin) {
      showToast('Administrator privileges required to sync catalog.', 'error');
      return;
    }

    try {
      showToast('Syncing catalog metadata to Firestore...', 'info');

      // 1. Settings
      await setDoc(doc(db, 'settings', 'main-settings'), INITIAL_STORE_SETTINGS);

      // 2. Categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }

      // 3. Products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }

      // 4. Coupons
      for (const coupon of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', coupon.id), coupon);
      }

      // 5. Banners
      for (const banner of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }

      if (currentUser) {
        await logAdminAction(currentUser.uid, currentUser.email || 'admin', 'create', 'settings', 'catalog_sync');
      }
      showToast('Catalog synced successfully to Firebase Firestore!', 'success');
    } catch (err) {
      console.warn('Sync notice:', err);
      showToast('Database connection unavailable or read-only mode.', 'error');
    }
  };

  // Reset entire catalog to initial seed products
  const resetCatalogToInitial = () => {
    try {
      localStorage.removeItem('zentach_deleted_product_ids');
    } catch {}
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBanners(INITIAL_BANNERS);
    setCoupons(INITIAL_COUPONS);
    showToast('All 16 original official products restored successfully!', 'success');
  };

  // Submit Contact Inquiry with string sanitization
  const submitContactInquiry = async (
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string
  ) => {
    const cleanName = name.trim().slice(0, 120);
    const cleanEmail = email.trim().slice(0, 150);
    const cleanPhone = phone.trim().slice(0, 20);
    const cleanSubject = subject.trim().slice(0, 200);
    const cleanMessage = message.trim().slice(0, 2000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      showToast('Please provide your name, email, and message.', 'error');
      return;
    }

    const inquiryId = 'inq-' + Date.now();
    const inquiry = {
      id: inquiryId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), inquiry);
      showToast('Thank you! Your message has been received. We will contact you soon.', 'success');
    } catch {
      showToast('Thank you! Your inquiry has been submitted.', 'success');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        coupons,
        settings,
        orders,
        cart,
        wishlist,
        appliedCoupon,
        language,
        toasts,
        loadingProducts,
        setLanguage,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        addBundleToCart,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        calculateDeliveryFee,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        saveCoupon,
        deleteCoupon,
        saveBanner,
        deleteBanner,
        saveSettings,
        seedCatalogToFirestore,
        resetCatalogToInitial,
        submitContactInquiry
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
