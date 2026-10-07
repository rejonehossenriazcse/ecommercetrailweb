'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MediaAssetRecord } from '@/lib/db/schema';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Folder,
  HardDrive,
  Sparkles,
  X,
  FileImage,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const FOLDERS = ['All', 'Products', 'Banners', 'Editorial', 'Lookbook', 'Brand'];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    url: '',
    folder: 'Products' as MediaAssetRecord['folder'],
    altText: '',
    dimensions: '1920x1080',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder]);

  const fetchMedia = () => {
    setLoading(true);
    const url = selectedFolder === 'All' ? '/api/v1/media' : `/api/v1/media?folder=${selectedFolder}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAssets(json.data);
      })
      .finally(() => setLoading(false));
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteAssetId) return;
    try {
      const res = await fetch(`/api/v1/media/${deleteAssetId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAssets((prev) => prev.filter((a) => a.id !== deleteAssetId));
        setDeleteAssetId(null);
      }
    } catch (err) {
      console.error('Failed to delete asset', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name || !uploadForm.url) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm),
      });

      const json = await res.json();
      if (json.success) {
        setAssets((prev) => [json.data, ...prev]);
        setIsUploadOpen(false);
        setUploadForm({
          name: '',
          url: '',
          folder: 'Products',
          altText: '',
          dimensions: '1920x1080',
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.altText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBytes = assets.reduce((sum, a) => sum + a.sizeBytes, 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteAssetId}
        title="Delete Media Asset"
        description="Are you sure you want to delete this media asset? Any product or banner referencing this URL will no longer be able to load it."
        confirmText="Delete Asset"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteAssetId(null)}
      />

      {/* Header Banner */}
      <FrontendMappingBanner
        title="Media Library"
        badge="Frontend Control: Product & Campaign Imagery"
        description="Store high-resolution product photography, campaign lookbook assets, and lifestyle banners used across the storefront."
        controlsWhat="All uploaded photography and imagery assets used in products, hero sliders, categories, and custom pages."
        previewUrl="/"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'Media Library' }]}
        actions={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Media Asset</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12151a] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Assets</span>
            <FileImage className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{assets.length} items</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Edge CDN Synced</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Storage Consumed</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalMB} MB</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Of 50 GB Global Quota</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Format Compression</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">68.4% Saved</div>
          <div className="text-[11px] text-emerald-400/90 mt-1 font-mono">Lossless WebP Pipeline</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Active Folders</span>
            <Folder className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{FOLDERS.length - 1} taxonomies</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Structured Buckets</div>
        </div>
      </div>

      {/* Folder Tabs & Search Bar */}
      <div className="bg-[#12151a] border border-zinc-800/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Folders */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {FOLDERS.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                selectedFolder === folder
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by filename or alt text..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
            Querying edge media storage...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
            No media assets found in this folder.
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#12151a] border border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.altText}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-semibold text-amber-400 border border-white/10">
                  {asset.folder}
                </div>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-mono text-zinc-300 border border-white/10">
                  {asset.mimeType.split('/')[1]?.toUpperCase()}
                </div>
              </div>

              {/* Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-mono text-xs font-bold text-white truncate" title={asset.name}>
                    {asset.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5" title={asset.altText}>
                    Alt: {asset.altText}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 mt-2">
                    <span>{asset.dimensions || '1920x1080'}</span>
                    <span>•</span>
                    <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                    <span>•</span>
                    <span>{asset.usageCount} uses</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.url)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy CDN</span>
                      </>
                    )}
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title="Open Full Resolution"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setDeleteAssetId(asset.id)}
                    className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete Media Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Asset Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#14171f] border border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Upload Digital Media Asset</h2>
            <p className="text-xs text-zinc-400 mb-6 font-mono">
              Asset will be cached and delivered across global Cloudflare / Fastly CDN edges.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Asset Filename</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. signature-watch-banner.webp"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Direct Image CDN URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Folder Taxonomy</label>
                  <select
                    value={uploadForm.folder}
                    onChange={(e) => setUploadForm({ ...uploadForm, folder: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {FOLDERS.filter((f) => f !== 'All').map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={uploadForm.dimensions}
                    onChange={(e) => setUploadForm({ ...uploadForm, dimensions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">SEO Alt Text</label>
                <input
                  type="text"
                  placeholder="Descriptive text for accessibility & Google Image Search"
                  value={uploadForm.altText}
                  onChange={(e) => setUploadForm({ ...uploadForm, altText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading to CDN...' : 'Confirm Upload & Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
