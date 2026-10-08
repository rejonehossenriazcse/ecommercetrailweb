'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPostRecord } from '@/lib/db/schema';
import {
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  Check,
  Tag,
  Compass,
  Sparkles,
} from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/v1/blogs/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setPost(json.data);
        } else {
          // Fallback fetch all
          fetch('/api/v1/blogs')
            .then((res) => res.json())
            .then((list) => {
              if (list.success && list.data.length > 0) {
                const found = list.data.find((b: BlogPostRecord) => b.slug === slug);
                setPost(found || list.data[0]);
              }
            });
        }
      })
      .catch((err) => console.error('Failed to load article', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-xs font-mono text-zinc-800 font-semibold">
        Retrieving atelier research dossier...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 font-serif">Article Not Found</h2>
        <Link href="/blog" className="text-xs font-bold text-amber-600 hover:underline">
          Return to Atelier Journal
        </Link>
      </div>
    );
  }

  // Parse simple markdown into styled elements
  const renderMarkdown = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-bold text-zinc-950 font-serif tracking-tight mt-8 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-zinc-900 tracking-tight mt-6 mb-2">
            {paragraph.replace('#### ', '')}
          </h4>
        );
      }
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        const items = paragraph.split('\n').filter(Boolean);
        return (
          <ul key={idx} className="space-y-2 my-4 list-disc list-inside text-sm text-zinc-800 font-bold leading-relaxed pl-2">
            {items.map((it, i) => (
              <li key={i}>
                <span dangerouslySetInnerHTML={{
                  __html: it.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </li>
            ))}
          </ul>
        );
      }
      if (/^\d+\.\s/.test(paragraph)) {
        const items = paragraph.split('\n').filter(Boolean);
        return (
          <ol key={idx} className="space-y-2 my-4 list-decimal list-inside text-sm text-zinc-800 font-bold leading-relaxed pl-2">
            {items.map((it, i) => (
              <li key={i}>
                <span dangerouslySetInnerHTML={{
                  __html: it.replace(/^\d+\.\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </li>
            ))}
          </ol>
        );
      }

      return (
        <p
          key={idx}
          className="text-sm sm:text-base text-zinc-800 font-bold leading-relaxed my-4"
          dangerouslySetInnerHTML={{
            __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }}
        />
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800 font-semibold font-medium hover:text-black mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Journal</span>
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-mono font-bold uppercase tracking-wider">
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight font-serif">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-zinc-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-200 shrink-0">
              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
              <div className="font-bold text-zinc-900">{post.author.name}</div>
              <div className="text-zinc-800 font-semibold font-medium text-[11px]">{post.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-zinc-800 font-semibold font-medium font-mono text-[11px]">
            <span>{post.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTimeMinutes} min read
            </span>

            <button
              onClick={handleShare}
              className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative aspect-16/9 rounded-3xl overflow-hidden my-8 bg-zinc-100 border border-zinc-200 shadow-md">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Article Body */}
      <div className="prose prose-zinc max-w-none space-y-4">
        {renderMarkdown(post.content)}
      </div>

      {/* Tags Ribbon */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-8 mt-10 border-t border-zinc-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-zinc-800 font-semibold uppercase font-bold mr-1">Filed Under:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-xs font-mono"
            >
              <Tag className="w-3 h-3 text-zinc-800 font-semibold" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Curated Acquisition Footer */}
      <div className="mt-12 p-8 rounded-3xl bg-zinc-50 text-zinc-900 font-bold border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            AURA Atelier Collection
          </div>
          <h3 className="text-lg font-bold font-serif text-zinc-900 font-bold">
            Experience the Precision Described in this Dispatch
          </h3>
          <p className="text-xs text-zinc-800 font-semibold">
            Explore our curated catalog of numbered horology timepieces and acoustic instruments.
          </p>
        </div>

        <Link
          href="/shop"
          className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md"
        >
          Explore Pieces
        </Link>
      </div>
    </article>
  );
}
