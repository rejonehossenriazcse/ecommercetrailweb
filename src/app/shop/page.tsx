'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterState, Product, Category, Brand } from '@/types';
import { useStore } from '@/context/StoreContext';
import { BRANDS } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Sparkles,
  Flame,
  Search,
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  category: '',
  brands: [],
  minPrice: 0,
  maxPrice: 500,
  colors: [],
  sizes: [],
  minRating: 0,
  inStockOnly: false,
  searchQuery: '',
  sortBy: 'featured',
};

function ShopContent() {
  const searchParams = useSearchParams();
  const { formatPrice } = useStore();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/v1/products'),
          fetch('/api/v1/categories')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        if (prodData.success) setProducts(prodData.data);
        if (catData.success) setCategories(catData.data);
      } catch (error) {
        console.error('Failed to fetch from backend:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Sync URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const filterParam = searchParams.get('filter');
    const queryParam = searchParams.get('q');

    setFilters((prev) => {
      const updated = { ...prev };
      if (categoryParam) updated.category = categoryParam;
      if (brandParam) updated.brands = [brandParam];
      if (queryParam) updated.searchQuery = queryParam;
      if (filterParam === 'sale') updated.sortBy = 'discount';
      if (filterParam === 'new' || filterParam === 'newest') updated.sortBy = 'newest';
      return updated;
    });
  }, [searchParams]);

  // Compute filtered & sorted products with smart algorithm
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const text = `${product.name} ${product.brand} ${product.category} ${product.tags?.join(' ') || ''} ${product.sku}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      // Category filter
      if (filters.category && product.categorySlug !== filters.category) {
        return false;
      }
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.some((b) => b.toLowerCase() === product.brand.toLowerCase())) {
        return false;
      }
      // Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      // Rating
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && product.stockStatus === 'out_of_stock') {
        return false;
      }
      // Color
      if (filters.colors.length > 0) {
        const colorOpt = product.options.find((o) => o.name === 'Color' || o.name === 'Colorway');
        if (!colorOpt || !colorOpt.values.some((v) => filters.colors.some(c => v.toLowerCase().includes(c.toLowerCase())))) {
          return false;
        }
      }
      // Size
      if (filters.sizes.length > 0) {
        const sizeOpt = product.options.find((o) => o.name === 'Size');
        if (!sizeOpt || !sizeOpt.values.some((v) => filters.sizes.includes(v))) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'discount': {
          const discountA = a.compareAtPrice ? (a.compareAtPrice - a.price) / a.compareAtPrice : 0;
          const discountB = b.compareAtPrice ? (b.compareAtPrice - b.price) / b.compareAtPrice : 0;
          return discountB - discountA;
        }
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 500 ? 1 : 0);

  const resetAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const currentCategoryName =
    categories.find((c) => c.slug === filters.category)?.name || 'Complete Streetwear Vault';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Header Banner */}
        <div className="mb-8 pb-6 border-b border-zinc-800">
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold mb-2 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5" />
            <span>THE DISTRICT RELEASES / {filters.category ? currentCategoryName : 'ALL DROPS'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {currentCategoryName}
              </h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                Verified authentic grails, limited retro kicks, and heavyweight cut-and-sew streetwear.
              </p>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Displaying <strong className="text-orange-400">{filteredProducts.length}</strong> authenticated items
            </div>
          </div>
        </div>

        {/* Control Bar: Filter triggers, Search, Active chips, Sort, View mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          {/* Search Input In Catalog */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters({ ...filters, searchQuery: e.target.value });
                setCurrentPage(1);
              }}
              placeholder="Filter by name, brand, SKU..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl text-xs pl-8 pr-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Active Filter Chips */}
          <div className="hidden lg:flex flex-wrap items-center gap-2">
            {filters.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 text-xs font-semibold">
                Category: {filters.category}
                <button
                  onClick={() => setFilters({ ...filters, category: '' })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 text-xs font-semibold">
                Search: "{filters.searchQuery}"
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: '' })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.brands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 text-xs font-semibold"
              >
                Brand: {b}
                <button
                  onClick={() =>
                    setFilters({ ...filters, brands: filters.brands.filter((item) => item !== b) })
                  }
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer ml-1"
              >
                Reset All ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Grid View Toggle */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Selector */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                aria-label="Sort products by"
                className="appearance-none bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 pr-8 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetAllFilters}
                formatPrice={formatPrice}
                categories={categories}
                brands={BRANDS}
              />
            </div>
          </aside>

          {/* Product Cards Grid */}
          <main className="col-span-1 lg:col-span-9">
            {isLoadingData ? (
              <div className="py-24 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-base font-bold text-white">Authenticating District Vault inventory...</h3>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-24 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8">
                <Sparkles className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">
                  No matching drops found
                </h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
                  Try widening your price range, clearing brand filters, or searching for other streetwear keywords.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-zinc-800 flex items-center justify-between text-xs font-semibold">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1 font-mono">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </main>

        </div>

        {/* Mobile Filters Slide-Over Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-4/5 max-w-sm ml-auto bg-zinc-950 border-l border-zinc-800 h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 text-white">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <h3 className="text-base font-black uppercase text-white">Refine Drops</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetAllFilters}
                formatPrice={formatPrice}
                categories={categories}
                brands={BRANDS}
              />

              <div className="pt-6 mt-6 border-t border-zinc-800">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-orange-600 transition-colors"
                >
                  View {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading District Vault Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
