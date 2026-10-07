'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-black text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-orange-500 shadow-sm">
          <Compass className="w-10 h-10 animate-spin [animation-duration:12s]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/30">
            Error 404 &bull; Drop Not Found
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Grail or Page Not Found
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The release, drop, or page you requested may have sold out, migrated to our private vault, or the URL has changed.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Flagship</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors border border-zinc-800 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Explore All Heat</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>STRIDE DISTRICT &bull; 100% Verified Authentic Grails</span>
        </div>
      </div>
    </div>
  );
}
