'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { cartItemCount, wishlist, setIsSearchModalOpen, setIsCartDrawerOpen } = useStore();

  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isWishlist = pathname === '/wishlist';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 px-3 pt-2 pb-3 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      aria-label="Mobile Navigation"
    >
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all active:scale-90 ${
          isHome
            ? 'text-orange-400 font-bold bg-zinc-900'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Home</span>
      </Link>

      {/* Shop */}
      <Link
        href="/shop"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all active:scale-90 ${
          isShop
            ? 'text-orange-400 font-bold bg-zinc-900'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Drops</span>
      </Link>

      {/* Search Trigger */}
      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-90"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Search</span>
      </button>

      {/* Wishlist */}
      <Link
        href="/wishlist"
        className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all active:scale-90 ${
          isWishlist
            ? 'text-orange-400 font-bold bg-zinc-900'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[8px] font-mono font-bold flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Saved</span>
      </Link>

      {/* Cart Drawer */}
      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-90"
        aria-label="Shopping Bag"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-orange-500 text-white text-[8px] font-mono font-bold flex items-center justify-center shadow-xs">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Bag</span>
      </button>
    </nav>
  );
}
