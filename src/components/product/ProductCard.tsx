'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, formatPrice } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const primaryImage = product.thumbnail || product.images[0];
  const secondaryImage = product.images[1] || primaryImage;

  if (viewMode === 'list') {
    return (
      <div className="group bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-orange-500/60 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-800">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    badge === 'Sale'
                      ? 'bg-rose-500 text-white'
                      : badge === 'New'
                      ? 'bg-lime-400 text-black'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-orange-400 font-mono font-bold uppercase tracking-wider mb-1">
              <span>{product.brand}</span>
              <span className="text-zinc-500 text-[10px]">SKU: {product.sku}</span>
            </div>
            <Link
              href={`/product/${product.slug}`}
              className="text-base sm:text-lg font-bold text-white hover:text-orange-400 line-clamp-1 transition-colors"
            >
              {product.name}
            </Link>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-500">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuickViewProduct(product)}
                className="p-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => addToCart(product, 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Standard)
  return (
    <div
      className="group relative bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-orange-500/60 overflow-hidden flex flex-col transition-all duration-300 card-hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-square w-full bg-black overflow-hidden border-b border-zinc-800/80">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-md ${
                badge === 'Sale'
                  ? 'bg-rose-500 text-white'
                  : badge === 'New'
                  ? 'bg-lime-400 text-black'
                  : badge === 'Trending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
              }`}
            >
              {badge}
            </span>
          ))}
          {discountPercent > 0 && !product.badges.includes('Sale') && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.6)]'
              : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Add to Bag Hover Pill */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900/90 backdrop-blur border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all cursor-pointer active:scale-95"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-orange-400 mb-1">
            <span>{product.brand}</span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In Stock
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="font-bold text-sm text-white hover:text-orange-400 line-clamp-1 block transition-colors leading-tight"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-white">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-zinc-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing and Options */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}
