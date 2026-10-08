'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Minus, Flame } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    freeShippingProgress,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-zinc-900 font-bold shadow-2xl flex flex-col h-full border-l border-zinc-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold uppercase tracking-wider text-zinc-900 font-bold">
                Your Bag ({cartItemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-zinc-800 font-semibold hover:text-zinc-900 font-bold hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3.5 bg-zinc-50/90 border-b border-zinc-200">
            <div className="flex justify-between items-center text-xs font-medium text-zinc-800 font-bold mb-1.5">
              <span>
                {amountToFreeShipping > 0
                  ? `Add ${formatPrice(amountToFreeShipping)} more for Free Express Shipping`
                  : '🔥 Unlocked: Free Express Worldwide Shipping!'}
              </span>
              <span className="font-bold text-orange-600 font-bold font-mono">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-200/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-4 text-zinc-800 font-semibold font-medium">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 font-bold mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-800 font-semibold max-w-xs mb-6">
                  Check out the latest hype drops and grab limited pairs before they sell out.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Explore Drops
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-bold text-zinc-900 font-bold hover:text-orange-600 font-bold transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-800 font-semibold font-medium hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant options if any */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-2 text-[10px] text-zinc-800 font-semibold mt-1">
                          {Object.entries(item.selectedOptions).map(([k, v]) => (
                            <span key={k} className="px-1.5 py-0.5 rounded bg-zinc-50 border border-zinc-200">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-800 font-semibold hover:text-zinc-900 font-bold transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-zinc-900 font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-800 font-semibold hover:text-zinc-900 font-bold transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-zinc-900 font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50/60 space-y-4">
              
              {/* Promo code form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs">
                    <div className="flex items-center gap-2 text-orange-600 font-bold font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Promo <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(cartDiscount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-800 font-semibold hover:text-zinc-900 font-bold text-xs underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Promo code (e.g. STREET10)"
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl text-xs font-bold uppercase transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{couponError}</p>
                )}
              </div>

              {/* Summary breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-800 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 font-bold">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-orange-600 font-bold font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="font-semibold text-zinc-900 font-bold">
                    {cartShipping === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatPrice(cartShipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-900 font-bold pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span className="text-orange-600 font-bold">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout & Bag links */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-bold text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  View Full Bag Details
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-800 font-semibold font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600 font-bold" />
                <span>256-Bit SSL Encrypted • 100% Authentic Guaranteed</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
