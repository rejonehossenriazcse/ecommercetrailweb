'use client';

import React from 'react';
import { FilterState } from '@/types';
import { RotateCcw, Star, Check, Flame } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  formatPrice: (amt: number) => string;
  categories?: any[];
  brands?: any[];
}

const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#18181b' },
  { name: 'White', hex: '#f4f4f5' },
  { name: 'Grey', hex: '#71717a' },
  { name: 'Sand', hex: '#d6cfc4' },
  { name: 'Moss', hex: '#4d5d43' },
  { name: 'Obsidian', hex: '#1e293b' },
];

const AVAILABLE_SIZES = ['US 8', 'US 9', 'US 10', 'US 11', 'S', 'M', 'L', 'XL'];

export default function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  formatPrice,
  categories = [],
  brands = [],
}: ProductFiltersProps) {
  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? '' : slug,
    });
  };

  const handleBrandToggle = (brandName: string) => {
    const exists = filters.brands.includes(brandName);
    const updated = exists
      ? filters.brands.filter((b) => b !== brandName)
      : [...filters.brands, brandName];
    onFilterChange({ ...filters, brands: updated });
  };

  const handleColorToggle = (colorName: string) => {
    const exists = filters.colors.includes(colorName);
    const updated = exists
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: updated });
  };

  const handleSizeToggle = (sizeName: string) => {
    const exists = filters.sizes.includes(sizeName);
    const updated = exists
      ? filters.sizes.filter((s) => s !== sizeName)
      : [...filters.sizes, sizeName];
    onFilterChange({ ...filters, sizes: updated });
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-7 text-xs text-zinc-300">
      
      {/* Filter Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <span className="font-black uppercase tracking-wider text-white text-xs flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          Filter Grails
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-black uppercase tracking-wider text-white mb-3 text-[11px]">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategorySelect('')}
            className={`w-full text-left py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
              filters.category === ''
                ? 'bg-orange-500 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`w-full text-left py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                filters.category === cat.slug
                  ? 'bg-orange-500 text-white font-bold shadow-md'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              {cat.itemCount !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  filters.category === cat.slug ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {cat.itemCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Multi-Select */}
      <div>
        <h4 className="font-black uppercase tracking-wider text-white mb-3 text-[11px]">
          Streetwear Brands
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {brands.map((b) => {
            const isSelected = filters.brands.includes(b.name);
            return (
              <button
                key={b.id || b.name}
                onClick={() => handleBrandToggle(b.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white font-bold shadow-sm'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-750'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes Multi-Select */}
      <div>
        <h4 className="font-black uppercase tracking-wider text-white mb-3 text-[11px]">
          Sizes
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-750'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-black uppercase tracking-wider text-white text-[11px]">
            Max Price
          </h4>
          <span className="font-mono font-bold text-orange-400">
            {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              maxPrice: Number(e.target.value),
            })
          }
          className="w-full accent-orange-500 bg-zinc-800 cursor-pointer h-1.5 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
          <span>$50</span>
          <span>$500+</span>
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-2 border-t border-zinc-800">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-bold text-zinc-300 group-hover:text-white">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                inStockOnly: e.target.checked,
              })
            }
            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
}
