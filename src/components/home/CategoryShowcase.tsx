import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowRight, Sparkles } from 'lucide-react';

export default async function CategoryShowcase({
  title = 'Explore by Discipline',
  subtitle = 'Curated Architectures',
}: {
  title?: string;
  subtitle?: string;
}) {
  const categories = await db.getCategories();

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{subtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            {title}
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-black group cursor-pointer"
        >
          <span>View Entire Directory</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative h-80 rounded-3xl overflow-hidden bg-zinc-100 shadow-sm border border-zinc-200 card-hover-lift block cursor-pointer"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/30 to-transparent" />

            {/* Badge */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-semibold">
              {cat.itemCount} Designs
            </div>

            {/* Info */}
            <div className="absolute bottom-6 left-6 right-6 z-10 text-white space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>Discover Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
