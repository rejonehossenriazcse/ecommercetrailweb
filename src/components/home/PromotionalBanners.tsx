'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PromotionalBanners() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Banner 1 */}
        <div className="group relative h-96 rounded-3xl overflow-hidden bg-zinc-950 text-white shadow-xl card-hover-lift">
          <Image
            src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80"
            alt="Technical Outerwear"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

          <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-400 mb-2">
              Autumn Transit Lookbook
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              3-Layer GORE-TEX & Merino Thermals
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md">
              Engineered for extreme sub-zero city climates and alpine ascents with taped seams and RECCO reflectors.
            </p>
            <div className="pt-4">
              <Link
                href="/shop?category=technical-apparel"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors shadow-md"
              >
                <span>Explore Technical Apparel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="group relative h-96 rounded-3xl overflow-hidden bg-zinc-950 text-white shadow-xl card-hover-lift">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
            alt="Mechanical Horology"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

          <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-400 mb-2">
              Horological Archive
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Swiss Calibre V-88 Automatics
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md">
              Forged from Grade 5 titanium with sapphire crystal display backs and 68-hour power reserves.
            </p>
            <div className="pt-4">
              <Link
                href="/shop?category=watches-wearables"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors shadow-md"
              >
                <span>Discover Horology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
