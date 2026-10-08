'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Check,
  ExternalLink,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Globe,
  Tag,
  Clock,
  Smartphone,
  Monitor,
  AlertCircle,
  Menu as MenuIcon,
  Columns,
  FileText,
  BookOpen,
  RotateCcw,
  Megaphone,
  Palette,
  Image as ImageIcon,
  ShieldCheck,
  Layers,
  Flame,
  Star
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { CMSSectionRecord } from '@/lib/db/schema';
import { SEED_CMS_SECTIONS } from '@/lib/db/seed';

// Human-friendly mapping and metadata for homepage sections matching live storefront
const SECTION_METADATA: Record<string, { label: string; icon: string; frontendDescription: string; defaultTag: string }> = {
  hero_slider: {
    label: 'Hero Showcase & Top Ads Banner',
    icon: '🔥',
    frontendDescription: 'Controls the main hero drop banner ("BUILT FOR MOVEMENT / @OWN THE STREETS"), CTA buttons, background image, trust badges, and the top Announcement / Ads Bar.',
    defaultTag: 'Top Fold & Ads',
  },
  featured_categories: {
    label: 'Shop By Category Grid',
    icon: '👟',
    frontendDescription: 'Controls the visual grid of streetwear departments (Sneakers, Hoodies & Fleece, Graphic T-Shirts, Accessories).',
    defaultTag: 'Category Taxonomy',
  },
  product_grid: {
    label: 'New Arrivals & Verified Drops',
    icon: '✨',
    frontendDescription: 'Controls the dynamic product catalog displaying latest sneakers and streetwear drops with price tags & badges.',
    defaultTag: 'Core Catalog',
  },
  promotional_banners: {
    label: 'Promotional Sale Banner (Up to 40% Off)',
    icon: '⚡',
    frontendDescription: 'Controls the bold orange promotional sale banner ("LIMITED TIME ONLY / UP TO 40% OFF / ON SELECT STYLES") and "Shop The Sale" link.',
    defaultTag: 'Sale & Urgency',
  },
  social_gallery: {
    label: "Community & Culture Fits (#StrideDistrict)",
    icon: '📸',
    frontendDescription: 'Controls the streetwear fit gallery ("MORE THAN A BRAND. IT\'S A CULTURE.") and 5 street community fit photos.',
    defaultTag: 'Culture & Community',
  },
  testimonials: {
    label: 'Customer Testimonials & Legit Check',
    icon: '⭐',
    frontendDescription: 'Controls customer reviews and 5-star ratings ("What Our Customers Say" with verified collector feedback).',
    defaultTag: 'Social Proof',
  },
  brand_showcase: {
    label: 'Featured Streetwear Brands Row',
    icon: '🏷️',
    frontendDescription: 'Controls the streetwear brand ticker at the bottom (NIKE, JORDAN, adidas, New Balance, Supreme, Stussy, Essentials, Dickies).',
    defaultTag: 'Brand Partners',
  },
  deal_of_the_day: {
    label: 'Drop of the Day Spotlight',
    icon: '🎯',
    frontendDescription: 'Spotlight showcase feature for a single hyped drop with live stock claims.',
    defaultTag: 'Spotlight Feature',
  },
  flash_sale: {
    label: 'Shock Drop Countdown Archive',
    icon: '⏳',
    frontendDescription: 'Limited Drop Archive with live countdown timer and shock release counter.',
    defaultTag: 'Timed Drop',
  },
  blog_section: {
    label: 'Culture, Legit Check & Drop Journal',
    icon: '📖',
    frontendDescription: 'Article previews featuring authentication guides, sneaker history, and sizing tips.',
    defaultTag: 'Drop Journal',
  },
  app_download: {
    label: 'VIP Drop Club / Mobile App Banner',
    icon: '📱',
    frontendDescription: 'Mobile app and VIP drops notification prompt with QR code.',
    defaultTag: 'VIP Club',
  },
};

export default function AdminHomepageBuilderPage() {
  const [sections, setSections] = useState<CMSSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Edit Section Modal & Complex Form State
  const [editingSection, setEditingSection] = useState<CMSSectionRecord | null>(null);
  const [sectionForm, setSectionForm] = useState<{
    title: string;
    subtitle: string;
    isEnabled: boolean;
    deviceVisibility: 'all' | 'desktop' | 'mobile';
  }>({
    title: '',
    subtitle: '',
    isEnabled: true,
    deviceVisibility: 'all',
  });
  const [customSettings, setCustomSettings] = useState<Record<string, any>>({});
  const [activeEditTab, setActiveEditTab] = useState<'content' | 'ads' | 'styling'>('content');

  // Add Section Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSectionType, setNewSectionType] = useState<CMSSectionRecord['type']>('product_grid');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Delete Section
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);

  // Reset Confirmation Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/cms/sections?page=home');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSections(json.data.sort((a: CMSSectionRecord, b: CMSSectionRecord) => a.order - b.order));
      }
    } catch (err) {
      console.error('Failed to load CMS sections', err);
      showToast('Failed to load CMS sections.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const saveSectionsToServer = async (newSections: CMSSectionRecord[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: newSections }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Homepage sections saved & live storefront updated in real time!', 'success');
      } else {
        showToast(json.error || 'Failed to update sections.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reorder sections
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const normalized = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSections(normalized);
    saveSectionsToServer(normalized);
  };

  // 1-Click Toggle enable/disable directly in list
  const handleToggle = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
    );
    setSections(updated);
    saveSectionsToServer(updated);
    const target = updated.find((s) => s.id === id);
    if (target) {
      showToast(
        `Section "${target.title}" is now ${target.isEnabled ? 'VISIBLE on live site' : 'HIDDEN from live site'}.`,
        'success'
      );
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (sec: CMSSectionRecord) => {
    setEditingSection(sec);
    setSectionForm({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      isEnabled: sec.isEnabled,
      deviceVisibility: sec.settings?.deviceVisibility || 'all',
    });
    setCustomSettings({ ...(sec.settings || {}) });
    setActiveEditTab('content');
  };

  // Save Edit Modal
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    const updated = sections.map((s) => {
      if (s.id === editingSection.id) {
        return {
          ...s,
          title: sectionForm.title,
          subtitle: sectionForm.subtitle,
          isEnabled: sectionForm.isEnabled,
          settings: {
            ...customSettings,
            deviceVisibility: sectionForm.deviceVisibility,
          },
        };
      }
      return s;
    });

    setSections(updated);
    saveSectionsToServer(updated);
    setEditingSection(null);
  };

  // Add Section
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = SECTION_METADATA[newSectionType] || { label: newSectionType };
    
    // Find matching seed settings if available
    const seedMatch = SEED_CMS_SECTIONS.find((s) => s.type === newSectionType);

    const newSec: CMSSectionRecord = {
      id: `sec-${Date.now()}`,
      page: 'home',
      type: newSectionType,
      title: newSectionTitle.trim() || meta.label,
      subtitle: seedMatch?.subtitle || 'Curated Streetwear Section',
      order: sections.length + 1,
      isEnabled: true,
      settings: {
        ...(seedMatch?.settings || {}),
        deviceVisibility: 'all',
      },
    };

    const updated = [...sections, newSec];
    setSections(updated);
    saveSectionsToServer(updated);
    setIsAddModalOpen(false);
    setNewSectionTitle('');
    showToast(`Added "${newSec.title}" to homepage!`, 'success');
  };

  // Delete Section
  const handleConfirmDelete = () => {
    if (!deleteSectionId) return;
    const updated = sections
      .filter((s) => s.id !== deleteSectionId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);
    saveSectionsToServer(updated);
    setDeleteSectionId(null);
    showToast('Section permanently removed from homepage.', 'success');
  };

  // Reset to Factory Defaults
  const handleResetDefaults = async () => {
    try {
      const res = await fetch('/api/v1/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSections(json.data.sort((a: CMSSectionRecord, b: CMSSectionRecord) => a.order - b.order));
        showToast('Homepage reset to factory default Stride District streetwear layout!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to reset defaults.', 'error');
    } finally {
      setIsResetModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Loading Homepage CMS Builder...</span>
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
        isOpen={!!deleteSectionId}
        title="Remove Section from Homepage"
        description="Are you sure you want to remove this section from the live storefront? All its settings will be deleted. You can always add it again or reset defaults."
        confirmText="Yes, Remove Section"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteSectionId(null)}
      />

      {/* Reset Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Homepage to Factory Defaults"
        description="This will restore all 7 core Stride District streetwear sections (Hero + Ads, Categories, New Arrivals, 40% Off Promo, Culture Gallery, Testimonials, Brands Row) with original texts and photos."
        confirmText="Reset to Defaults"
        onConfirm={handleResetDefaults}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* Navigation Quick Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
        <Link
          href="/admin/cms"
          className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-zinc-950 font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Homepage Builder</span>
        </Link>
        <Link
          href="/admin/header"
          className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
        >
          <MenuIcon className="w-3.5 h-3.5" />
          <span>Header & Navigation</span>
        </Link>
        <Link
          href="/admin/footer"
          className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Footer Management</span>
        </Link>
        <Link
          href="/admin/pages"
          className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Custom Pages</span>
        </Link>
        <Link
          href="/admin/blog"
          className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Blog / Articles</span>
        </Link>
        <Link
          href="/admin/seo"
          className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SEO Settings</span>
        </Link>
      </div>

      {/* Main Banner */}
      <FrontendMappingBanner
        title="Homepage Content & Section Manager"
        badge="Live Storefront: Main Homepage (/)"
        description="Hide, remove, reorder, customize, and edit every section of your website here (Hero text, Ads announcement bar, 40% Off promo banner, Community culture photos, and Brand ticker). All updates reflect on your live website instantly."
        controlsWhat="Live visual sections, headlines, promotional ads, buttons, images, and sequence from top to bottom."
        previewUrl="/"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'Homepage Sections' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors border border-zinc-700 flex items-center gap-1.5"
              title="Reset homepage to standard streetwear layout"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors border border-zinc-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Section</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Homepage</span>
            </Link>
          </div>
        }
      />

      {/* Visual Section Sequence List */}
      <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Homepage Section Sequence (Top to Bottom)</span>
              <span className="text-xs font-mono font-normal text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-700">
                {sections.filter((s) => s.isEnabled).length} of {sections.length} Visible
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Use <strong className="text-zinc-200">Up / Down arrows</strong> to reorder. Click <strong className="text-zinc-200">Enabled / Disabled</strong> to hide or show on the website instantly. Click <strong className="text-amber-400">Edit (pencil)</strong> to customize texts, ads, buttons, and photos.
            </p>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> Live on Storefront
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" /> Hidden / Draft
            </span>
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-3">
          {sections.map((section, index) => {
            const meta = SECTION_METADATA[section.type] || {
              label: section.title,
              icon: '📄',
              frontendDescription: 'Custom homepage component',
              defaultTag: 'Section',
            };

            const isHero = section.type === 'hero_slider';
            const hasHeroAds = isHero && section.settings?.showAdBanner !== false;
            const isPromo = section.type === 'promotional_banners' || section.type === 'flash_sale';
            const isCulture = section.type === 'social_gallery';
            const isBrands = section.type === 'brand_showcase';

            return (
              <div
                key={section.id}
                className={`p-4 rounded-xl border transition-all ${
                  section.isEnabled
                    ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-sm'
                    : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Reorder & Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Up / Down Controls */}
                    <div className="flex flex-col gap-1 shrink-0 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === sections.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Order Badge & Icon */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-xs font-bold flex items-center justify-center border border-zinc-700 shadow-inner">
                        {index + 1}
                      </span>
                      <span className="text-2xl">{meta.icon}</span>
                    </div>

                    {/* Title & Description */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{meta.label}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700 font-semibold">
                          {meta.defaultTag}
                        </span>
                        
                        {/* Special Badges for the 4 Sections */}
                        {isHero && hasHeroAds && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1 font-bold">
                            <Megaphone className="w-3 h-3" /> Ads Bar Active
                          </span>
                        )}
                        {isPromo && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold">
                            40% Off Sale Banner
                          </span>
                        )}
                        {isCulture && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
                            5 Fit Photos
                          </span>
                        )}
                        {isBrands && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold">
                            Brand Ticker
                          </span>
                        )}

                        {section.isEnabled ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Live
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                            Hidden / Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-1">
                        {meta.frontendDescription}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {/* Enable / Disable Toggle (1-Click Hide/Show) */}
                    <button
                      onClick={() => handleToggle(section.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        section.isEnabled
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-sm'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700'
                      }`}
                      title={section.isEnabled ? 'Click to hide this section from website' : 'Click to display this section on website'}
                    >
                      {section.isEnabled ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                      <span>{section.isEnabled ? 'Visible (Show)' : 'Hidden (Off)'}</span>
                    </button>

                    {/* Edit Section Settings */}
                    <button
                      onClick={() => handleOpenEdit(section)}
                      className="px-3 py-1.5 text-amber-400 hover:text-zinc-950 hover:bg-amber-400 rounded-xl transition-all border border-amber-400/30 flex items-center gap-1.5 text-xs font-bold bg-amber-400/10"
                      title="Edit Section Texts, Ads & Content"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>

                    {/* Delete Section */}
                    <button
                      onClick={() => setDeleteSectionId(section.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors border border-zinc-800 hover:border-rose-900"
                      title="Remove Section from Homepage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADVANCED EDIT SECTION MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#16191f] border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl">
                  {SECTION_METADATA[editingSection.type]?.icon || '⚙️'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Customize: {SECTION_METADATA[editingSection.type]?.label || editingSection.title}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Position #{editingSection.order} &bull; Type: <span className="text-amber-400">{editingSection.type}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Visibility Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Storefront Visibility Status
                </label>
                <select
                  value={sectionForm.isEnabled ? 'enabled' : 'disabled'}
                  onChange={(e) =>
                    setSectionForm({ ...sectionForm, isEnabled: e.target.value === 'enabled' })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="enabled">🟢 Visible on Live Homepage (Published)</option>
                  <option value="disabled">⚪ Hidden from Live Homepage (Draft / Inactive)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Device Visibility
                </label>
                <select
                  value={sectionForm.deviceVisibility}
                  onChange={(e: any) =>
                    setSectionForm({ ...sectionForm, deviceVisibility: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">🖥️ Desktop & 📱 Mobile</option>
                  <option value="desktop">🖥️ Desktop Only</option>
                  <option value="mobile">📱 Mobile Only</option>
                </select>
              </div>
            </div>

            {/* 1. TAILORED FORM FOR HERO SLIDER */}
            {editingSection.type === 'hero_slider' && (
              <div className="space-y-5">
                {/* HERO ADS & ANNOUNCEMENT BAR SECTION */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-900 border border-orange-500/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-orange-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Hero Announcement & Ads Bar (Top Alert)
                      </h4>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400">
                      <input
                        type="checkbox"
                        checked={customSettings.showAdBanner !== false}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, showAdBanner: e.target.checked })
                        }
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                      />
                      <span>Show Ads Bar in Hero</span>
                    </label>
                  </div>

                  {customSettings.showAdBanner !== false && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                            Ad Badge Tag
                          </label>
                          <input
                            type="text"
                            value={customSettings.adBadgeText || '🔥 HOT DROP'}
                            onChange={(e) =>
                              setCustomSettings({ ...customSettings, adBadgeText: e.target.value })
                            }
                            placeholder="e.g. 🔥 HOT DROP or ⚡ FLASH SALE"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                            Ad Link Text
                          </label>
                          <input
                            type="text"
                            value={customSettings.adLinkText || 'Shop Shock Drop'}
                            onChange={(e) =>
                              setCustomSettings({ ...customSettings, adLinkText: e.target.value })
                            }
                            placeholder="e.g. Shop Shock Drop"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                            Ad Target URL
                          </label>
                          <input
                            type="text"
                            value={customSettings.adLinkUrl || '/shop?filter=sale'}
                            onChange={(e) =>
                              setCustomSettings({ ...customSettings, adLinkUrl: e.target.value })
                            }
                            placeholder="e.g. /shop?filter=sale"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                          Ad Message Headline
                        </label>
                        <input
                          type="text"
                          value={customSettings.adText || ''}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, adText: e.target.value })
                          }
                          placeholder="e.g. MIDNIGHT DROP IS LIVE: 20% OFF SELECT GRAILS WITH CODE: CULTURE20 | FREE SHIPPING"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-[11px] font-semibold text-zinc-300 shrink-0">
                          Ad Bar Color:
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {['#f97316', '#ea580c', '#dc2626', '#84cc16', '#d97706', '#18181b'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setCustomSettings({ ...customSettings, adBgColor: color })}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                customSettings.adBgColor === color ? 'scale-125 border-white shadow-lg' : 'border-zinc-700'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                          <input
                            type="text"
                            value={customSettings.adBgColor || '#f97316'}
                            onChange={(e) =>
                              setCustomSettings({ ...customSettings, adBgColor: e.target.value })
                            }
                            className="w-24 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-[11px] text-zinc-300 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* HERO MAIN TEXTS */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                    <span>Hero Headlines & Streetwear Copy</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                        Top Tagline (Italic Lime)
                      </label>
                      <input
                        type="text"
                        value={customSettings.tagline || '@OWN THE STREETS'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, tagline: e.target.value })
                        }
                        placeholder="@OWN THE STREETS"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-lime-400 font-serif italic focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                        Main Title Line 1 (White)
                      </label>
                      <input
                        type="text"
                        value={customSettings.titleLine1 || 'BUILT FOR'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, titleLine1: e.target.value })
                        }
                        placeholder="BUILT FOR"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white font-black uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                        Main Title Highlight (Orange)
                      </label>
                      <input
                        type="text"
                        value={customSettings.titleHighlight || 'MOVEMENT'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, titleHighlight: e.target.value })
                        }
                        placeholder="MOVEMENT"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-orange-400 font-black uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Paragraph Description
                    </label>
                    <textarea
                      rows={2}
                      value={customSettings.description || ''}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, description: e.target.value })
                      }
                      placeholder="Exclusive sneakers and streetwear for the culture. For the bold. For you."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* HERO BUTTONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                        Primary Button (Orange Solid)
                      </span>
                      <input
                        type="text"
                        value={customSettings.primaryBtnText || 'Shop New Arrivals'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, primaryBtnText: e.target.value })
                        }
                        placeholder="Button Text"
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={customSettings.primaryBtnLink || '/shop?sort=newest'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, primaryBtnLink: e.target.value })
                        }
                        placeholder="Target URL (e.g. /shop?sort=newest)"
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">
                        Secondary Button (Bordered Outline)
                      </span>
                      <input
                        type="text"
                        value={customSettings.secondaryBtnText || 'Explore Looks'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, secondaryBtnText: e.target.value })
                        }
                        placeholder="Button Text"
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={customSettings.secondaryBtnLink || '/shop'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, secondaryBtnLink: e.target.value })
                        }
                        placeholder="Target URL (e.g. /shop)"
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* BACKGROUND & WATERMARK */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Hero Background Image & Visual Style</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Hero Background Image URL
                    </label>
                    <input
                      type="text"
                      value={customSettings.backgroundImage || ''}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, backgroundImage: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                    {customSettings.backgroundImage && (
                      <div className="mt-2 h-24 w-full rounded-lg overflow-hidden border border-zinc-700 relative">
                        <img
                          src={customSettings.backgroundImage}
                          alt="Hero Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                        Floating Watermark Text
                      </label>
                      <input
                        type="text"
                        value={customSettings.watermarkText || 'STRIDE DISTRICT'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, watermarkText: e.target.value })
                        }
                        placeholder="STRIDE DISTRICT"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="showWatermarkCheck"
                        checked={customSettings.showWatermark !== false}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, showWatermark: e.target.checked })
                        }
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                      />
                      <label htmlFor="showWatermarkCheck" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                        Display Floating Watermark Text
                      </label>
                    </div>
                  </div>
                </div>

                {/* TRUST BADGES BAR */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>Trust Badges Bar (Hero Bottom)</span>
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-300">
                      <input
                        type="checkbox"
                        checked={customSettings.showTrustBadges !== false}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, showTrustBadges: e.target.checked })
                        }
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                      />
                      <span>Show Trust Badges</span>
                    </label>
                  </div>

                  {customSettings.showTrustBadges !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] font-bold text-orange-400 block mb-1">Badge 1</span>
                        <input
                          type="text"
                          value={customSettings.badge1Title || '100% Authentic'}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, badge1Title: e.target.value })
                          }
                          className="w-full px-2 py-1 mb-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-bold"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={customSettings.badge1Sub || 'Guaranteed'}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, badge1Sub: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-400"
                          placeholder="Subtitle"
                        />
                      </div>

                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] font-bold text-orange-400 block mb-1">Badge 2</span>
                        <input
                          type="text"
                          value={customSettings.badge2Title || 'Easy Returns'}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, badge2Title: e.target.value })
                          }
                          className="w-full px-2 py-1 mb-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-bold"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={customSettings.badge2Sub || '14-Day Policy'}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, badge2Sub: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-400"
                          placeholder="Subtitle"
                        />
                      </div>

                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] font-bold text-orange-400 block mb-1">Badge 3</span>
                        <input
                          type="text"
                          value={customSettings.badge3Title || 'Secure Checkout'}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, badge3Title: e.target.value })
                          }
                          className="w-full px-2 py-1 mb-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-bold"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={customSettings.badge3Sub || 'Shop with Confidence'}
                          onChange={(e) =>
                            setCustomSettings({ ...customSettings, badge3Sub: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-400"
                          placeholder="Subtitle"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. TAILORED FORM FOR PROMOTIONAL SALE BANNER (40% OFF) */}
            {(editingSection.type === 'promotional_banners' || editingSection.type === 'flash_sale') && (
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Promotional Sale Banner (Up to 40% Off)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Corner Tagline (Italic Yellow)
                    </label>
                    <input
                      type="text"
                      value={customSettings.tagline || 'LIMITED TIME ONLY'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, tagline: e.target.value })
                      }
                      placeholder="LIMITED TIME ONLY"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-yellow-300 font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Big Discount Heading
                    </label>
                    <input
                      type="text"
                      value={customSettings.heading || 'UP TO 40% OFF'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, heading: e.target.value })
                      }
                      placeholder="UP TO 40% OFF"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Right Subtitle Text
                    </label>
                    <input
                      type="text"
                      value={customSettings.subtitle || 'ON SELECT STYLES'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, subtitle: e.target.value })
                      }
                      placeholder="ON SELECT STYLES"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={customSettings.btnText || 'Shop The Sale'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, btnText: e.target.value })
                      }
                      placeholder="Shop The Sale"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      CTA Button URL
                    </label>
                    <input
                      type="text"
                      value={customSettings.btnLink || '/shop?filter=sale'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, btnLink: e.target.value })
                      }
                      placeholder="/shop?filter=sale"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-300 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-3">
                    <label className="text-[11px] font-semibold text-zinc-300">
                      Background Color:
                    </label>
                    <div className="flex items-center gap-2">
                      {['#f97316', '#ea580c', '#c2410c', '#dc2626', '#18181b'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCustomSettings({ ...customSettings, bgColor: c })}
                          className={`w-6 h-6 rounded-full border-2 ${
                            customSettings.bgColor === c ? 'scale-125 border-white' : 'border-zinc-700'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <input
                        type="text"
                        value={customSettings.bgColor || '#f97316'}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, bgColor: e.target.value })
                        }
                        className="w-20 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-300">
                    <input
                      type="checkbox"
                      checked={customSettings.showSmileWatermark !== false}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, showSmileWatermark: e.target.checked })
                      }
                      className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Show Smiley Graphic</span>
                  </label>
                </div>
              </div>
            )}

            {/* 3. TAILORED FORM FOR COMMUNITY & CULTURE GALLERY */}
            {editingSection.type === 'social_gallery' && (
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Streetwear Community & Culture Section</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Title Line 1 (White)
                    </label>
                    <input
                      type="text"
                      value={customSettings.headingLine1 || 'MORE THAN A BRAND.'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, headingLine1: e.target.value })
                      }
                      placeholder="MORE THAN A BRAND."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white font-black uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Title Highlight (Orange)
                    </label>
                    <input
                      type="text"
                      value={customSettings.headingHighlight || "IT'S A CULTURE."}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, headingHighlight: e.target.value })
                      }
                      placeholder="IT'S A CULTURE."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-orange-400 font-black uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={customSettings.description || ''}
                    onChange={(e) =>
                      setCustomSettings({ ...customSettings, description: e.target.value })
                    }
                    placeholder="Stride District is built on passion, creativity, and community..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={customSettings.btnText || 'Join The District'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, btnText: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={customSettings.btnLink || '/community'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, btnLink: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-300 font-mono"
                    />
                  </div>
                </div>

                {/* 5 Fit Gallery Images */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    5 Streetwear Fit Photos (Image URLs)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const currentImages = customSettings.images || [];
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 w-4">{idx + 1}.</span>
                          <input
                            type="text"
                            value={currentImages[idx] || ''}
                            onChange={(e) => {
                              const newImgs = [...(currentImages || [])];
                              newImgs[idx] = e.target.value;
                              setCustomSettings({ ...customSettings, images: newImgs });
                            }}
                            placeholder={`Fit photo ${idx + 1} URL`}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-[11px] text-zinc-300 font-mono"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TAILORED FORM FOR TOP BRANDS ROW */}
            {editingSection.type === 'brand_showcase' && (
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-400" />
                  <span>Featured Streetwear Brands Ticker Row</span>
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Streetwear Brand Names (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={customSettings.brands || 'NIKE, JORDAN, adidas, NB, Supreme, stussy, ESSENTIALS, Dickies'}
                    onChange={(e) =>
                      setCustomSettings({ ...customSettings, brands: e.target.value })
                    }
                    placeholder="NIKE, JORDAN, adidas, NB, Supreme, stussy, ESSENTIALS, Dickies"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white font-bold"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Separate brand names by commas. "Supreme" will automatically get its signature red rectangular styling.
                  </p>
                </div>

                {/* Live Brand Preview Badges */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                    Live Brand Ticker Preview:
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {(customSettings.brands || 'NIKE, JORDAN, adidas, NB, Supreme, stussy, ESSENTIALS, Dickies')
                      .split(',')
                      .map((b: string) => b.trim())
                      .filter(Boolean)
                      .map((brandName: string, i: number) => {
                        const isSupreme = brandName.toLowerCase() === 'supreme';
                        return (
                          <span
                            key={i}
                            className={`text-xs font-bold ${
                              isSupreme
                                ? 'bg-red-600 text-white px-2 py-0.5 italic'
                                : 'text-zinc-300 bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded-md'
                            }`}
                          >
                            {brandName}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* 5. FORM FOR FEATURED CATEGORIES & PRODUCT GRID */}
            {(editingSection.type === 'featured_categories' || editingSection.type === 'product_grid') && (
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Category & Catalog Display Settings</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Section Headline
                    </label>
                    <input
                      type="text"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Section Subtitle / Description
                    </label>
                    <input
                      type="text"
                      value={sectionForm.subtitle}
                      onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      View All Button Text
                    </label>
                    <input
                      type="text"
                      value={customSettings.viewAllText || 'View All'}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, viewAllText: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Items to Display
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={customSettings.itemsCount || (editingSection.type === 'featured_categories' ? 4 : 5)}
                      onChange={(e) =>
                        setCustomSettings({ ...customSettings, itemsCount: parseInt(e.target.value) || 4 })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. GENERIC SECTION SETTINGS FOR OTHERS */}
            {editingSection.type === 'testimonials' && (
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Testimonials & Reviews</span>
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Section Headline
                  </label>
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving & Publishing...' : 'Save & Publish Live'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleAddSection}
            className="bg-[#16191f] border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" /> Add Section to Homepage
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Choose Section Type
                </label>
                <select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value as CMSSectionRecord['type'])}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {Object.entries(SECTION_METADATA).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.icon} {meta.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Custom Section Title (Optional)
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Leave blank to use default name"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                {SECTION_METADATA[newSectionType]?.frontendDescription}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold shadow-md"
              >
                Add to Homepage
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
