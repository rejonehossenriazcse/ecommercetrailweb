'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';
import {
  Trash2,
  Bookmark,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Flame,
  Plus,
  Minus,
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    savedForLater,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCartFromSaved,
    removeFromSavedForLater,
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

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const recommendations = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-400 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>District Bag</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Shopping Bag ({cartItemCount} Items)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review your grails, apply promotion vouchers, and proceed to insured express checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Your Bag is Empty</h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Discover our latest hype drops of Air Jordan Retros, Dunks, heavyweight fleece hoodies, and tactical accessories.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Items List Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping Tracker */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                  <span>
                    {amountToFreeShipping > 0
                      ? `Add ${formatPrice(amountToFreeShipping)} more for Free Express Worldwide Shipping`
                      : '🔥 Unlocked: Complimentary Insured Express Shipping!'}
                  </span>
                  <span className="font-bold text-orange-400 font-mono">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
                {cart.map((item) => (
                  <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black shrink-0 border border-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">
                              {item.brand}
                            </span>
                            <Link
                              href={`/product/${item.slug}`}
                              className="text-sm sm:text-base font-bold text-white hover:text-orange-400 transition-colors block leading-tight"
                            >
                              {item.name}
                            </Link>
                          </div>
                          <span className="text-base font-black text-white whitespace-nowrap">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        {/* Selected variant pills */}
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mt-2">
                            {Object.entries(item.selectedOptions).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 font-mono text-[11px]"
                              >
                                {k}: <strong className="text-zinc-200">{v}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stepper & Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/80">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-950 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center font-bold text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center font-bold text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs text-zinc-400 font-mono">
                            {formatPrice(item.price)} each
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Save for Later</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved For Later items if any */}
              {savedForLater.length > 0 && (
                <div className="mt-8 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Saved for Later ({savedForLater.length})
                  </h3>
                  <div className="divide-y divide-zinc-800">
                    {savedForLater.map((item) => (
                      <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-800">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.name}</h4>
                            <span className="text-xs font-mono text-orange-400">{formatPrice(item.price)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => moveToCartFromSaved(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider"
                          >
                            Move to Bag
                          </button>
                          <button
                            onClick={() => removeFromSavedForLater(item.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Coupon Checkout */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 space-y-5">
                <h3 className="text-base font-black uppercase text-white tracking-wider">
                  Order Summary
                </h3>

                {/* Promo Coupon Form */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs">
                      <div className="flex items-center gap-2 text-orange-400 font-medium">
                        <Tag className="w-4 h-4" />
                        <span>Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(cartDiscount)})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-zinc-400 hover:text-white underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Voucher code (STREET10)"
                        className="flex-1 bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-xs uppercase rounded-xl focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-400 mt-1 font-medium">{couponError}</p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-white font-mono">{formatPrice(cartSubtotal)}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-orange-400">
                      <span>Promo Savings</span>
                      <span className="font-bold font-mono">-{formatPrice(cartDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-bold font-mono text-white">
                      {cartShipping === 0 ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        formatPrice(cartShipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-3 border-t border-zinc-800">
                    <span>Estimated Total</span>
                    <span className="text-orange-400 font-mono text-lg">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>100% Vault Verified • 256-Bit SSL Protection</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Recommended Streetwear Row */}
        {recommendations.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-800">
            <h3 className="text-xl font-black uppercase text-white mb-6">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
