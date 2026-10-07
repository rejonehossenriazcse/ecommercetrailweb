'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { PRODUCTS } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import { Plus, Check, ShoppingBag, Flame } from 'lucide-react';

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
}

export default function FrequentlyBoughtTogether({ mainProduct }: FrequentlyBoughtTogetherProps) {
  const { addToCart, formatPrice, addToast } = useStore();

  // If specific complementary products not set, pick 2 other products from different categories
  const complementaryProducts = mainProduct.frequentlyBoughtTogetherIds && mainProduct.frequentlyBoughtTogetherIds.length > 0
    ? PRODUCTS.filter((p) => mainProduct.frequentlyBoughtTogetherIds?.includes(p.id))
    : PRODUCTS.filter((p) => p.id !== mainProduct.id && p.categorySlug !== mainProduct.categorySlug).slice(0, 2);

  const allBundleProducts = [mainProduct, ...complementaryProducts];
  const [selectedIds, setSelectedIds] = useState<string[]>(allBundleProducts.map((p) => p.id));

  if (complementaryProducts.length === 0) return null;

  const toggleSelect = (id: string) => {
    if (id === mainProduct.id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = allBundleProducts.filter((p) => selectedIds.includes(p.id));
  const rawTotal = selectedItems.reduce((sum, p) => sum + p.price, 0);

  // 10% bundle discount if 2 or more items are selected
  const hasBundleDiscount = selectedItems.length >= 2;
  const bundleDiscount = hasBundleDiscount ? rawTotal * 0.1 : 0;
  const finalBundlePrice = rawTotal - bundleDiscount;

  const handleAddBundleToCart = () => {
    selectedItems.forEach((p) => addToCart(p, 1));
    addToast(
      `Added ${selectedItems.length} items to bag with 10% bundle savings!`,
      'success'
    );
  };

  return (
    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-xl text-white">
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-400 mb-2">
        <Flame className="w-4 h-4" />
        <span>Complete The District Fit</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mb-6">
        Frequently Paired Together
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Cards Row */}
        <div className="lg:col-span-8 flex flex-wrap items-center gap-3 sm:gap-4">
          {allBundleProducts.map((p, idx) => {
            const isSelected = selectedIds.includes(p.id);
            const isMain = p.id === mainProduct.id;
            return (
              <React.Fragment key={p.id}>
                {idx > 0 && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 text-sm font-bold">
                    +
                  </div>
                )}
                <div
                  onClick={() => !isMain && toggleSelect(p.id)}
                  className={`group relative w-32 sm:w-36 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                      : 'bg-zinc-950/50 border-zinc-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black mb-2">
                    <Image
                      src={p.thumbnail || p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-zinc-800 border border-zinc-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-orange-400">
                    {formatPrice(p.price)}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Pricing & Add to Bag CTA */}
        <div className="lg:col-span-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Bundle Summary ({selectedItems.length} Items)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {formatPrice(finalBundlePrice)}
              </span>
              {hasBundleDiscount && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatPrice(rawTotal)}
                </span>
              )}
            </div>
            {hasBundleDiscount && (
              <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                Bundle perk: Save {formatPrice(bundleDiscount)} (10% off)
              </span>
            )}
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Bundle to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
