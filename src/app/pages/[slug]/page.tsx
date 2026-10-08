import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ChevronRight, ArrowLeft, ShieldCheck, Mail, Compass } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found — Stride District',
    };
  }

  return {
    title: `${page.metaTitle || page.title} | Stride District`,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription,
      type: 'website',
      url: `https://stridedistrict.com/pages/${page.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle || page.title,
      description: page.metaDescription,
    },
  };
}

export default async function DynamicCMSPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await db.getPageBySlug(slug);

  if (!page || page.status !== 'published') {
    notFound();
  }

  // Parse simple markdown into styled elements
  const renderMarkdown = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => {
      // H3
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-bold text-zinc-950 font-serif tracking-tight mt-8 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      // H4
      if (paragraph.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-zinc-900 tracking-tight mt-6 mb-2">
            {paragraph.replace('#### ', '')}
          </h4>
        );
      }
      // Bullet list
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
      // Numbered list
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

      // Standard paragraph
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-800 font-semibold mb-8">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Atelier
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-800 font-bold" />
        <span className="uppercase text-zinc-800 font-semibold font-medium font-bold">{page.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-800 font-bold" />
        <span className="text-zinc-900 font-bold line-clamp-1">{page.title}</span>
      </nav>

      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-8 mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
          <Compass className="w-3.5 h-3.5" />
          <span>{page.category} • Official Dossier</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight font-serif">
          {page.title}
        </h1>

        {page.subtitle && (
          <p className="text-base sm:text-lg text-zinc-800 font-semibold font-serif italic max-w-2xl">
            {page.subtitle}
          </p>
        )}

        <div className="text-[11px] font-mono text-zinc-800 font-semibold pt-2">
          Effective & Verified: {new Date(page.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Stride District Registry
        </div>
      </div>

      {/* Page Content Body */}
      <article className="prose prose-zinc max-w-none space-y-4">
        {renderMarkdown(page.content)}
      </article>

      {/* Concierge Inquiry Callout */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-zinc-50 text-zinc-900 font-bold border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-bold font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Streetwear Concierge</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 font-bold">
            Have questions regarding this protocol or order verification?
          </h3>
          <p className="text-xs text-zinc-800 font-semibold">
            Our authenticators and sizing specialists in New York & Tokyo are available for 24/7 concierge dialogue.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Concierge</span>
        </Link>
      </div>

      {/* Back Link */}
      <div className="mt-8 pt-6 border-t border-zinc-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-800 font-semibold hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
}
