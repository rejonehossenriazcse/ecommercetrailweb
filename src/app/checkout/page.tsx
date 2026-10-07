'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { trackEcommerceEvent } from '@/lib/tracking';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Tag,
  Check,
  Coins,
  MapPin,
  ChevronDown,
  Building,
  RotateCcw,
  Headphones,
  Copy,
  Zap,
} from 'lucide-react';

const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Insured Streetwear Transit',
    description: 'Tracked ground dispatch via DHL / FedEx with signature confirmation',
    estimatedDays: '3–5 Business Days',
    basePrice: 15,
  },
  {
    id: 'express',
    name: 'Priority Air Express (Vault Verified)',
    description: 'Direct air transit with expedited Vault multi-point inspection',
    estimatedDays: '1–2 Business Days',
    basePrice: 25,
  },
  {
    id: 'courier',
    name: 'VIP Next-Day Guaranteed Courier',
    description: 'Next-day tracked door delivery with legit check seal certificate',
    estimatedDays: 'Next-Day Delivery',
    basePrice: 45,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    customer,
    activeCurrency,
    deductStoreCredit,
    formatPrice,
    addToast,
  } = useStore();

  // If cart is empty, redirect to cart or shop, else track InitiateCheckout
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    } else {
      trackEcommerceEvent('InitiateCheckout', {
        value: cartSubtotal,
        currency: activeCurrency.code,
        numItems: cartItemCount,
        contents: cart.map((i) => ({
          id: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      });
    }
  }, [cart.length, router, cartSubtotal, activeCurrency.code, cartItemCount, cart]);

  // Form states
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customer?.addresses?.[0]?.id || 'custom'
  );

  // Custom shipping address
  const [recipientName, setRecipientName] = useState(customer?.name || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');

  // Shipping Method
  const [shippingMethodId, setShippingMethodId] = useState('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay' | 'bank_wire' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [copiedIban, setCopiedIban] = useState(false);

  // Store Credit & Coupons
  const [useStoreCredit, setUseStoreCredit] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeSettings, setStoreSettings] = useState<any>(null);

  // Fetch live settings (tax rate, free shipping threshold, payment toggles)
  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStoreSettings(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Pre-fill default address if customer has addresses
  useEffect(() => {
    if (customer?.addresses && customer.addresses.length > 0) {
      const defaultAddr = customer.addresses.find((a) => a.isDefaultShipping) || customer.addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setRecipientName(defaultAddr.recipientName);
      setStreet(defaultAddr.street);
      setCity(defaultAddr.city);
      setState(defaultAddr.state);
      setZip(defaultAddr.zip);
      setCountry(defaultAddr.country);
    }
  }, [customer]);

  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId !== 'custom') {
      const found = customer?.addresses?.find((a) => a.id === addrId);
      if (found) {
        setRecipientName(found.recipientName);
        setStreet(found.street);
        setCity(found.city);
        setState(found.state);
        setZip(found.zip);
        setCountry(found.country);
      }
    } else {
      setStreet('');
      setCity('');
      setState('');
      setZip('');
    }
  };

  // Card input formatters & brand detection
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleCardExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)} / ${raw.slice(2)}`;
    }
    setCardExp(raw);
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(raw);
  };

  const getCardBrand = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'Amex';
    return null;
  };

  const handleAutoFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12 / 28');
    setCardCvc('123');
    setError('');
    addToast('Demo test card credentials filled (Stripe Sandbox)', 'info');
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText('CH93 0076 2011 6238 5295 7');
    setCopiedIban(true);
    addToast('Atelier IBAN copied to clipboard!', 'success');
    setTimeout(() => setCopiedIban(false), 2500);
  };

  // Computations
  const freeShippingThreshold = storeSettings?.general?.freeShippingThreshold ?? 150;
  const selectedShipping = SHIPPING_METHODS.find((m) => m.id === shippingMethodId) || SHIPPING_METHODS[0];
  const shippingCost =
    selectedShipping.id === 'standard' && cartSubtotal >= freeShippingThreshold
      ? 0
      : selectedShipping.basePrice;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = (cartSubtotal * appliedCoupon.value) / 100;
    } else {
      couponDiscount = appliedCoupon.value;
    }
  }

  // Tax calculation
  const taxRate = (storeSettings?.general?.taxRatePercent ?? 8) / 100;
  const taxableAmount = Math.max(0, cartSubtotal - couponDiscount);
  const taxCost = taxableAmount * taxRate;

  // Subtotal after coupon, shipping, tax
  const preCreditTotal = taxableAmount + shippingCost + taxCost;

  // Store credit deduction
  const availableCredit = customer?.storeCredit || 0;
  const storeCreditDiscount = useStoreCredit ? Math.min(availableCredit, preCreditTotal) : 0;

  // Grand Total
  const finalTotal = Math.max(0, preCreditTotal - storeCreditDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    if (!res.success) {
      setError(res.message);
    } else {
      setError('');
      setCouponCodeInput('');
      addToast(`Privilege voucher "${couponCodeInput.toUpperCase()}" applied!`, 'success');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Please accept the Terms of Service to finalize your order.');
      return;
    }

    if (!email.trim() || !recipientName.trim() || !street.trim() || !city.trim() || !zip.trim()) {
      setError('Please ensure all required dispatch address fields are filled.');
      return;
    }

    // Validate card only if not zero-due and card is selected
    if (finalTotal > 0 && paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setError('Please enter a valid 16-digit credit card number.');
        return;
      }
      if (cardExp.replace(/\s/g, '').length < 5) {
        setError('Please enter a valid expiry date (MM / YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setError('Please enter a valid 3 or 4-digit security code (CVC).');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const paymentMethodDisplay =
        finalTotal === 0
          ? 'Store Credit / Privilege Voucher (Zero Due)'
          : paymentMethod === 'card'
          ? 'Stripe Credit Card'
          : paymentMethod === 'paypal'
          ? 'PayPal Express'
          : paymentMethod === 'apple_pay'
          ? 'Apple Pay / Device Vault'
          : paymentMethod === 'bank_wire'
          ? 'Direct Bank Wire (IBAN/BIC)'
          : 'Cash on Delivery';

      const paymentStatusFinal =
        finalTotal === 0 || paymentMethod === 'card' || paymentMethod === 'paypal' || paymentMethod === 'apple_pay'
          ? 'paid'
          : 'pending';

      const orderPayload = {
        customerName: recipientName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim() || '+1 (415) 555-0192',
        currency: activeCurrency.code,
        currencySymbol: activeCurrency.symbol,
        currencyRate: activeCurrency.rate,
        subtotal: cartSubtotal,
        discount: couponDiscount + storeCreditDiscount,
        shipping: shippingCost,
        tax: taxCost,
        total: finalTotal,
        paymentStatus: paymentStatusFinal,
        paymentMethod: paymentMethodDisplay,
        couponCode: appliedCoupon?.code,
        notes: orderNotes.trim(),
        carrier: 'DHL Express Priority',
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim() || 'CA',
          zip: zip.trim(),
          country: country.trim(),
        },
        billingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim() || 'CA',
          zip: zip.trim(),
          country: country.trim(),
        },
        items: cart.map((item) => ({
          id: item.id,
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.id,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          selectedOptions: item.selectedOptions,
        })),
      };

      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit order. Please retry.');
      }

      // Order created successfully!
      const createdOrder = json.data;

      // Deduct customer store credit if used
      if (storeCreditDiscount > 0) {
        deductStoreCredit(storeCreditDiscount);
      }

      trackEcommerceEvent('Purchase', {
        eventId: `pur_${createdOrder.id}`,
        contentId: createdOrder.id,
        value: finalTotal,
        currency: activeCurrency.code,
        numItems: createdOrder.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0),
        userEmail: email.trim(),
        userPhone: phone.trim(),
        couponCode: appliedCoupon?.code,
        contents: createdOrder.items.map((i: any) => ({
          id: i.productId || i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      clearCart();
      addToast(`Order ${createdOrder.orderNumber} successfully confirmed!`, 'success');
      router.push(`/checkout/success/${createdOrder.id}`);
    } catch (err: any) {
      setError(err.message || 'Payment authorization failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-2">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          District Express Checkout
        </h1>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span className="flex-1 font-medium">{error}</span>
          <button onClick={() => setError('')} className="text-rose-400 hover:text-white font-bold">
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Details (Steps 1 to 4) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* STEP 1: Contact Information */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-mono text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Contact Information
                </h2>
              </div>
              {!customer && (
                <Link href="/login" className="text-xs font-semibold text-orange-400 hover:underline">
                  Already have an account? Sign in
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Phone Number (SMS Drop Alerts)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (415) 555-0192"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: Delivery & Shipping Address */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono tracking-wider">
                  Dispatch & Delivery Address
                </h2>
              </div>
              <MapPin className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Address Selector if customer has multiple saved addresses */}
            {customer && customer.addresses.length > 0 && (
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-2">Saved Addresses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {customer.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'border-zinc-900 bg-zinc-50/80 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-900">{addr.title}</span>
                        {selectedAddressId === addr.id && (
                          <span className="w-2 h-2 rounded-full bg-zinc-900" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 leading-relaxed truncate">
                        {addr.recipientName} • {addr.street}, {addr.city}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => handleAddressSelect('custom')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center text-xs font-semibold ${
                      selectedAddressId === 'custom'
                        ? 'border-zinc-900 bg-zinc-50/80 text-zinc-900'
                        : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    + Enter New Address
                  </div>
                </div>
              </div>
            )}

            {/* Address Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-600 mb-1">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="742 Montgomery Street, Suite 400"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-600 mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-600 mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="94111"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-600 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Shipping Method Selection */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono tracking-wider">
                Shipping Carrier & Tier
              </h2>
            </div>

            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => {
                const isSelected = shippingMethodId === method.id;
                const isFree = method.id === 'standard' && cartSubtotal >= freeShippingThreshold;

                return (
                  <div
                    key={method.id}
                    onClick={() => setShippingMethodId(method.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${isSelected ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{method.name}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{method.description}</div>
                        <div className="text-[10px] text-amber-700 font-mono font-semibold mt-1">
                          Est. Transit: {method.estimatedDays}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isFree ? (
                        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          FREE
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-zinc-900">
                          {formatPrice(method.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Payment Gateway */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono tracking-wider">
                  Payment Method
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>PCI-DSS Level 1 Encrypted</span>
              </div>
            </div>

            {/* Zero Due State Banner */}
            {finalTotal === 0 ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold block">Complimentary Order • Zero Balance Due</span>
                  Your balance is 100% covered by your Store Credit and/or Privilege Voucher. No payment method required.
                </div>
              </div>
            ) : (
              <>
                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'paypal'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <span className="font-bold font-mono text-xs">PayPal</span>
                    <span className="text-[10px] opacity-80">Express</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs"> Pay</span>
                    <span className="text-[10px] opacity-80">1-Touch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_wire')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'bank_wire'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Bank Wire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                      paymentMethod === 'cod'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Courier COD</span>
                  </button>
                </div>

                {/* Credit Card Input Sub-form */}
                {paymentMethod === 'card' && (
                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">Card Credentials</span>
                        {getCardBrand(cardNumber) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-white">
                            {getCardBrand(cardNumber)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillTestCard}
                        className="text-[11px] font-mono font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Auto-Fill Test Card</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 tracking-wider"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-zinc-600 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM / YY"
                          value={cardExp}
                          onChange={handleCardExpChange}
                          maxLength={7}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-600 mb-1">Security Code (CVC)</label>
                        <input
                          type="password"
                          required
                          placeholder="•••"
                          value={cardCvc}
                          onChange={handleCardCvcChange}
                          maxLength={4}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Express */}
                {paymentMethod === 'paypal' && (
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-center space-y-2.5 mt-4">
                    <div className="inline-flex items-center gap-1.5 font-bold text-sm text-[#003087] font-mono">
                      <span>PayPal</span>
                      <span className="text-[#0079C1]">Express</span>
                    </div>
                    <p className="text-xs text-blue-950 font-medium">
                      One-click tokenized checkout authenticated via your PayPal account. Balance or linked cards will be charged securely upon confirmation.
                    </p>
                  </div>
                )}

                {/* Apple Pay / Google Pay */}
                {paymentMethod === 'apple_pay' && (
                  <div className="p-5 rounded-2xl bg-zinc-100 border border-zinc-200 text-center space-y-2.5 mt-4">
                    <div className="font-bold text-sm text-zinc-900"> Pay / Device Wallet</div>
                    <p className="text-xs text-zinc-700 font-medium">
                      Biometric Touch ID / Face ID prompt will trigger instantly upon submitting the order.
                    </p>
                  </div>
                )}

                {/* Direct Bank Wire */}
                {paymentMethod === 'bank_wire' && (
                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-zinc-900 font-mono">
                        Atelier Direct Swiss Bank Wire
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="text-[11px] font-mono font-bold text-zinc-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-zinc-200"
                      >
                        {copiedIban ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIban ? 'IBAN Copied!' : 'Copy IBAN'}</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-zinc-200/80 font-mono text-[11px] space-y-1 text-zinc-700">
                      <div><span className="text-zinc-400">Beneficiary:</span> AURA Studios AG (Atelier Vault)</div>
                      <div><span className="text-zinc-400">Bank:</span> UBS Switzerland AG, Zurich Head Office</div>
                      <div><span className="text-zinc-400">IBAN:</span> <strong className="text-zinc-900">CH93 0076 2011 6238 5295 7</strong></div>
                      <div><span className="text-zinc-400">BIC / SWIFT:</span> <strong className="text-zinc-900">UBSWCHZH80A</strong></div>
                      <div><span className="text-zinc-400">Reference:</span> Will match your Consignment Order Number</div>
                    </div>

                    <p className="text-[11px] text-zinc-500">
                      Your items will be reserved immediately in our Vault and air-dispatched upon electronic wire settlement.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery / Concierge */}
                {paymentMethod === 'cod' && (
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 mt-4">
                    <div className="text-xs font-bold text-amber-950 font-mono">
                      White-Glove Courier Hand Settlement
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Payment is collected directly upon scheduled hand delivery by our bonded specialist courier. You will receive an SMS phone confirmation to coordinate arrival.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Optional Order Notes */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase font-mono text-zinc-900">
              Special Handling Instructions & Gift Packaging (Optional)
            </h3>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Include handwritten gift archival card or gate delivery instructions..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {/* Terms & Submit button */}
          <div className="space-y-4">
            <label className="flex items-start gap-2.5 text-xs text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 mt-0.5"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms-of-service" target="_blank" className="font-bold text-zinc-900 underline">
                  Terms of Service
                </Link>
                , acknowledge the{' '}
                <Link href="/refund-policy" target="_blank" className="font-bold text-zinc-900 underline">
                  30-Day Risk-Free Return Guarantee
                </Link>
                , and authorize charge.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {finalTotal === 0
                      ? 'Complete Acquisition (Zero Due • $0.00)'
                      : paymentMethod === 'paypal'
                      ? `Pay with PayPal Express • ${formatPrice(finalTotal)}`
                      : paymentMethod === 'apple_pay'
                      ? `Pay with Pay • ${formatPrice(finalTotal)}`
                      : paymentMethod === 'bank_wire'
                      ? `Confirm Order & Receive Wire Dossier • ${formatPrice(finalTotal)}`
                      : paymentMethod === 'cod'
                      ? `Confirm Order (Pay on Delivery) • ${formatPrice(finalTotal)}`
                      : `Authorize Payment & Place Order • ${formatPrice(finalTotal)}`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Sticky Order Summary & Vouchers */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase font-mono tracking-wider">
                Bag Summary ({cartItemCount})
              </h3>
              <Link href="/cart" className="text-xs font-semibold text-amber-600 hover:underline">
                Edit Bag
              </Link>
            </div>

            {/* Items List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/60">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-zinc-900 text-white text-[9px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{item.name}</h4>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {item.brand || 'Standard Edition'}
                      </div>
                      {item.selectedOptions && (
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {Object.values(item.selectedOptions).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-zinc-900 font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher Input */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. WELCOME10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 uppercase font-mono focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-mono text-emerald-700 hover:underline font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Store Credit Toggle for Patrons */}
              {customer && customer.storeCredit > 0 && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-amber-950 font-mono">Apply Store Credit</div>
                      <div className="text-[11px] text-amber-800">Available: ${customer.storeCredit.toFixed(2)}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useStoreCredit}
                    onChange={(e) => setUseStoreCredit(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-zinc-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Privilege Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono font-medium">-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              {storeCreditDiscount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Patron Store Credit Applied</span>
                  <span className="font-mono font-medium">-{formatPrice(storeCreditDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span>Insured Dispatch ({selectedShipping.name.split(' ')[0]})</span>
                <span className="font-mono font-medium text-zinc-900">
                  {shippingCost === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Estimated Sales Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span className="font-mono font-medium text-zinc-900">{formatPrice(taxCost)}</span>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-between items-baseline text-sm font-bold text-zinc-900">
                <span>Total Acquisition Cost</span>
                <span className="text-lg font-mono font-black">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted PCI Vault • 30-Day Risk-Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
