'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu as MenuIcon,
  Save,
  Check,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  ShoppingCart,
  ShoppingBag,
  Heart,
  User,
  Globe,
  DollarSign,
  AlertCircle,
  Monitor,
  LayoutGrid,
  ChevronDown,
  Flame,
  Zap,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { HeaderSettings, HeaderNavLink } from '@/lib/db/schema';

const DEFAULT_HEADER_SETTINGS: HeaderSettings = {
  logoText: 'STRIDE',
  logoSubtitle: 'DISTRICT',
  logoImageUrl: '',
  faviconUrl: '/favicon.ico',
  layout: 'standard',
  stickyHeader: true,
  announcementText: 'LIMITED DROP: Jordan Retro 4 & Stussy Fleece drops live | Complimentary insured shipping over $150',
  announcementCoupon: 'STREET10',
  announcementLink: '/shop',
  announcementBgColor: '#000000',
  announcementEnabled: true,
  showSearch: true,
  showAccount: true,
  showWishlist: true,
  showCart: true,
  showCurrencySelector: true,
  showLanguageSelector: true,
  ctaButtonText: 'Shop All Heat',
  ctaButtonLink: '/shop',
  ctaButtonEnabled: true,
  navLinks: [
    { id: 'nav-1', label: 'Shop All', url: '/shop', isEnabled: true },
    { id: 'nav-2', label: 'Sneakers', url: '/shop?category=sneakers', isMegaMenu: true, isEnabled: true },
    { id: 'nav-3', label: 'Hoodies & Fleece', url: '/shop?category=hoodies', isEnabled: true },
    { id: 'nav-4', label: 'T-Shirts', url: '/shop?category=t-shirts', isEnabled: true },
    { id: 'nav-5', label: 'Accessories', url: '/shop?category=accessories', isEnabled: true },
    { id: 'nav-6', label: 'Sale / Drops', url: '/shop?filter=sale', badge: 'Sale', isEnabled: true },
    { id: 'nav-7', label: 'Concierge', url: '/contact', isEnabled: true },
  ],
};

export default function AdminHeaderPage() {
  const [settings, setSettings] = useState<HeaderSettings>(DEFAULT_HEADER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Link edit/add modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<HeaderNavLink | null>(null);
  const [linkForm, setLinkForm] = useState<{ label: string; url: string; badge: string; isMegaMenu: boolean }>({
    label: '',
    url: '',
    badge: '',
    isMegaMenu: false,
  });

  // Delete confirmation modal
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);

  // Fetch current settings
  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.header) {
            setSettings({
              ...DEFAULT_HEADER_SETTINGS,
              ...json.data.header,
              navLinks: json.data.header.navLinks || DEFAULT_HEADER_SETTINGS.navLinks,
            });
          } else if (json.data.general) {
            setSettings((prev) => ({
              ...prev,
              announcementText: json.data.general.announcementText || prev.announcementText,
              announcementCoupon: json.data.general.announcementCoupon || prev.announcementCoupon,
              announcementEnabled: json.data.general.announcementEnabled !== undefined ? json.data.general.announcementEnabled : prev.announcementEnabled,
            }));
          }
        }
      })
      .catch((err) => console.error('Failed to load header settings', err))
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
        body: JSON.stringify({
          header: settings,
          general: {
            announcementText: settings.announcementText,
            announcementCoupon: settings.announcementCoupon,
            announcementEnabled: settings.announcementEnabled,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Header & Navigation settings saved successfully! Live website updated.', 'success');
      } else {
        showToast(json.error || 'Failed to save header settings.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Nav link reordering
  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.navLinks.length) return;
    const updated = [...settings.navLinks];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setSettings({ ...settings, navLinks: updated });
  };

  const handleToggleLink = (id: string) => {
    const updated = settings.navLinks.map((l) => (l.id === id ? { ...l, isEnabled: !l.isEnabled } : l));
    setSettings({ ...settings, navLinks: updated });
  };

  const handleOpenAddLink = () => {
    setEditingLink(null);
    setLinkForm({ label: '', url: '', badge: '', isMegaMenu: false });
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (link: HeaderNavLink) => {
    setEditingLink(link);
    setLinkForm({
      label: link.label,
      url: link.url,
      badge: link.badge || '',
      isMegaMenu: !!link.isMegaMenu,
    });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.label.trim() || !linkForm.url.trim()) return;

    if (editingLink) {
      const updated = settings.navLinks.map((l) =>
        l.id === editingLink.id
          ? {
              ...l,
              label: linkForm.label.trim(),
              url: linkForm.url.trim(),
              badge: linkForm.badge.trim() || undefined,
              isMegaMenu: linkForm.isMegaMenu,
            }
          : l
      );
      setSettings({ ...settings, navLinks: updated });
      showToast(`Updated menu link: "${linkForm.label}"`, 'success');
    } else {
      const newLink: HeaderNavLink = {
        id: `nav-${Date.now()}`,
        label: linkForm.label.trim(),
        url: linkForm.url.trim(),
        badge: linkForm.badge.trim() || undefined,
        isMegaMenu: linkForm.isMegaMenu,
        isEnabled: true,
      };
      setSettings({ ...settings, navLinks: [...settings.navLinks, newLink] });
      showToast(`Added menu link: "${linkForm.label}"`, 'success');
    }
    setIsLinkModalOpen(false);
  };

  const handleConfirmDeleteLink = () => {
    if (!deleteLinkId) return;
    const updated = settings.navLinks.filter((l) => l.id !== deleteLinkId);
    setSettings({ ...settings, navLinks: updated });
    setDeleteLinkId(null);
    showToast('Navigation link removed.', 'success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Loading Header Configuration...</span>
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

      {/* Confirmation Modal for Delete Link */}
      <AdminConfirmModal
        isOpen={!!deleteLinkId}
        title="Remove Navigation Link"
        description="Are you sure you want to remove this navigation link? It will disappear from the storefront top menu once you save."
        confirmText="Remove Link"
        onConfirm={handleConfirmDeleteLink}
        onCancel={() => setDeleteLinkId(null)}
      />

      {/* Header Banner */}
      <FrontendMappingBanner
        title="Header & Navigation"
        badge="Frontend Control: Top Header"
        description="Manage the announcement bar, store logo, main navigation menus, search bar, and utility icons that appear at the very top of your website."
        controlsWhat="The top header, announcement strip, and main navigation bar across all storefront pages."
        previewUrl="/"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'Header & Navigation' }]}
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
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Header'}</span>
          </button>
        }
      />

      {/* Live Interactive Header Preview Card */}
      <div className="bg-[#14171d] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 border-b border-zinc-800 bg-[#0f1115] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Live Header Preview (How visitors see it)</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            {settings.stickyHeader ? 'Sticky Header: ON' : 'Sticky Header: OFF'}
          </span>
        </div>

        <div className="bg-black text-white overflow-x-auto select-none border-b border-zinc-800">
          {/* 1. Top Announcement Marquee Preview */}
          {settings.announcementEnabled && (
            <div
              className="py-2 px-4 border-b border-zinc-800/80 text-[11px] font-medium flex items-center justify-between gap-3 transition-colors"
              style={{ backgroundColor: settings.announcementBgColor || '#000000' }}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider shrink-0 text-[10px]">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-500" />
                  <span>LIMITED DROP:</span>
                </div>
                <p className="truncate text-zinc-300 text-xs">
                  {settings.announcementText || 'Jordan Retro 4 & Stussy Fleece drops live | Complimentary insured shipping over $150'}
                </p>
                {settings.announcementCoupon && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-orange-400 font-mono text-[10px] font-bold shrink-0">
                    USE '{settings.announcementCoupon}' FOR 10% OFF
                  </span>
                )}
              </div>

              {settings.showCurrencySelector && (
                <div className="hidden md:flex items-center gap-4 text-[10px] text-zinc-400 shrink-0 font-mono">
                  <span className="hover:text-white transition-colors cursor-pointer">$ USD</span>
                  <span className="text-zinc-600">•</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Help & FAQ</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-orange-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Track Drop
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. Main Navigation Bar Preview */}
          <div className="w-full bg-zinc-950/95 border-b border-zinc-900 py-3.5 px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              
              {/* Left: Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-black text-lg italic shadow-[0_0_15px_rgba(249,115,22,0.5)] transform -rotate-3">
                  {settings.logoText ? settings.logoText.charAt(0) : 'S'}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-base tracking-tighter text-white uppercase leading-none">
                      {settings.logoText || 'STRIDE'}
                    </span>
                    <span className="font-black text-base tracking-tighter text-orange-500 uppercase leading-none">
                      {settings.logoSubtitle || 'DISTRICT'}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase leading-none mt-0.5">
                    Hype & Culture Drops
                  </span>
                </div>
              </div>

              {/* Middle: Desktop Nav Categories */}
              <div className="hidden lg:flex items-center gap-6">
                {settings.navLinks
                  .filter((l) => l.isEnabled)
                  .map((link) => {
                    const isSale = link.badge === 'Sale' || link.url.includes('sale');
                    return (
                      <div
                        key={link.id}
                        className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                          isSale
                            ? 'text-orange-400 hover:text-orange-300'
                            : 'text-zinc-300 hover:text-orange-400'
                        }`}
                      >
                        {isSale && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping inline-block mr-0.5" />
                        )}
                        <span>{link.label}</span>
                        {link.isMegaMenu && <ChevronDown className="w-3 h-3 text-zinc-500" />}
                        {link.badge && link.badge !== 'Sale' && (
                          <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] rounded font-mono font-bold">
                            {link.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Right: Search Input + Wishlist + Cart + Account */}
              <div className="flex items-center gap-3">
                {/* Search Input Preview */}
                {settings.showSearch && (
                  <div className="relative hidden md:flex items-center">
                    <input
                      type="text"
                      readOnly
                      placeholder="Search Jordan, Dunks, Hoodies..."
                      className="bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs rounded-full pl-8 pr-4 py-1.5 w-44 lg:w-56 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                  </div>
                )}

                {/* Wishlist */}
                {settings.showWishlist && (
                  <div className="relative p-2 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Saved Items">
                    <Heart className="w-4 h-4" />
                    <span className="absolute 0 top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-mono font-bold flex items-center justify-center">
                      2
                    </span>
                  </div>
                )}

                {/* Cart / Shopping Bag */}
                {settings.showCart && (
                  <div className="relative p-2 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Shopping Bag">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span className="absolute 0 top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                      3
                    </span>
                  </div>
                )}

                {/* Account */}
                {settings.showAccount && (
                  <div className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Account">
                    <User className="w-4 h-4" />
                  </div>
                )}

                {/* CTA Button */}
                {settings.ctaButtonEnabled && (
                  <div className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-orange-500 text-black text-xs font-black uppercase tracking-wider cursor-pointer">
                    {settings.ctaButtonText || 'Shop All Heat'}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Announcement & Brand Settings */}
        <div className="lg:col-span-6 space-y-6">
          {/* Section 1: Announcement Bar */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-white">Top Announcement Bar</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Controls the high-visibility promotional bar at the top</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.announcementEnabled}
                  onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  placeholder="e.g. Free Express Shipping on orders over $150"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Voucher Coupon Code
                  </label>
                  <input
                    type="text"
                    value={settings.announcementCoupon}
                    onChange={(e) => setSettings({ ...settings, announcementCoupon: e.target.value })}
                    placeholder="e.g. WELCOME10"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.announcementBgColor || '#09090b'}
                      onChange={(e) => setSettings({ ...settings, announcementBgColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-zinc-700 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-zinc-400">
                      {settings.announcementBgColor || '#09090b'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Brand Identity & Sticky Header */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Store Logo & Header Layout</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Controls website branding in the header navigation</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Logo Primary Text
                </label>
                <input
                  type="text"
                  value={settings.logoText}
                  onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                  placeholder="e.g. STRIDE"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Logo Subtitle / Tag
                </label>
                <input
                  type="text"
                  value={settings.logoSubtitle}
                  onChange={(e) => setSettings({ ...settings, logoSubtitle: e.target.value })}
                  placeholder="e.g. DISTRICT"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Custom Logo Image URL (Optional)
              </label>
              <input
                type="text"
                value={settings.logoImageUrl}
                onChange={(e) => setSettings({ ...settings, logoImageUrl: e.target.value })}
                placeholder="Leave blank to use clean typographic logo"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
              <div>
                <span className="text-xs font-bold text-white block">Sticky Header on Scroll</span>
                <span className="text-[11px] text-zinc-400">Keeps header visible as users scroll down pages</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.stickyHeader}
                  onChange={(e) => setSettings({ ...settings, stickyHeader: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>

          {/* Section 3: Icon & Utility Visibility */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Header Action Icons & Utilities</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Toggle customer action buttons shown in the header</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300">Search Bar & ⌘K</span>
                <input
                  type="checkbox"
                  checked={settings.showSearch}
                  onChange={(e) => setSettings({ ...settings, showSearch: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300">Customer Account</span>
                <input
                  type="checkbox"
                  checked={settings.showAccount}
                  onChange={(e) => setSettings({ ...settings, showAccount: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300">Wishlist Heart</span>
                <input
                  type="checkbox"
                  checked={settings.showWishlist}
                  onChange={(e) => setSettings({ ...settings, showWishlist: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300">Shopping Cart Bag</span>
                <input
                  type="checkbox"
                  checked={settings.showCart}
                  onChange={(e) => setSettings({ ...settings, showCart: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300">Currency Selector</span>
                <input
                  type="checkbox"
                  checked={settings.showCurrencySelector}
                  onChange={(e) => setSettings({ ...settings, showCurrencySelector: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300">Language Selector</span>
                <input
                  type="checkbox"
                  checked={settings.showLanguageSelector}
                  onChange={(e) => setSettings({ ...settings, showLanguageSelector: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Navigation Menus Management */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-white">Main Navigation Menu Links</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Controls the primary navigation links shown across the header
                </p>
              </div>
              <button
                onClick={handleOpenAddLink}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Menu Item</span>
              </button>
            </div>

            {/* Menu Links Table */}
            <div className="space-y-2">
              {settings.navLinks.map((link, index) => (
                <div
                  key={link.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    link.isEnabled
                      ? 'bg-zinc-900/90 border-zinc-800'
                      : 'bg-zinc-900/40 border-zinc-850 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveLink(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveLink(index, 'down')}
                        disabled={index === settings.navLinks.length - 1}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{link.label}</span>
                        {link.isMegaMenu && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Mega Menu
                          </span>
                        )}
                        {link.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 block truncate mt-0.5">
                        {link.url}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleLink(link.id)}
                      title={link.isEnabled ? 'Disable Link' : 'Enable Link'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        link.isEnabled
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-zinc-600 hover:bg-zinc-800'
                      }`}
                    >
                      {link.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEditLink(link)}
                      title="Edit Link"
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteLinkId(link.id)}
                      title="Delete Link"
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1">
              <span className="font-semibold text-white block">💡 Non-Technical Store Owner Tip</span>
              <p className="text-[11px] leading-relaxed">
                Reorder links using the arrows on the left. Toggle the eye icon to hide or show any menu item immediately without deleting it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Menu Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveLink}
            className="bg-[#16191f] border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {editingLink ? 'Edit Navigation Item' : 'Add New Navigation Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Menu Item Label *
                </label>
                <input
                  type="text"
                  required
                  value={linkForm.label}
                  onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                  placeholder="e.g. Limited Watches"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Target Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="e.g. /shop?category=watches or /about"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Highlight Badge (Optional)
                </label>
                <input
                  type="text"
                  value={linkForm.badge}
                  onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value })}
                  placeholder="e.g. New, Hot, Sale"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkForm.isMegaMenu}
                  onChange={(e) => setLinkForm({ ...linkForm, isMegaMenu: e.target.checked })}
                  className="rounded text-amber-400 focus:ring-0"
                />
                <span>Enable Multi-Column Mega Menu dropdown for this link</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold"
              >
                {editingLink ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
