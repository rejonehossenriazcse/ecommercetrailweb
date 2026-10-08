'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Product, ProductVariant, CartItem, Currency, Language, Coupon, Address, CustomerUser } from '@/types';
import { CURRENCIES, LANGUAGES, AVAILABLE_COUPONS } from '@/data/mockData';
import { trackEcommerceEvent } from '@/lib/tracking';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export const DEFAULT_DEMO_CUSTOMER: CustomerUser = {
  id: 'cust-001',
  name: 'Marcus Vance',
  email: 'marcus.vance@collector.com',
  phone: '+1 (415) 555-0192',
  tier: 'Platinum',
  totalOrders: 6,
  totalSpent: 4280.50,
  loyaltyPoints: 1250,
  storeCredit: 150.00,
  referralCode: 'STRIDE-MARCUS-2026',
  addresses: [
    {
      id: 'addr-1',
      title: 'Design Studio & Residence',
      recipientName: 'Marcus Vance',
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94111',
      country: 'United States',
      phone: '+1 (415) 555-0192',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
    {
      id: 'addr-2',
      title: 'Manhattan Atelier',
      recipientName: 'Marcus Vance',
      street: '450 West 33rd Street, 12th Floor',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 (212) 555-8930',
      isDefaultShipping: false,
      isDefaultBilling: false,
    },
  ],
  createdAt: '2026-02-14T10:00:00Z',
};

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  savedForLater: CartItem[];
  recentlyViewed: string[];
  activeCurrency: Currency;
  activeLanguage: Language;
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastItem[];

  // Customer Account
  customer: CustomerUser | null;
  isCustomerLoggedIn: boolean;
  
  // Pricing & Computations
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number; // 0 to 100%

  // Actions
  formatPrice: (amountInUSD: number) => string;
  setCurrency: (code: Currency['code']) => void;
  setLanguage: (code: Language['code']) => void;
  addToCart: (product: Product, quantity?: number, selectedOptions?: { [key: string]: string }, variant?: ProductVariant) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  saveForLater: (itemId: string) => void;
  moveToCartFromSaved: (itemId: string) => void;
  removeFromSavedForLater: (itemId: string) => void;
  toggleWishlist: (productId: string, productName?: string, productPrice?: number) => void;
  isInWishlist: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsSearchModalOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;

  // Customer Actions
  loginCustomer: (user: CustomerUser) => void;
  logoutCustomer: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;
  addCustomerAddress: (address: Omit<Address, 'id'>) => void;
  updateCustomerAddress: (id: string, address: Partial<Address>) => void;
  deleteCustomerAddress: (id: string) => void;
  deductStoreCredit: (amount: number) => void;
  reorderOrder: (items: any[]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_USD = 150;
const FLAT_SHIPPING_RATE_USD = 15;
const TAX_RATE = 0.08; // 8% standard sales tax

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<Currency>(CURRENCIES[0]);
  const [activeLanguage, setActiveLanguage] = useState<Language>(LANGUAGES[0]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  // Load initial stored states on browser mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('stride_cart') || localStorage.getItem('aura_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('stride_wishlist') || localStorage.getItem('aura_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedSaved = localStorage.getItem('stride_saved_later') || localStorage.getItem('aura_saved_later');
      if (storedSaved) setSavedForLater(JSON.parse(storedSaved));

      const storedRecent = localStorage.getItem('stride_recently_viewed') || localStorage.getItem('aura_recently_viewed');
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

      const storedCurr = localStorage.getItem('stride_currency') || localStorage.getItem('aura_currency');
      if (storedCurr) {
        const found = CURRENCIES.find((c) => c.code === storedCurr);
        if (found) setActiveCurrency(found);
      }

      const storedLang = localStorage.getItem('stride_language') || localStorage.getItem('aura_language');
      if (storedLang) {
        const found = LANGUAGES.find((l) => l.code === storedLang);
        if (found) setActiveLanguage(found);
      }

      const storedCustomer = localStorage.getItem('stride_customer') || localStorage.getItem('aura_customer');
      if (storedCustomer) {
        try {
          const parsed = JSON.parse(storedCustomer);
          if (parsed && Object.keys(parsed).length > 0) {
            setCustomer(parsed);
            setIsCustomerLoggedIn(true);
          }
        } catch (e) {}
      }
    } catch {
      // LocalStorage access issues in private mode
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const serialized = JSON.stringify(cart);
      localStorage.setItem('stride_cart', serialized);
      localStorage.setItem('aura_cart', serialized);
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(wishlist);
      localStorage.setItem('stride_wishlist', serialized);
      localStorage.setItem('aura_wishlist', serialized);
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(savedForLater);
      localStorage.setItem('stride_saved_later', serialized);
      localStorage.setItem('aura_saved_later', serialized);
    } catch {}
  }, [savedForLater]);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(recentlyViewed);
      localStorage.setItem('stride_recently_viewed', serialized);
      localStorage.setItem('aura_recently_viewed', serialized);
    } catch {}
  }, [recentlyViewed]);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const formatPrice = useCallback((amountInUSD: number): string => {
    const converted = amountInUSD * activeCurrency.rate;
    return `${activeCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [activeCurrency]);

  const setCurrency = useCallback((code: Currency['code']) => {
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) {
      setActiveCurrency(found);
      try {
        localStorage.setItem('aura_currency', code);
      } catch {}
      addToast(`Currency switched to ${found.name}`, 'info');
    }
  }, [addToast]);

  const setLanguage = useCallback((code: Language['code']) => {
    const found = LANGUAGES.find((l) => l.code === code);
    if (found) {
      setActiveLanguage(found);
      try {
        localStorage.setItem('aura_language', code);
      } catch {}
      addToast(`Language changed to ${found.name}`, 'info');
    }
  }, [addToast]);

  const addToCart = useCallback((
    product: Product,
    quantity: number = 1,
    selectedOptions?: { [key: string]: string },
    variant?: ProductVariant
  ) => {
    const variantId = variant?.id;
    const itemId = variantId ? `${product.id}-${variantId}` : product.id;
    const itemPrice = variant?.price ?? product.price;
    const originalPrice = variant?.compareAtPrice ?? product.compareAtPrice;
    const maxStock = variant?.stock ?? product.stock;
    const itemImage = variant?.image || product.thumbnail || product.images[0];

    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i));
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          variantId,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: itemImage,
          price: itemPrice,
          originalPrice,
          quantity: Math.min(quantity, maxStock),
          maxStock,
          selectedOptions: selectedOptions || (variant?.selectedOptions ?? {}),
        },
      ];
    });

    trackEcommerceEvent('AddToCart', {
      contentId: product.id,
      contentName: product.name,
      contentType: 'product',
      value: itemPrice * quantity,
      currency: 'USD',
      numItems: quantity,
      contents: [
        {
          id: product.id,
          name: product.name,
          quantity,
          price: itemPrice,
        },
      ],
    });

    addToast(`Added "${product.name}" to cart`, 'success');
    setIsCartDrawerOpen(true);
  }, [addToast]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const validQty = Math.min(quantity, i.maxStock);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    trackEcommerceEvent('RemoveFromCart', {
      contentId: itemId,
    });
    addToast('Item removed from cart', 'info');
  }, [addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const saveForLater = useCallback((itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      setSavedForLater((savedPrev) => [...savedPrev.filter((i) => i.id !== itemId), item]);
      return prev.filter((i) => i.id !== itemId);
    });
    addToast('Moved to Saved for Later', 'info');
  }, [addToast]);

  const moveToCartFromSaved = useCallback((itemId: string) => {
    setSavedForLater((prevSaved) => {
      const item = prevSaved.find((i) => i.id === itemId);
      if (!item) return prevSaved;
      setCart((cartPrev) => [...cartPrev, item]);
      return prevSaved.filter((i) => i.id !== itemId);
    });
    addToast('Moved item back to active cart', 'success');
  }, [addToast]);

  const removeFromSavedForLater = useCallback((itemId: string) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const toggleWishlist = useCallback((productId: string, productName?: string, productPrice?: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast(`Removed "${productName || 'Item'}" from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast(`Saved "${productName || 'Item'}" to wishlist`, 'success');
        trackEcommerceEvent('AddToWishlist', {
          contentId: productId,
          contentName: productName || 'Item',
          value: productPrice || 0,
          currency: 'USD',
        });
        return [...prev, productId];
      }
    });
  }, [addToast]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      if (prev.length > 0 && prev[0] === productId) return prev;
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  }, []);

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      const raw = (cartSubtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    }
    return appliedCoupon.value;
  }, [cartSubtotal, appliedCoupon]);

  const isEligibleForFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD_USD || appliedCoupon?.code === 'FREESHIP';

  const cartShipping = useMemo(() => {
    if (cart.length === 0) return 0;
    if (isEligibleForFreeShipping) return 0;
    return FLAT_SHIPPING_RATE_USD;
  }, [cart.length, isEligibleForFreeShipping]);

  const cartTax = useMemo(() => {
    const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
    return taxableAmount * TAX_RATE;
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    const base = Math.max(0, cartSubtotal - cartDiscount);
    return base + cartShipping + cartTax;
  }, [cartSubtotal, cartDiscount, cartShipping, cartTax]);

  const freeShippingProgress = useMemo(() => {
    if (cartSubtotal >= FREE_SHIPPING_THRESHOLD_USD) return 100;
    return Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD_USD) * 100));
  }, [cartSubtotal]);

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === clean);

    if (!coupon) {
      return { success: false, message: 'Invalid promotional code. Please try another.' };
    }

    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Order subtotal must be at least ${formatPrice(coupon.minSpend)} for this code.`,
      };
    }

    setAppliedCoupon(coupon);
    trackEcommerceEvent('ApplyCoupon', {
      couponCode: coupon.code,
      value: coupon.value,
    });
    addToast(`Coupon "${coupon.code}" applied successfully!`, 'success');
    return { success: true, message: `Applied: ${coupon.description}` };
  }, [cartSubtotal, formatPrice, addToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  }, [addToast]);

  const loginCustomer = useCallback((user: CustomerUser) => {
    setCustomer(user);
    setIsCustomerLoggedIn(true);
    localStorage.setItem('aura_customer', JSON.stringify(user));
    addToast(`Welcome back, ${user.name}`, 'success');
  }, [addToast]);

  const logoutCustomer = useCallback(() => {
    setCustomer(null);
    setIsCustomerLoggedIn(false);
    localStorage.removeItem('aura_customer');
    addToast('Signed out of patron account', 'info');
  }, [addToast]);

  const updateCustomerProfile = useCallback((updates: Partial<CustomerUser>) => {
    setCustomer((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('aura_customer', JSON.stringify(updated));
      return updated;
    });
    addToast('Account profile successfully updated', 'success');
  }, [addToast]);

  const addCustomerAddress = useCallback((addr: Omit<Address, 'id'>) => {
    setCustomer((prev) => {
      if (!prev) return null;
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...addr,
      };
      let addresses = [...prev.addresses];
      if (newAddress.isDefaultShipping) {
        addresses = addresses.map((a) => ({ ...a, isDefaultShipping: false }));
      }
      if (newAddress.isDefaultBilling) {
        addresses = addresses.map((a) => ({ ...a, isDefaultBilling: false }));
      }
      const updated = {
        ...prev,
        addresses: [...addresses, newAddress],
      };
      localStorage.setItem('aura_customer', JSON.stringify(updated));
      return updated;
    });
    addToast('Address added to your address book', 'success');
  }, [addToast]);

  const updateCustomerAddress = useCallback((id: string, updates: Partial<Address>) => {
    setCustomer((prev) => {
      if (!prev) return null;
      let addresses = prev.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefaultShipping) {
        addresses = addresses.map((a) => (a.id !== id ? { ...a, isDefaultShipping: false } : a));
      }
      if (updates.isDefaultBilling) {
        addresses = addresses.map((a) => (a.id !== id ? { ...a, isDefaultBilling: false } : a));
      }
      const updated = { ...prev, addresses };
      localStorage.setItem('aura_customer', JSON.stringify(updated));
      return updated;
    });
    addToast('Address updated successfully', 'success');
  }, [addToast]);

  const deleteCustomerAddress = useCallback((id: string) => {
    setCustomer((prev) => {
      if (!prev) return null;
      const addresses = prev.addresses.filter((a) => a.id !== id);
      const updated = { ...prev, addresses };
      localStorage.setItem('aura_customer', JSON.stringify(updated));
      return updated;
    });
    addToast('Address removed', 'info');
  }, [addToast]);

  const deductStoreCredit = useCallback((amount: number) => {
    setCustomer((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        storeCredit: Math.max(0, (prev.storeCredit || 0) - amount),
      };
      try {
        localStorage.setItem('aura_customer', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const reorderOrder = useCallback((items: any[]) => {
    if (!items || items.length === 0) return;
    items.forEach((item) => {
      const dummyProduct: Partial<Product> = {
        id: item.productId,
        slug: item.productId,
        name: item.name || 'Reordered Item',
        brand: 'Stride District',
        category: 'Streetwear',
        categorySlug: 'curated',
        tags: [],
        price: item.price || 0,
        images: [item.image || ''],
        thumbnail: item.image || '',
        stock: 10,
        stockStatus: 'in_stock' as const,
        badges: [],
        rating: 5,
        reviewCount: 1,
        isFeatured: true,
        options: [],
        specifications: [],
        description: item.name || 'Reordered Item',
      };
      addToCart(dummyProduct as Product, item.quantity || 1, item.selectedOptions);
    });
    setIsCartDrawerOpen(true);
    addToast('Order items re-added to your shopping bag', 'success');
  }, [addToCart, addToast]);

  const contextValue = useMemo(() => ({
    cart,
    wishlist,
    savedForLater,
    recentlyViewed,
    activeCurrency,
    activeLanguage,
    appliedCoupon,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    quickViewProduct,
    toasts,
    customer,
    isCustomerLoggedIn,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    cartItemCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD_USD,
    freeShippingProgress,
    formatPrice,
    setCurrency,
    setLanguage,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCartFromSaved,
    removeFromSavedForLater,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    applyCoupon,
    removeCoupon,
    setIsCartDrawerOpen,
    setIsMobileMenuOpen,
    setIsSearchModalOpen,
    setQuickViewProduct,
    addToast,
    removeToast,
    loginCustomer,
    logoutCustomer,
    updateCustomerProfile,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    deductStoreCredit,
    reorderOrder,
  }), [
    cart,
    wishlist,
    savedForLater,
    recentlyViewed,
    activeCurrency,
    activeLanguage,
    appliedCoupon,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    quickViewProduct,
    toasts,
    customer,
    isCustomerLoggedIn,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    cartItemCount,
    freeShippingProgress,
    formatPrice,
    setCurrency,
    setLanguage,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCartFromSaved,
    removeFromSavedForLater,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    applyCoupon,
    removeCoupon,
    addToast,
    removeToast,
    loginCustomer,
    logoutCustomer,
    updateCustomerProfile,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    deductStoreCredit,
    reorderOrder,
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
