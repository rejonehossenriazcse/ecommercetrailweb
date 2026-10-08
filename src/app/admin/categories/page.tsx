'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CATEGORIES } from '@/data/mockData';
import { Category } from '@/types';
import { Plus, Trash2, Edit3, Layers, ArrowRight, X } from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([...CATEGORIES]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80');
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description,
      image,
      itemCount: 0,
      isFeatured: true,
    };

    setCategories([newCat, ...categories]);
    setIsModalOpen(false);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleConfirmDelete = () => {
    if (!deleteCategoryId) return;
    setCategories(categories.filter((c) => c.id !== deleteCategoryId));
    setDeleteCategoryId(null);
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteCategoryId}
        title="Delete Category"
        description="Are you sure you want to remove this product category? Products currently assigned to this category will need to be recategorized."
        confirmText="Delete Category"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCategoryId(null)}
      />

      {/* Header Banner */}
      <FrontendMappingBanner
        title="Product Categories"
        badge="Frontend Control: Header Mega-Menu & Grids"
        description="Organize your streetwear and sneaker catalog into clear categories. These power the header dropdown mega-menu, homepage category showcase, and shop filters."
        controlsWhat="The header navigation Categories dropdown, homepage category cards, and /shop filtering sidebar."
        previewUrl="/shop"
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Categories' }]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Category</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group rounded-3xl bg-[#14181f] border border-zinc-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-16/9 w-full bg-zinc-100">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14181f] via-transparent to-transparent" />
              <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-mono font-bold">
                {cat.itemCount} Products
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold mb-1">
                  Slug: {cat.slug}
                </div>
                <h3 className="text-base font-bold text-zinc-900 font-bold">{cat.name}</h3>
                <p className="text-xs text-zinc-800 font-semibold mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {cat.subcategories && (
                <div className="space-y-1 pt-2 border-t border-zinc-200">
                  <div className="text-[10px] font-mono uppercase text-zinc-800 font-semibold font-medium font-bold">Sub-categories:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-bold text-[10px] font-mono">
                        {s.name} ({s.itemCount})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-800 font-semibold">
                <span className="text-[11px] font-mono">Storefront: {cat.isFeatured ? 'Featured' : 'Standard'}</span>
                <button
                  onClick={() => setDeleteCategoryId(cat.id)}
                  className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-zinc-100 transition-colors cursor-pointer"
                  title="Remove category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-zinc-900 font-bold rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 font-bold">Create New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-800 font-semibold hover:text-zinc-900 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  placeholder="e.g. Graphic T-Shirts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. graphic-tees"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Vintage-washed graphics, drop-shoulder silhouettes, and heavy cotton tees..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-800 font-semibold hover:text-zinc-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
