'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_POSTS, PRODUCTS } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import { Heart, Camera, ShoppingBag } from 'lucide-react';

export default function SocialGallery() {
  const { setQuickViewProduct } = useStore();

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-orange-400 mb-2">
            <Camera className="w-3.5 h-3.5 text-orange-500" />
            <span>@STRIDEDISTRICT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            As Seen on the Streets
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300"
        >
          Tag #StrideDistrict to be featured
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {SOCIAL_POSTS.map((post) => {
          const taggedProduct = PRODUCTS.find((p) => p.id === post.taggedProductId);

          return (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 shadow-sm border border-zinc-200 card-hover-lift"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{post.handle}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{post.likes}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-zinc-200 line-clamp-2 leading-relaxed mb-3">
                    {post.caption}
                  </p>

                  {taggedProduct && (
                    <button
                      onClick={() => setQuickViewProduct(taggedProduct)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-white/90 backdrop-blur text-zinc-900 text-xs font-bold hover:bg-white transition-colors cursor-pointer shadow"
                    >
                      <span className="truncate mr-2">Shop: {taggedProduct.name}</span>
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
