'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
  Send,
  Lock,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { addToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Don't show footer on admin pages
  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }
    try {
      await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, source: 'Footer' }),
      });
    } catch {
      // fallback
    }
    setIsSubscribed(true);
    addToast('Welcome to the District! Use code STREET10 for 10% off your first pickup.', 'success');
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-white border-t-[4px] border-orange-500 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature / Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">100% Authentic</h4>
              <p className="text-[11px] text-zinc-400">Inspected by District Vault</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Worldwide Transit</h4>
              <p className="text-[11px] text-zinc-400">Free over $150 with tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">14-Day Returns</h4>
              <p className="text-[11px] text-zinc-400">Hassle-free exchanges</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Encrypted Checkout</h4>
              <p className="text-[11px] text-zinc-400">256-Bit SSL Protection</p>
            </div>
          </div>
        </div>

        {/* Middle Navigation & Newsletter Section */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Manifesto & Newsletter */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center font-black text-black text-xl italic shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                S
              </div>
              <span className="font-black text-2xl tracking-tighter text-white uppercase">
                STRIDE<span className="text-orange-500">DISTRICT</span>
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Exclusive kicks, grails, and heavyweight streetwear curated for the culture. Built for movement. 100% verified authentic.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-2">
                JOIN THE DISTRICT • GET 10% OFF
              </span>

              {isSubscribed ? (
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You're in! Use coupon code <strong>STREET10</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-400 font-medium text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Catalog</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/shop" className="hover:text-orange-500 transition-colors">All Grails</Link></li>
              <li><Link href="/shop?category=sneakers" className="hover:text-orange-500 transition-colors">Sneakers & Retros</Link></li>
              <li><Link href="/shop?category=hoodies" className="hover:text-orange-500 transition-colors">Hoodies & Fleece</Link></li>
              <li><Link href="/shop?category=t-shirts" className="hover:text-orange-500 transition-colors">Vintage Graphic Tees</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-orange-500 transition-colors">Tactical Bags & Caps</Link></li>
              <li><Link href="/shop?filter=sale" className="text-orange-500 hover:text-orange-300 font-bold transition-colors">Sale & Drops</Link></li>
            </ul>
          </div>

          {/* Brands Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Top Brands</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/shop?brand=Jordan" className="hover:text-orange-500 transition-colors">Air Jordan</Link></li>
              <li><Link href="/shop?brand=Nike" className="hover:text-orange-500 transition-colors">Nike Sportswear</Link></li>
              <li><Link href="/shop?brand=Adidas" className="hover:text-orange-500 transition-colors">Adidas & Yeezy</Link></li>
              <li><Link href="/shop?brand=Supreme" className="hover:text-orange-500 transition-colors">Supreme New York</Link></li>
              <li><Link href="/shop?brand=Stussy" className="hover:text-orange-500 transition-colors">Stussy World Tour</Link></li>
              <li><Link href="/shop?brand=Essentials" className="hover:text-orange-500 transition-colors">Fear of God Essentials</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Assistance & Vault</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/track" className="hover:text-orange-500 transition-colors">Track Your Package</Link></li>
              <li><Link href="/faq" className="hover:text-orange-500 transition-colors">Authenticity & Legit Checks</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-orange-500 transition-colors">Worldwide Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-orange-500 transition-colors">Returns & Exchange Portal</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Street Concierge Hotline</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-medium">
          <p>© 2026 STRIDE DISTRICT INC. ALL RIGHTS RESERVED. FOR THE CULTURE.</p>
          
          <div className="flex flex-wrap items-center gap-2">
            {['Apple Pay', 'Google Pay', 'Visa', 'Mastercard', 'Amex', 'PayPal', 'Klarna'].map((pay) => (
              <span
                key={pay}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 font-semibold"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
