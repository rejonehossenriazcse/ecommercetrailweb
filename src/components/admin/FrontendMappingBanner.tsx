'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Compass, ChevronRight, Info } from 'lucide-react';

interface FrontendMappingBannerProps {
  title: string;
  badge: string;
  description: string;
  controlsWhat: string;
  previewUrl?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export default function FrontendMappingBanner({
  title,
  badge,
  description,
  controlsWhat,
  previewUrl = '/',
  breadcrumbs,
  actions,
}: FrontendMappingBannerProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-800 font-semibold">
        <Link href="/admin" className="hover:text-zinc-900 font-bold transition-colors">
          Admin
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-zinc-800 font-semibold shrink-0" />
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-zinc-900 font-bold transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-zinc-800 font-semibold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Main Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 font-bold">{title}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
              {badge}
            </span>
          </div>
          <p className="text-sm text-zinc-800 font-semibold mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>

      {/* Frontend Control Mapping Callout Card */}
      <div className="p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-zinc-800 font-semibold font-medium">
              Frontend Control Mapping: <strong className="text-zinc-900 font-bold font-semibold">{controlsWhat}</strong>
            </span>
          </div>
        </div>

        {previewUrl && (
          <Link
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-zinc-900 font-bold font-semibold transition-all border border-zinc-300/60 shrink-0 group self-start sm:self-auto"
          >
            <span>View Live on Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
