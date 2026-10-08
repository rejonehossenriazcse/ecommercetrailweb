'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductVariant } from '@/types';
import { X, Star, Heart, ShoppingBag, ArrowRight, Check, Flame } from 'lucide-react';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
  } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.images[0] || quickViewProduct.thumbnail);
      const defaults: { [key: string]: string } = {};
      quickViewProduct.options.forEach((opt) => {
        if (opt.values.length > 0) defaults[opt.name] = opt.values[0];
      });
      setSelectedOptions(defaults);
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentVariant: ProductVariant | undefined = quickViewProduct.variants.find((v) => {
    return Object.entries(selectedOptions).every(
      ([key, val]) => v.selectedOptions[key] === val
    );
  });

  const activePrice = currentVariant?.price ?? quickViewProduct.price;
  const activeCompareAt = currentVariant?.compareAtPrice ?? quickViewProduct.compareAtPrice;
  const activeStock = currentVariant?.stock ?? quickViewProduct.stock;
  const isWishlisted = isInWishlist(quickViewProduct.id);

  const discountPercent = activeCompareAt
    ? Math.round(((activeCompareAt - activePrice) / activeCompareAt) * 100)
    : 0;

  const handleOptionChange = (optionName: string, value: string) => {
    const updated = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(updated);

    const variantMatch = quickViewProduct.variants.find((v) =>
      Object.entries(updated).every(([k, val]) => v.selectedOptions[k] === val)
    );
    if (variantMatch?.image) {
      setSelectedImage(variantMatch.image);
    }
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedOptions, currentVariant);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-zinc-50 border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] text-zinc-900 font-bold"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-800 font-bold hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery column */}
        <div className="w-full md:w-1/2 p-6 bg-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-zinc-200">
            <Image
              src={selectedImage || quickViewProduct.thumbnail}
              alt={quickViewProduct.name}
              fill
              className="object-cover"
              priority
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-orange-500 ring-1 ring-orange-500'
                      : 'border-zinc-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-orange-600 font-bold font-bold mb-1">
                <span>{quickViewProduct.brand}</span>
                <span className="text-zinc-800 font-semibold font-medium">SKU: {quickViewProduct.sku}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 font-bold leading-tight uppercase">
                {quickViewProduct.name}
              </h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-900 font-bold">{quickViewProduct.rating.toFixed(1)}</span>
              <span className="text-xs text-zinc-800 font-semibold font-medium">({quickViewProduct.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-black text-zinc-900 font-bold">{formatPrice(activePrice)}</span>
              {activeCompareAt && (
                <span className="text-sm text-zinc-800 font-semibold font-medium line-through">
                  {formatPrice(activeCompareAt)}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-800 font-semibold leading-relaxed">
              {quickViewProduct.shortDescription || quickViewProduct.description}
            </p>

            {/* Options Selection */}
            {quickViewProduct.options.map((opt) => (
              <div key={opt.name} className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-800 font-bold uppercase tracking-wider">{opt.name}:</span>
                  <span className="font-mono text-orange-600 font-bold font-bold">{selectedOptions[opt.name]}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => {
                    const isSelected = selectedOptions[opt.name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(opt.name, val)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-white border border-zinc-300/50'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-medium">
                In Stock & Ready to Ship (Vault Verified)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 mt-6 border-t border-zinc-200 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              href={`/product/${quickViewProduct.slug}`}
              onClick={() => setQuickViewProduct(null)}
              className="flex items-center justify-center gap-1.5 text-xs text-zinc-800 font-semibold hover:text-orange-600 font-bold transition-colors uppercase font-bold tracking-wider pt-1"
            >
              <span>View Full Lookbook & Tech Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
