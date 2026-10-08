'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Search,
  Clock,
  User,
  Tag,
  Calendar,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { BlogPostRecord } from '@/lib/db/schema';

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostRecord | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Culture & Grails',
    coverImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
    readTimeMinutes: 5,
    tagsString: 'Sneakers, Legit Check, Streetwear',
    status: 'published' as 'published' | 'draft',
  });

  // Delete State
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/blogs');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBlogs(json.data);
      }
    } catch (err) {
      console.error('Failed to load blog posts', err);
      showToast('Failed to load articles.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Culture & Grails',
      coverImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
      readTimeMinutes: 5,
      tagsString: 'Sneakers, Legit Check, Streetwear',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPostRecord) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      coverImage: blog.coverImage,
      readTimeMinutes: blog.readTimeMinutes,
      tagsString: (blog.tags || []).join(', '),
      status: (blog.status as any) || 'published',
    });
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.slug.trim() || !blogForm.content.trim()) {
      showToast('Title, slug, and content are required.', 'error');
      return;
    }

    const payload = {
      ...blogForm,
      tags: blogForm.tagsString.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingBlog) {
        const res = await fetch(`/api/v1/blogs/${editingBlog.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Article "${blogForm.title}" updated successfully!`, 'success');
          setIsModalOpen(false);
          fetchBlogs();
        } else {
          showToast(json.error || 'Failed to update article.', 'error');
        }
      } else {
        const res = await fetch('/api/v1/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Article "${blogForm.title}" published!`, 'success');
          setIsModalOpen(false);
          fetchBlogs();
        } else {
          showToast(json.error || 'Failed to publish article.', 'error');
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
      const res = await fetch(`/api/v1/blogs/${deleteSlug}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Article deleted successfully.', 'success');
        setDeleteSlug(null);
        fetchBlogs();
      } else {
        showToast(json.error || 'Failed to delete article.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with server.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q)
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
        title="Delete Article"
        description="Are you sure you want to permanently delete this journal article? It will be removed from /blog and the homepage."
        confirmText="Delete Article"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteSlug(null)}
      />

      {/* Banner */}
      <FrontendMappingBanner
        title="Journal & Blog Articles"
        badge="Frontend Control: /blog & Home"
        description="Publish luxury engineering whitepapers, material studies, and horological journal stories for your brand collectors."
        controlsWhat="The editorial articles displayed under the /blog route and the homepage Journal preview section."
        previewUrl="/blog"
        breadcrumbs={[{ label: 'Website Content', href: '/admin/cms' }, { label: 'Blog / Articles' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        }
      />

      {/* Main Articles Container */}
      <div className="bg-[#14171d] border border-zinc-200 rounded-2xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium focus:outline-none focus:border-amber-400"
            />
          </div>
          <span className="text-xs font-mono text-zinc-800 font-semibold font-medium">
            {filteredBlogs.length} Articles Published
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-800 font-semibold font-medium">
            Loading articles archive...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-12 text-center text-zinc-800 font-semibold space-y-2">
            <p className="text-sm font-semibold">No articles match your query.</p>
            <p className="text-xs text-zinc-800 font-semibold font-medium">Click &ldquo;Write New Article&rdquo; above to publish your first story.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="rounded-2xl border border-zinc-200 bg-zinc-50/80 overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-all group"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-44 w-full bg-zinc-850 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 font-bold border border-white/10">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-800 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {blog.readTimeMinutes} min read
                      </span>
                      <span>&bull;</span>
                      <span>{blog.publishedAt}</span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 font-bold line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {blog.title}
                    </h4>

                    <p className="text-xs text-zinc-800 font-semibold line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-2 border-t border-zinc-200/80 flex items-center justify-between">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-zinc-800 font-semibold hover:text-zinc-900 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Read Live</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className="p-1.5 text-zinc-800 font-semibold hover:text-zinc-900 font-bold hover:bg-zinc-100 rounded-lg transition-colors"
                      title="Edit article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteSlug(blog.slug)}
                      className="p-1.5 text-zinc-800 font-semibold font-medium hover:text-rose-400 hover:bg-zinc-100 rounded-lg transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveBlog}
            className="bg-[#16191f] border border-zinc-200 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 font-bold">
                {editingBlog ? `Edit Article: ${editingBlog.title}` : 'Write New Journal Article'}
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
              <div>
                <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setBlogForm({
                      ...blogForm,
                      title,
                      slug: editingBlog ? blogForm.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    });
                  }}
                  placeholder="e.g. The Acoustic Physics of Beryllium Transducers"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="e.g. air-jordan-1-legit-check-guide"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    placeholder="e.g. Culture & Grails, Authentication Lab, Style & Guides"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={blogForm.coverImage}
                  onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                  Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="One or two sentences summarizing the article..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write the full narrative or whitepaper content here..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    Read Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={blogForm.readTimeMinutes}
                    onChange={(e) => setBlogForm({ ...blogForm, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={blogForm.tagsString}
                    onChange={(e) => setBlogForm({ ...blogForm, tagsString: e.target.value })}
                    placeholder="e.g. Sneakers, Air Jordan, Streetwear, Supreme"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
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
                {editingBlog ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
