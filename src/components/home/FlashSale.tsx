'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export default function FlashSale({ products = [] }: { products?: Product[] }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale || p.compareAtPrice);

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-50 to-white border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Live Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 mb-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Limited Drop Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Midnight Flash Release
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Up to 30% off architectural flagships. Once inventory is claimed, prices revert.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1">
              <Clock className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Ends In:</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex flex-col items-center bg-zinc-900 text-white px-3 py-2 rounded-xl min-w-12 shadow-sm">
                <span className="text-lg font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-400">HRS</span>
              </div>
              <span className="text-zinc-400 font-bold">:</span>
              <div className="flex flex-col items-center bg-zinc-900 text-white px-3 py-2 rounded-xl min-w-12 shadow-sm">
                <span className="text-lg font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-400">MIN</span>
              </div>
              <span className="text-zinc-400 font-bold">:</span>
              <div className="flex flex-col items-center bg-rose-600 text-white px-3 py-2 rounded-xl min-w-12 shadow-sm">
                <span className="text-lg font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-widest text-white/80">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <Link
            href="/shop?filter=sale"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>View All Flash Allocations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
