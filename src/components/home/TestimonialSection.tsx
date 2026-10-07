'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/data/mockData';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function TestimonialSection() {
  return (
    <section className="py-16 sm:py-20 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-400">
            Collector Verification
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-1.5">
            Endorsed by Discerning Architects & Engineers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Real feedback from verified purchasers across London, Tokyo, Zurich, and San Francisco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col justify-between card-hover-lift relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-100 -z-0" />

              <div className="relative z-10 space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-zinc-900">{t.name}</h4>
                    {t.verifiedBuyer && (
                      <span title="Verified Purchaser">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">{t.role} • {t.company}</p>
                  {t.productPurchased && (
                    <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Purchased: {t.productPurchased}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
