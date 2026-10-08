'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { CURRENCIES, LANGUAGES, CATEGORIES } from '@/data/mockData';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Globe,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Flame,
  ArrowRight,
  Check,
  Copy,
  Zap,
  LogOut,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cartItemCount,
    wishlist,
    setIsCartDrawerOpen,
    setIsSearchModalOpen,
    activeCurrency,
    setCurrency,
    activeLanguage,
    setLanguage,
    customer,
    logoutCustomer,
    addToast,
    formatPrice,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const currencyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Track scroll position for header glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaCategory(null);
  }, [pathname]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    addToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(headerSearchQuery.trim())}`);
      setHeaderSearchQuery('');
    }
  };

  const isHome = pathname === '/';

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-300">
      {/* 1. TOP MARQUEE & UTILITY BAR */}
      <div className="bg-black text-zinc-400 font-medium border-b border-zinc-800 text-[11px] py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Announcement & 1-Click Promo */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 text-orange-500 font-bold uppercase tracking-wider shrink-0">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-500" />
              <span>LIMITED DROP:</span>
            </div>
            <p className="truncate text-zinc-100 font-bold">
              Jordan Retro 4 & Stussy Fleece drops live | Complimentary insured shipping over $150
            </p>
            <button
              onClick={() => handleCopyCoupon('STREET10')}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-950 hover:bg-orange-500 hover:border-orange-500 text-white font-mono text-[10px] font-bold transition-all cursor-pointer active:scale-95"
              title="Click to copy 10% coupon"
            >
              {copiedCoupon ? (
                <>
                  <Check className="w-3 h-3 text-zinc-900 font-bold" />
                  <span className="text-zinc-900 font-bold">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-900 font-bold" />
                  <span className="text-zinc-900 font-bold">USE 'STREET10' FOR 10% OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Right Utility: Currency Switcher & VIP Help */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            {/* Currency Selector */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-mono">{activeCurrency.symbol}</span>
                <span>{activeCurrency.code}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-zinc-100 transition-colors ${
                        activeCurrency.code === c.code ? 'text-orange-400 font-bold bg-zinc-100/50' : 'text-zinc-700'
                      }`}
                    >
                      <span>{c.code} ({c.symbol})</span>
                      {activeCurrency.code === c.code && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/faq" className="hover:text-white transition-colors">
              Help & FAQ
            </Link>
            <Link href="/track" className="hover:text-white transition-colors flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-500 font-bold" />
              Track Drop
            </Link>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <nav
        className={`w-full border-b transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-zinc-850 shadow-2xl py-3'
            : 'bg-white/90 backdrop-blur-sm border-zinc-200 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Trigger & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-zinc-800 font-semibold hover:text-zinc-950 transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center font-black text-black text-xl italic shadow-[0_0_15px_rgba(249,115,22,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tighter text-zinc-950 uppercase leading-none">
                    STRIDE<span className="text-orange-500">DISTRICT</span>
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-800 font-semibold uppercase leading-none mt-0.5">
                    Hype & Culture Drops
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Nav Categories */}
            <div className="hidden lg:flex items-center gap-7">
              <Link
                href="/shop"
                className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-orange-400 ${
                  pathname === '/shop' ? 'text-orange-500' : 'text-zinc-700'
                }`}
              >
                Shop All
              </Link>

              {/* Dropdown for Sneakers */}
              <div
                className="relative group py-2"
                onMouseEnter={() => setActiveMegaCategory('sneakers')}
                onMouseLeave={() => setActiveMegaCategory(null)}
              >
                <Link
                  href="/shop?category=sneakers"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-bold group-hover:text-orange-600 font-bold transition-colors flex items-center gap-1"
                >
                  Sneakers <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                </Link>

                {activeMegaCategory === 'sneakers' && (
                  <div className="absolute top-full left-0 w-64 bg-zinc-50 border border-zinc-200 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-800 font-semibold font-medium px-3 py-1">
                      Sneaker Collections
                    </div>
                    <Link
                      href="/shop?category=sneakers"
                      className="block px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 hover:text-orange-600 font-bold rounded-lg transition-colors"
                    >
                      All Sneakers & Grails
                    </Link>
                    <Link
                      href="/shop?category=sneakers&brand=Jordan"
                      className="block px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 hover:text-orange-600 font-bold rounded-lg transition-colors"
                    >
                      Air Jordan Retros
                    </Link>
                    <Link
                      href="/shop?category=sneakers&brand=Nike"
                      className="block px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 hover:text-orange-600 font-bold rounded-lg transition-colors"
                    >
                      Nike Dunks & Lows
                    </Link>
                    <Link
                      href="/shop?category=sneakers&brand=New%20Balance"
                      className="block px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 hover:text-orange-600 font-bold rounded-lg transition-colors"
                    >
                      New Balance 9060 & 2002R
                    </Link>
                    <Link
                      href="/shop?category=sneakers&brand=Adidas"
                      className="block px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 hover:text-orange-600 font-bold rounded-lg transition-colors"
                    >
                      Yeezy Slides & Foam
                    </Link>
                  </div>
                )}
              </div>

              {/* Hoodies */}
              <Link
                href="/shop?category=hoodies"
                className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-bold hover:text-orange-600 font-bold transition-colors"
              >
                Hoodies & Fleece
              </Link>

              {/* T-Shirts */}
              <Link
                href="/shop?category=t-shirts"
                className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-bold hover:text-orange-600 font-bold transition-colors"
              >
                T-Shirts
              </Link>

              {/* Accessories */}
              <Link
                href="/shop?category=accessories"
                className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-bold hover:text-orange-600 font-bold transition-colors"
              >
                Accessories
              </Link>

              {/* Hot Drops / Sale */}
              <Link
                href="/shop?filter=sale"
                className="text-xs font-bold uppercase tracking-wider text-orange-600 font-bold hover:text-orange-300 transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                Sale / Drops
              </Link>
            </div>

            {/* Right: Search, Wishlist, Bag, Account */}
            <div className="flex items-center gap-3">
              
              {/* Desktop Live Search Input */}
              <form onSubmit={handleHeaderSearch} className="hidden md:flex relative items-center">
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder="Search Jordan, Dunks, Hoodies..."
                  className="bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-800 font-semibold font-medium text-xs rounded-full pl-9 pr-8 py-2 w-48 lg:w-60 focus:w-72 focus:outline-none focus:border-orange-500 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-zinc-800 font-semibold absolute left-3 pointer-events-none" />
                {headerSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setHeaderSearchQuery('')}
                    className="absolute right-3 text-zinc-800 font-semibold font-medium hover:text-zinc-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </form>

              {/* Search Modal Trigger on Mobile / Tablet */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden p-2 rounded-full text-zinc-800 font-semibold hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer"
                title="Search (Cmd+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full text-zinc-800 font-semibold hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
                title="Saved Items"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 rounded-full text-zinc-800 font-semibold hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer active:scale-95"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.6)]">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-2 rounded-full text-zinc-800 font-semibold hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center"
                  title="Account"
                >
                  <User className="w-5 h-5" />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-50 border border-zinc-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {customer ? (
                      <>
                        <div className="px-4 py-2 border-b border-zinc-200">
                          <p className="text-xs font-bold text-zinc-950 truncate">{customer.name}</p>
                          <p className="text-[10px] text-zinc-800 font-semibold truncate">{customer.email}</p>
                          <span className="inline-block mt-1 text-[9px] font-mono uppercase bg-orange-500/20 text-orange-600 font-bold px-2 py-0.5 rounded font-bold">
                            {customer.tier} Member
                          </span>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-zinc-800 font-bold hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                        >
                          Orders & Profile
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-zinc-800 font-bold hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                        >
                          Saved Drops ({wishlist.length})
                        </Link>
                        <button
                          onClick={() => {
                            logoutCustomer();
                            setIsAccountMenuOpen(false);
                            addToast('Signed out of District account', 'info');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-zinc-100 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="p-3 text-center">
                        <p className="text-xs font-semibold text-zinc-950 mb-2">Join the District</p>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </nav>

      {/* 3. MOBILE SLIDE-OUT MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white border-r border-zinc-200 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            
            {/* Mobile Header */}
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-black text-lg italic">
                  S
                </div>
                <span className="font-black text-lg tracking-tighter text-zinc-950 uppercase">
                  STRIDE<span className="text-orange-500">DISTRICT</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-800 font-semibold hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-zinc-200">
              <form onSubmit={handleHeaderSearch} className="relative">
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder="Search kicks, apparel..."
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-800 font-semibold font-medium text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-zinc-800 font-semibold absolute left-3 top-3" />
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                href="/shop"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-zinc-950 hover:bg-zinc-50 transition-colors uppercase tracking-wider"
              >
                <span>Shop All Grails</span>
                <ChevronRight className="w-4 h-4 text-zinc-800 font-semibold font-medium" />
              </Link>
              <Link
                href="/shop?category=sneakers"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-zinc-950 hover:bg-zinc-50 transition-colors uppercase tracking-wider"
              >
                <span>Sneakers & Retros</span>
                <ChevronRight className="w-4 h-4 text-zinc-800 font-semibold font-medium" />
              </Link>
              <Link
                href="/shop?category=hoodies"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-zinc-950 hover:bg-zinc-50 transition-colors uppercase tracking-wider"
              >
                <span>Hoodies & Fleece</span>
                <ChevronRight className="w-4 h-4 text-zinc-800 font-semibold font-medium" />
              </Link>
              <Link
                href="/shop?category=t-shirts"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-zinc-950 hover:bg-zinc-50 transition-colors uppercase tracking-wider"
              >
                <span>Graphic T-Shirts</span>
                <ChevronRight className="w-4 h-4 text-zinc-800 font-semibold font-medium" />
              </Link>
              <Link
                href="/shop?category=accessories"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-zinc-950 hover:bg-zinc-50 transition-colors uppercase tracking-wider"
              >
                <span>Accessories & Bags</span>
                <ChevronRight className="w-4 h-4 text-zinc-800 font-semibold font-medium" />
              </Link>
              <Link
                href="/shop?filter=sale"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-orange-600 font-bold hover:bg-zinc-50 transition-colors uppercase tracking-wider"
              >
                <span>Sale / Hype Drops</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </Link>

              {/* Featured Brands */}
              <div className="pt-4 mt-4 border-t border-zinc-200">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-800 font-semibold font-medium px-3 block mb-2">
                  Top Streetwear Brands
                </span>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {['Jordan', 'Nike', 'Adidas', 'New Balance', 'Supreme', 'Stussy', 'Essentials'].map((b) => (
                    <Link
                      key={b}
                      href={`/shop?brand=${encodeURIComponent(b)}`}
                      className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold hover:text-zinc-950 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 space-y-2">
              <Link
                href="/account"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
