'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';
import { Heart, Trash2, ShoppingBag, ArrowRight, Flame } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, formatPrice, addToast } = useStore();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => addToCart(p, 1));
    addToast(`Added all ${wishlistedProducts.length} saved grails to your shopping bag!`, 'success');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-zinc-200 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-orange-600 font-bold mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Personal Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 font-bold tracking-tight uppercase">
              Saved Grails ({wishlistedProducts.length})
            </h1>
            <p className="text-xs text-zinc-800 font-semibold mt-1">
              Keep an eye on sizes and price drops before they sell out.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bag</span>
            </button>
          )}
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-rose-500">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-lg font-black uppercase text-zinc-900 font-bold">Your Vault is Empty</h2>
            <p className="text-xs text-zinc-800 font-semibold max-w-xs mx-auto leading-relaxed">
              Tap the heart icon on any sneakers, hoodies, or tees across the store to save them here for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-orange-500/60 p-4 flex flex-col justify-between transition-all duration-300 card-hover-lift"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black mb-3">
                    <Image
                      src={product.thumbnail || product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-zinc-50/80 text-rose-400 hover:text-white transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600 font-bold">
                    {product.brand}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-sm font-bold text-zinc-900 font-bold hover:text-orange-600 font-bold transition-colors line-clamp-1 block mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <span className="text-sm font-black text-zinc-900 font-bold font-mono block mt-1">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      addToast(`Added ${product.name} to shopping bag!`, 'success');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
