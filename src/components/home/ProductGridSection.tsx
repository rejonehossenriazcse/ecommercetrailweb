'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Sparkles, Flame, Trophy, ArrowRight } from 'lucide-react';

export default function ProductGridSection({
  title = 'Flagship Curation',
  subtitle = 'Studio Releases',
  products = [],
}: {
  title?: string;
  subtitle?: string;
  products?: Product[];
}) {
  const [activeTab, setActiveTab] = useState<'trending' | 'bestsellers' | 'new'>('trending');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return products.filter((p) => p.badges.includes('Best Seller'));
      case 'new':
        return products.filter((p) => p.badges.includes('New'));
      case 'trending':
      default:
        return products.filter((p) => p.isFeatured);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
            <span>{subtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-2xl border border-zinc-200/80">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'trending'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'bestsellers'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Best Sellers</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'new'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>New In</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-black py-3 px-6 rounded-2xl border border-zinc-300 hover:border-zinc-900 transition-all cursor-pointer"
        >
          <span>Explore All 24 Flagship Designs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
