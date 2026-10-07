'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPostRecord } from '@/lib/db/schema';
import { Clock, ArrowRight, BookOpen, Search, Sparkles, Tag } from 'lucide-react';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/blogs')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBlogs(json.data);
      })
      .catch((err) => console.error('Failed to load dispatches', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filtered = blogs.filter((post) => {
    const matchesCategory = selectedCategory === 'All' ? true : post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5 text-zinc-900" />
          <span>Atelier Dispatches & Research</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight font-serif">
          The AURA Journal
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 font-serif italic">
          Acoustic laboratory research, horological metallurgy, technical carry architecture, and ergonomic philosophy.
        </p>
      </div>

      {/* Filter Ribbon & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-zinc-200">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dispatches & tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-400">
          Loading atelier dispatches...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-400">
          No dispatches found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm card-hover-lift"
            >
              <div>
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-200">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2 font-mono">
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTimeMinutes} min read
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-black line-clamp-2 leading-snug font-serif">
                  {post.title}
                </h2>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                    <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-700">{post.author.name}</span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
