'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/mockData';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

export default function BlogSection() {
  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-800 font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-zinc-900" />
            <span>The Journal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Design Philosophy & Laboratory Notes
          </h2>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-black group cursor-pointer"
        >
          <span>All Dispatches</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between card-hover-lift"
          >
            <div>
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-200">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-800 font-semibold mb-2 font-mono">
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTimeMinutes} min read
                </span>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-black line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-zinc-800 font-semibold font-medium mt-2 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-200">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <span className="font-semibold text-zinc-800 font-bold">{post.author.name}</span>
              </div>
              <span className="font-bold text-zinc-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
