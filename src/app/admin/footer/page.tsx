'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Columns,
  Save,
  Check,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Truck,
  RotateCcw,
  Lock,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { FooterSettings, FooterColumn, FooterColumnLink, FooterSocialLink } from '@/lib/db/schema';

const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  layout: 'five_columns',
  brandName: 'STRIDE DISTRICT',
  brandDescription: 'Exclusive kicks, grails, and heavyweight streetwear curated for the culture. Built for movement. 100% verified authentic.',
  newsletterTitle: 'JOIN THE DISTRICT • GET 10% OFF',
  newsletterSubtitle: 'Never miss a shock drop or vault release. Get instant SMS alerts, early access, and 10% off your first grail with code STREET10.',
  newsletterEnabled: true,
  contactEmail: 'concierge@stridedistrict.com',
  contactPhone: '+1 212 555 0199',
  contactAddress: '540 Broadway, SoHo, New York, NY 10012',
  copyrightText: '© 2026 STRIDE DISTRICT INC. ALL RIGHTS RESERVED. FOR THE CULTURE.',
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com', isEnabled: true },
    { platform: 'Twitter', url: 'https://twitter.com', isEnabled: true },
    { platform: 'LinkedIn', url: 'https://linkedin.com', isEnabled: true },
    { platform: 'YouTube', url: 'https://youtube.com', isEnabled: true },
  ],
  paymentBadges: ['Apple Pay', 'Google Pay', 'Visa', 'Mastercard', 'Amex', 'PayPal', 'Klarna'],
  columns: [
    {
      title: 'Catalog',
      links: [
        { label: 'All Grails', url: '/shop' },
        { label: 'Sneakers & Retros', url: '/shop?category=sneakers' },
        { label: 'Hoodies & Fleece', url: '/shop?category=hoodies' },
        { label: 'Vintage Graphic Tees', url: '/shop?category=t-shirts' },
        { label: 'Tactical Bags & Caps', url: '/shop?category=accessories' },
        { label: 'Sale & Drops', url: '/shop?filter=sale', badge: 'Sale' },
      ],
    },
    {
      title: 'Top Brands',
      links: [
        { label: 'Air Jordan', url: '/shop?brand=Jordan' },
        { label: 'Nike Sportswear', url: '/shop?brand=Nike' },
        { label: 'Adidas & Yeezy', url: '/shop?brand=Adidas' },
        { label: 'Supreme New York', url: '/shop?brand=Supreme' },
        { label: 'Stussy World Tour', url: '/shop?brand=Stussy' },
        { label: 'Fear of God Essentials', url: '/shop?brand=Essentials' },
      ],
    },
    {
      title: 'Assistance & Vault',
      links: [
        { label: 'Track Your Package', url: '/track' },
        { label: 'Authenticity & Legit Checks', url: '/faq' },
        { label: 'Worldwide Shipping Policy', url: '/shipping-policy' },
        { label: 'Returns & Exchange Portal', url: '/refund-policy' },
        { label: 'Street Concierge Hotline', url: '/contact' },
      ],
    },
    {
      title: 'Policies',
      links: [
        { label: 'Privacy Charter (GDPR/CCPA)', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Shipping & Transit Policy', url: '/shipping-policy' },
        { label: 'Deadstock Return Protocol', url: '/refund-policy' },
        { label: 'Buyer Protection Guarantee', url: '/terms' },
      ],
    },
  ],
};

const AVAILABLE_PAYMENT_BADGES = [
  'Apple Pay',
  'Google Pay',
  'Visa',
  'Mastercard',
  'Amex',
  'PayPal',
  'Stripe',
  'Klarna',
  'Shop Pay',
  'Bank Transfer',
  'Cash on Delivery',
];

export default function AdminFooterPage() {
  const [settings, setSettings] = useState<FooterSettings>(DEFAULT_FOOTER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Link Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [targetColumnIndex, setTargetColumnIndex] = useState<number>(0);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [linkForm, setLinkForm] = useState<{ label: string; url: string; badge: string }>({
    label: '',
    url: '',
    badge: '',
  });

  // Delete Confirm
  const [confirmDelete, setConfirmDelete] = useState<{ colIndex: number; linkIndex: number } | null>(null);

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.footer) {
          setSettings({
            ...DEFAULT_FOOTER_SETTINGS,
            ...json.data.footer,
            columns: json.data.footer.columns || DEFAULT_FOOTER_SETTINGS.columns,
          });
        }
      })
      .catch((err) => console.error('Failed to load footer settings', err))
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
        body: JSON.stringify({ footer: settings }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Footer settings saved successfully! Live storefront updated.', 'success');
      } else {
        showToast(json.error || 'Failed to save footer settings.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Link Handlers
  const handleOpenAddLink = (colIndex: number) => {
    setTargetColumnIndex(colIndex);
    setEditingLinkIndex(null);
    setLinkForm({ label: '', url: '', badge: '' });
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (colIndex: number, linkIndex: number) => {
    setTargetColumnIndex(colIndex);
    setEditingLinkIndex(linkIndex);
    const link = settings.columns[colIndex].links[linkIndex];
    setLinkForm({ label: link.label, url: link.url, badge: link.badge || '' });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.label.trim() || !linkForm.url.trim()) return;

    const updatedCols = [...settings.columns];
    const targetCol = { ...updatedCols[targetColumnIndex] };
    const links = [...targetCol.links];

    if (editingLinkIndex !== null) {
      links[editingLinkIndex] = {
        label: linkForm.label.trim(),
        url: linkForm.url.trim(),
        badge: linkForm.badge.trim() || undefined,
      };
    } else {
      links.push({
        label: linkForm.label.trim(),
        url: linkForm.url.trim(),
        badge: linkForm.badge.trim() || undefined,
      });
    }

    targetCol.links = links;
    updatedCols[targetColumnIndex] = targetCol;
    setSettings({ ...settings, columns: updatedCols });
    setIsLinkModalOpen(false);
    showToast(`Updated link "${linkForm.label}"`, 'success');
  };

  const handleConfirmDeleteLink = () => {
    if (!confirmDelete) return;
    const { colIndex, linkIndex } = confirmDelete;
    const updatedCols = [...settings.columns];
    updatedCols[colIndex].links = updatedCols[colIndex].links.filter((_, idx) => idx !== linkIndex);
    setSettings({ ...settings, columns: updatedCols });
    setConfirmDelete(null);
    showToast('Link removed from footer column.', 'success');
  };

  const handleTogglePaymentBadge = (badge: string) => {
    const exists = settings.paymentBadges.includes(badge);
    const updated = exists
      ? settings.paymentBadges.filter((b) => b !== badge)
      : [...settings.paymentBadges, badge];
    setSettings({ ...settings, paymentBadges: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Loading Footer Configuration...</span>
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

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Footer Link"
        description="Are you sure you want to remove this link from the footer column? Visitors will no longer see it on the website."
        confirmText="Remove Link"
        onConfirm={handleConfirmDeleteLink}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Banner */}
      <FrontendMappingBanner
        title="Footer Management"
        badge="Frontend Control: Bottom Footer"
        description="Manage the newsletter signup, footer columns, contact details, social links, payment icons, and copyright text at the bottom of your website."
        controlsWhat="The bottom footer and legal navigation section across all storefront pages."
        previewUrl="/"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'Footer Management' }]}
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
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Footer'}</span>
          </button>
        }
      />

      {/* Live Interactive Footer Preview Card */}
      <div className="bg-[#14171d] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 border-b border-zinc-800 bg-[#0f1115] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Live Footer Preview</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            {settings.columns.length} Active Columns
          </span>
        </div>

        <div className="w-full bg-[#0a0a0a] text-white border-t-[4px] border-orange-500 p-6 sm:p-8 space-y-8 overflow-x-auto select-none">
          {/* 1. Feature / Trust Bar Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-white">100% Authentic</h4>
                <p className="text-[10px] text-zinc-400">Inspected by District Vault</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-400 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-white">Worldwide Transit</h4>
                <p className="text-[10px] text-zinc-400">Free over $150 with tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-400 shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-white">14-Day Returns</h4>
                <p className="text-[10px] text-zinc-400">Hassle-free exchanges</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-white">Encrypted Checkout</h4>
                <p className="text-[10px] text-zinc-400">256-Bit SSL Protection</p>
              </div>
            </div>
          </div>

          {/* 2. Middle Section: Brand & Newsletter + Dynamic Columns */}
          <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Brand Manifesto & Newsletter */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-black text-lg italic shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                  S
                </div>
                <span className="font-black text-xl tracking-tighter text-white uppercase">
                  {settings.brandName?.includes(' ') ? (
                    <>
                      {settings.brandName.split(' ')[0]}
                      <span className="text-orange-500"> {settings.brandName.split(' ').slice(1).join(' ')}</span>
                    </>
                  ) : (
                    <>
                      {settings.brandName || 'STRIDE'}<span className="text-orange-500">DISTRICT</span>
                    </>
                  )}
                </span>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                {settings.brandDescription ||
                  'Exclusive kicks, grails, and heavyweight streetwear curated for the culture. Built for movement. 100% verified authentic.'}
              </p>

              {settings.newsletterEnabled && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold block mb-2">
                    {settings.newsletterTitle || 'JOIN THE DISTRICT • GET 10% OFF'}
                  </span>
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="email"
                      readOnly
                      placeholder="Enter your email address"
                      className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                    />
                    <div className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer">
                      Join
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Columns */}
            {settings.columns.map((col, idx) => (
              <div key={idx} className="lg:col-span-2 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {col.title}
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {col.links.slice(0, 6).map((link, lIdx) => (
                    <li
                      key={lIdx}
                      className={`truncate hover:text-orange-400 transition-colors cursor-pointer ${
                        link.badge === 'Sale' ? 'text-orange-400 font-bold' : ''
                      }`}
                    >
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Bottom Copyright & Payment Methods Preview */}
          <div className="pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>{settings.copyrightText || '© 2026 STRIDE DISTRICT INC. ALL RIGHTS RESERVED. FOR THE CULTURE.'}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {settings.paymentBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 font-semibold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Brand Statement & Contact */}
        <div className="lg:col-span-6 space-y-6">
          {/* Section 1: Newsletter */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-white">Newsletter Subscription Bar</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Controls the newsletter lead capture at top of footer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.newsletterEnabled}
                  onChange={(e) => setSettings({ ...settings, newsletterEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Newsletter Headline
                </label>
                <input
                  type="text"
                  value={settings.newsletterTitle}
                  onChange={(e) => setSettings({ ...settings, newsletterTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Newsletter Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={settings.newsletterSubtitle}
                  onChange={(e) => setSettings({ ...settings, newsletterSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Store Contact Details</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Shown in customer support & concierge footer areas</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Support Email Address</span>
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Concierge Phone</span>
                </label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>SoHo Flagship Vault Address</span>
                </label>
                <input
                  type="text"
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Badges & Copyright */}
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Payment Method Trust Badges</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Select accepted payment logos displayed at the bottom</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PAYMENT_BADGES.map((badge) => {
                const isSelected = settings.paymentBadges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => handleTogglePaymentBadge(badge)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {badge}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Copyright Notice
              </label>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Footer Navigation Columns */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">Footer Navigation Columns</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage link categories and shortcuts shown across the footer
              </p>
            </div>

            <div className="space-y-4">
              {settings.columns.map((column, colIdx) => (
                <div key={colIdx} className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-400/10 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center">
                        {colIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={column.title}
                        onChange={(e) => {
                          const updated = [...settings.columns];
                          updated[colIdx].title = e.target.value;
                          setSettings({ ...settings, columns: updated });
                        }}
                        className="bg-transparent font-bold text-sm text-white focus:outline-none border-b border-transparent focus:border-amber-400 px-1"
                      />
                    </div>
                    <button
                      onClick={() => handleOpenAddLink(colIdx)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  {/* Links in this column */}
                  <div className="space-y-1.5 pt-1">
                    {column.links.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic py-1">No links added yet in this column.</p>
                    ) : (
                      column.links.map((link, lIdx) => (
                        <div
                          key={lIdx}
                          className="px-3 py-2 rounded-lg bg-zinc-850 border border-zinc-750 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium text-white truncate">{link.label}</span>
                            <span className="text-[10px] font-mono text-zinc-500 truncate">{link.url}</span>
                            {link.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditLink(colIdx, lIdx)}
                              className="p-1 text-zinc-400 hover:text-white transition-colors"
                              title="Edit link"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete({ colIndex: colIdx, linkIndex: lIdx })}
                              className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                              title="Delete link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Footer Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveLink}
            className="bg-[#16191f] border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {editingLinkIndex !== null ? 'Edit Footer Link' : 'Add Footer Link'}
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
                  Link Label *
                </label>
                <input
                  type="text"
                  required
                  value={linkForm.label}
                  onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                  placeholder="e.g. Terms of Service or Acoustic Studio"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="e.g. /terms or /shop?category=audio"
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
                  placeholder="e.g. Sale, New, Updated"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
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
                {editingLinkIndex !== null ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
