'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { trackEcommerceEvent } from '@/lib/tracking';
import { Search, X, ArrowRight, Flame, Sparkles, ShoppingBag } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Air Jordan 1',
  'Nike Dunk Low Panda',
  'Yeezy Slide Bone',
  'Stussy World Tour',
  'Supreme Box Logo',
  'Fear of God Essentials',
  'New Balance 9060',
];

export default function SearchModal() {
  const router = useRouter();
  const { isSearchModalOpen, setIsSearchModalOpen, formatPrice, addToCart } = useStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSearchModalOpen]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Track search query with debouncing
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;
    const timer = setTimeout(() => {
      trackEcommerceEvent('Search', {
        searchQuery: query.trim(),
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchModalOpen) return null;

  // Search matching algorithm
  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const text = `${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')} ${p.sku}`.toLowerCase();
    return text.includes(q);
  }).slice(0, 6);

  const handleSelectProduct = (slug: string) => {
    setIsSearchModalOpen(false);
    router.push(`/product/${slug}`);
  };

  const handleSelectTag = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-zinc-50 border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-zinc-900 font-bold"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kicks, hoodies, tees, Dunks, Jordan..."
            className="w-full bg-transparent text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium text-sm md:text-base font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-800 font-semibold hover:text-zinc-900 font-bold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-100 text-zinc-800 font-semibold hover:text-zinc-900 font-bold transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-200/80 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white font-bold'
                : 'bg-zinc-100 text-zinc-600 hover:text-white'
            }`}
          >
            All Drops
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === c.slug
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-600 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Popular searches suggestions */}
          {!query.trim() && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-zinc-800 font-semibold font-bold mb-3">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectTag(term)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-300/60 text-xs text-zinc-800 font-bold hover:text-orange-600 font-bold transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results list */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-800 font-semibold font-bold mb-3">
              <span>{query.trim() ? `Found ${filteredProducts.length} Results` : 'Recommended Drops'}</span>
              {filteredProducts.length > 0 && query.trim() && (
                <Link
                  href={`/shop?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setIsSearchModalOpen(false)}
                  className="text-orange-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  View All in Catalog <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-zinc-800 font-semibold font-medium text-sm">
                No matching streetwear found for "{query}". Try searching for Jordan, Dunks, Stussy, or Essentials.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.slug)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-100/50 hover:bg-zinc-100 border border-zinc-200/80 hover:border-orange-500/50 transition-all cursor-pointer"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0">
                      <Image
                        src={p.thumbnail || p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold font-bold block truncate">
                        {p.brand}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 font-bold group-hover:text-orange-600 font-bold truncate transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-zinc-900 font-bold">{formatPrice(p.price)}</span>
                        {p.compareAtPrice && (
                          <span className="text-[10px] text-zinc-800 font-semibold font-medium line-through">
                            {formatPrice(p.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 bg-white border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-800 font-semibold font-medium">
          <span>Tip: Press ESC anytime to exit</span>
          <Link
            href="/shop"
            onClick={() => setIsSearchModalOpen(false)}
            className="text-orange-600 font-bold hover:text-orange-300 font-bold flex items-center gap-1"
          >
            Explore Complete Lookbook <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
