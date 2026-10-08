'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Search,
  Eye,
  Calendar,
  Layers,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { CustomPageRecord } from '@/lib/db/schema';

export default function AdminCustomPagesPage() {
  const [pages, setPages] = useState<CustomPageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPageRecord | null>(null);
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    content: '',
    category: 'company' as 'company' | 'policy' | 'campaign' | 'support',
    metaTitle: '',
    metaDescription: '',
    status: 'published' as 'published' | 'draft',
  });

  // Delete State
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/pages');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPages(json.data);
      }
    } catch (err) {
      console.error('Failed to load pages', err);
      showToast('Failed to load custom pages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPage(null);
    setPageForm({
      title: '',
      slug: '',
      subtitle: '',
      content: '',
      category: 'company',
      metaTitle: '',
      metaDescription: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: CustomPageRecord) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      subtitle: page.subtitle || '',
      content: page.content,
      category: page.category,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      status: page.status,
    });
    setIsModalOpen(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title.trim() || !pageForm.slug.trim() || !pageForm.content.trim()) {
      showToast('Title, slug, and content are required.', 'error');
      return;
    }

    try {
      if (editingPage) {
        // PUT update
        const res = await fetch(`/api/v1/pages/${editingPage.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageForm),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Page "${pageForm.title}" updated successfully!`, 'success');
          setIsModalOpen(false);
          fetchPages();
        } else {
          showToast(json.error || 'Failed to update page.', 'error');
        }
      } else {
        // POST create
        const res = await fetch('/api/v1/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageForm),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Page "${pageForm.title}" published successfully!`, 'success');
          setIsModalOpen(false);
          fetchPages();
        } else {
          showToast(json.error || 'Failed to create page.', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/pages/${deleteSlug}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Page deleted successfully.', 'success');
        setDeleteSlug(null);
        fetchPages();
      } else {
        showToast(json.error || 'Failed to delete page.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPages = pages.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

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
        isOpen={!!deleteSlug}
        title="Delete Custom Page"
        description="Are you sure you want to permanently delete this page? Its URL will no longer be accessible to customers."
        confirmText="Delete Page"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteSlug(null)}
      />

      {/* Header Banner */}
      <FrontendMappingBanner
        title="Custom Pages"
        badge="Frontend Control: Standalone Pages"
        description="Manage standalone informational pages like About Us, Sustainability Charter, FAQs, Privacy Policy, and Terms of Service."
        controlsWhat="The content and SEO settings for all custom informational routes on the website."
        previewUrl="/about"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'Custom Pages' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        }
      />

      {/* Main Pages Table */}
      <div className="bg-[#14171d] border border-zinc-200 rounded-2xl p-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by page title or slug..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium focus:outline-none focus:border-amber-400"
            />
          </div>
          <span className="text-xs font-mono text-zinc-800 font-semibold font-medium">
            {filteredPages.length} {filteredPages.length === 1 ? 'Page' : 'Pages'} Configured
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-800 font-semibold font-medium">
            Loading pages catalog...
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-12 text-center text-zinc-800 font-semibold space-y-2">
            <p className="text-sm font-semibold">No pages match your search.</p>
            <p className="text-xs text-zinc-800 font-semibold font-medium">Click &ldquo;Create New Page&rdquo; above to add one.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/60">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-zinc-50/40 px-3 rounded-xl transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-zinc-900 font-bold group-hover:text-amber-300 transition-colors">
                      {page.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-zinc-100 text-zinc-800 font-bold border border-zinc-300 capitalize">
                      {page.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold ${
                        page.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-300'
                      }`}
                    >
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-800 font-semibold font-mono">
                    <span>/{page.slug}</span>
                    <span>&bull;</span>
                    <span className="line-clamp-1 max-w-md font-sans text-zinc-800 font-semibold font-medium">
                      {page.metaDescription}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/${page.slug}`}
                    target="_blank"
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-750 text-zinc-800 font-bold hover:text-zinc-900 font-bold text-xs font-semibold flex items-center gap-1.5 border border-zinc-300/60 transition-colors"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </Link>
                  <button
                    onClick={() => handleOpenEdit(page)}
                    className="p-1.5 text-zinc-800 font-semibold hover:text-zinc-900 font-bold hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
                    title="Edit page"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteSlug(page.slug)}
                    className="p-1.5 text-zinc-800 font-semibold font-medium hover:text-rose-400 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Page Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSavePage}
            className="bg-[#16191f] border border-zinc-200 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 font-bold">
                {editingPage ? `Edit Page: ${editingPage.title}` : 'Create New Custom Page'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-800 font-semibold font-medium hover:text-zinc-900 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setPageForm({
                        ...pageForm,
                        title,
                        slug: editingPage ? pageForm.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      });
                    }}
                    placeholder="e.g. Circular Design & Packaging"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                    placeholder="e.g. circular-design"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={pageForm.category}
                    onChange={(e: any) => setPageForm({ ...pageForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="company">Company & Culture</option>
                    <option value="policy">Legal Policy</option>
                    <option value="support">Customer Support</option>
                    <option value="campaign">Campaign & Story</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    Publication Status
                  </label>
                  <select
                    value={pageForm.status}
                    onChange={(e: any) => setPageForm({ ...pageForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="published">Published & Live</option>
                    <option value="draft">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                  Page Content (Markdown / HTML supported) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={pageForm.content}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  placeholder="Write the full page body content here..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <span className="text-xs font-bold text-zinc-900 font-bold block">Search Engine (SEO) Meta</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={pageForm.metaTitle}
                    onChange={(e) => setPageForm({ ...pageForm, metaTitle: e.target.value })}
                    placeholder="SEO Meta Title (e.g. The Culture of Authenticity | Stride District)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-850 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                  <textarea
                    rows={2}
                    value={pageForm.metaDescription}
                    onChange={(e) => setPageForm({ ...pageForm, metaDescription: e.target.value })}
                    placeholder="SEO Meta Description for Google search results..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-850 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold"
              >
                {editingPage ? 'Save Changes' : 'Publish Page'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
