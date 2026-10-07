'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Sparkles, ShoppingBag, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export default function DealOfTheDay({ products = [] }: { products?: Product[] }) {
  const { addToCart, formatPrice } = useStore();
  const dealProduct = products.find((p) => p.dealOfTheDay) || products[0];

  if (!dealProduct) return null;

  const claimedCount = 38;
  const totalAllocation = 50;
  const claimedPercent = Math.round((claimedCount / totalAllocation) * 100);

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-white text-zinc-900 overflow-hidden p-6 sm:p-10 lg:p-12 border border-zinc-200/90 shadow-card">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-4/3 lg:aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/80 shadow-soft">
            <Image
              src={dealProduct.images[0]}
              alt={dealProduct.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-950 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-soft">
              Spotlight Deal of the Day
            </div>
          </div>

          {/* Details & Live Inventory Claim */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                <Sparkles className="w-4 h-4 text-zinc-900" />
                <span>{dealProduct.brand} &bull; Limited Allocation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                {dealProduct.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-900">4.9 / 5.0</span>
                <span className="text-xs text-zinc-500">({dealProduct.reviewCount} verified collector reviews)</span>
              </div>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed font-normal">
              {dealProduct.shortDescription}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-900">
                {formatPrice(dealProduct.price)}
              </span>
              {dealProduct.compareAtPrice && (
                <span className="text-lg text-zinc-400 line-through">
                  {formatPrice(dealProduct.compareAtPrice)}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                Save {formatPrice(dealProduct.compareAtPrice! - dealProduct.price)}
              </span>
            </div>

            {/* Stock Progress Bar */}
            <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-700">
                  Claimed: <strong>{claimedCount} of {totalAllocation} units</strong>
                </span>
                <span className="text-zinc-900 font-bold">{claimedPercent}% Claimed</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                  style={{ width: `${claimedPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Guaranteed dispatch within 24 hours with certified tamper-proof seal.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => addToCart(dealProduct, 1)}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-soft active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Claim Spotlight Deal</span>
              </button>
              <Link
                href={`/product/${dealProduct.slug}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer shadow-soft"
              >
                Inspect Specifications
              </Link>
            </div>

            <div className="flex items-center gap-6 text-xs text-zinc-500 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>3-Year Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-zinc-700" />
                <span>Complimentary Express Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
