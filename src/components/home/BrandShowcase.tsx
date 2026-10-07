import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default async function BrandShowcase() {
  const brands = await db.getBrands();

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-400">
          Independent Ateliers
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-1.5">
          Curated Studio Houses
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2">
          We collaborate exclusively with master craftsmen and material engineers who adhere to strict zero-defect manufacturing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/shop?brand=${brand.slug}`}
            className="group p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-900 card-hover-lift flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-wider mb-4 shadow-sm group-hover:scale-105 transition-transform">
                {brand.name.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="text-base font-bold text-zinc-900 group-hover:text-black">
                {brand.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-3">
                {brand.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-400">
                {brand.productCount} Designs
              </span>
              <span className="font-bold text-zinc-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
