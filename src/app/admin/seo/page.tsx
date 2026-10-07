'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Save,
  Check,
  ExternalLink,
  Search,
  Share2,
  FileCode,
  ShieldCheck,
  AlertCircle,
  Copy,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import { SEOSettings } from '@/lib/db/schema';

const DEFAULT_SEO_SETTINGS: SEOSettings = {
  metaTitle: 'STRIDE DISTRICT | Verified Authentic Sneaker Drops & Streetwear Culture',
  metaDescription: 'Discover 100% verified authentic Air Jordans, Dunks, Supreme box logos, Travis Scott collaborations, and premier streetwear.',
  metaKeywords: 'streetwear, sneakers, air jordan 1, travis scott, supreme, essentials hoodie, yeezy, nike dunk, authentic grails',
  ogImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
  twitterHandle: '@stridedistrict',
  robotsDirective: 'index, follow',
  sitemapUrl: '/sitemap.xml',
};

export default function AdminSEOPage() {
  const [settings, setSettings] = useState<SEOSettings>(DEFAULT_SEO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.seo) {
          setSettings({ ...DEFAULT_SEO_SETTINGS, ...json.data.seo });
        }
      })
      .catch((err) => console.error('Failed to load SEO settings', err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: settings }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('SEO & Social metadata updated successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to save SEO settings.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Loading SEO Engine Configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/50'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Banner */}
      <FrontendMappingBanner
        title="SEO & Social Card Settings"
        badge="Frontend Control: Search & Social Previews"
        description="Configure how your storefront appears in Google search engine result snippets, social media OpenGraph cards, and search bot crawlers."
        controlsWhat="The global HTML title tag, meta descriptions, and social sharing preview graphics."
        previewUrl="/"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'SEO Settings' }]}
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save & Publish SEO'}</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Default Meta Tags</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Primary information indexed by Google and Bing search engines</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Store Meta Title
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {settings.metaTitle.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  placeholder="e.g. STRIDE DISTRICT | Verified Authentic Sneaker Drops & Streetwear Culture"
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Meta Description
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {settings.metaDescription.length} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  placeholder="Short, compelling store overview that appears under your Google link..."
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                  placeholder="e.g. sneakers, air jordan, supreme, travis scott, streetwear"
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Social Cards Section */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Social Sharing (OpenGraph & Twitter Cards)</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Controls image and title when your website link is shared in iMessage, Slack, or X</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Social Share Image URL (1200x630px recommended)
                </label>
                <input
                  type="text"
                  value={settings.ogImage}
                  onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Twitter / X Account Handle
                </label>
                <input
                  type="text"
                  value={settings.twitterHandle}
                  onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                  placeholder="@yourstore"
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Robots & Sitemap */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Search Engine Crawlers & Indexing</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Directives for search engine robots and spiders</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Robots Directive
                </label>
                <select
                  value={settings.robotsDirective}
                  onChange={(e) => setSettings({ ...settings, robotsDirective: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="index, follow">Index, Follow (Recommended)</option>
                  <option value="noindex, follow">Noindex, Follow</option>
                  <option value="noindex, nofollow">Noindex, Nofollow (Under Maintenance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  XML Sitemap Route
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    value={settings.sitemapUrl}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 font-mono"
                  />
                  <Link
                    href="/sitemap.xml"
                    target="_blank"
                    className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                    title="View sitemap XML"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Google & Social Previews */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Google Search Preview Card */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Google Search Result Preview</span>
            </div>

            <div className="p-4 rounded-xl bg-white text-left font-sans space-y-1 shadow-sm border border-zinc-200">
              <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                <span className="w-4 h-4 rounded-full bg-orange-500 text-black text-[9px] font-black flex items-center justify-center">
                  S
                </span>
                <span className="font-semibold text-zinc-800">stridedistrict.com</span>
                <span className="text-zinc-400">&rsaquo;</span>
              </div>
              <h4 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
                {settings.metaTitle || 'STRIDE DISTRICT'}
              </h4>
              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {settings.metaDescription || 'No description entered yet.'}
              </p>
            </div>

            <p className="text-[11px] text-zinc-500">
              This preview reflects how prospective customers see your store listing on desktop and mobile search.
            </p>
          </div>

          {/* Live Social Share Card Preview */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Social Media Link Preview Card</span>
            </div>

            <div className="rounded-xl border border-zinc-700/80 bg-zinc-900 overflow-hidden shadow-md">
              <div className="h-36 w-full bg-zinc-800 relative">
                {settings.ogImage ? (
                  <img
                    src={settings.ogImage}
                    alt="Social Card"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                    No image configured
                  </div>
                )}
              </div>
              <div className="p-3.5 space-y-1 bg-[#181b22]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">
                  stridedistrict.com
                </span>
                <h5 className="text-xs font-bold text-white line-clamp-1">
                  {settings.metaTitle}
                </h5>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  {settings.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
