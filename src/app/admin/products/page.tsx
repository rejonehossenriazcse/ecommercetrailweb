'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Package,
  Download,
  Upload,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importResult, setImportResult] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductTarget, setDeleteProductTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const DEFAULT_FORM_DATA = {
    name: '',
    brand: 'Jordan',
    category: 'Sneakers',
    sku: '',
    price: 180,
    compareAtPrice: 220,
    stock: 25,
    type: 'simple' as 'simple' | 'variable' | 'bundle' | 'digital' | 'subscription' | 'gift_card' | 'service',
    digitalFileUrl: '',
    subscriptionInterval: 'monthly' as 'monthly' | 'quarterly' | 'annual',
    shortDescription: '',
    thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  };

  // Form states for new/edit product
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const fetchProducts = () => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProducts(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      sku: product.sku || '',
      price: product.price || 0,
      compareAtPrice: product.compareAtPrice || 0,
      stock: product.stock || 0,
      type: (product.type as any) || 'simple',
      digitalFileUrl: product.digitalFileUrl || '',
      subscriptionInterval: (product.subscriptionInterval as any) || 'monthly',
      shortDescription: product.shortDescription || '',
      thumbnail: product.thumbnail || '',
    });
    setIsAddModalOpen(true);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/v1/products/${editingProduct.id}` : '/api/v1/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      setIsAddModalOpen(false);
      setEditingProduct(null);
      setFormData(DEFAULT_FORM_DATA);
      fetchProducts();
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteProductTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/products/${deleteProductTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProductTarget.id));
        setDeleteProductTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleQuickUpdate = async (id: string, updates: Partial<Product>) => {
    const res = await fetch(`/api/v1/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.map((p) => (p.id === id ? data.data : p)));
    }
  };

  const handleExportCSV = () => {
    const headers = ['id', 'sku', 'name', 'brand', 'category', 'price', 'compareAtPrice', 'stock', 'stockStatus', 'type', 'thumbnail', 'shortDescription'];
    const rows = products.map((p) => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.brand}"`,
      `"${p.category}"`,
      p.price,
      p.compareAtPrice || '',
      p.stock,
      p.stockStatus,
      p.type || 'simple',
      `"${p.thumbnail}"`,
      `"${p.shortDescription?.replace(/"/g, '""') || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stride_catalog_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    try {
      let parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) parsed = [parsed];
      const res = await fetch('/api/v1/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: parsed }),
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(`✓ Successfully imported ${data.importedCount} new, updated ${data.updatedCount} products.`);
        fetchProducts();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportResult('');
          setImportJsonText('');
        }, 1500);
      } else {
        setImportResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setImportResult(`Invalid JSON: ${err.message}`);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteProductTarget}
        title="Delete Product"
        description={`Are you sure you want to permanently remove "${deleteProductTarget?.name}"? It will no longer appear on the storefront.`}
        confirmText="Delete Product"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteProductTarget(null)}
      />

      {/* Header Banner */}
      <FrontendMappingBanner
        title="Products Catalog"
        badge="Frontend Control: Products & Shop"
        description="Add new luxury designs, adjust prices, edit specifications, and track inventory across all storefront categories."
        controlsWhat="All product display cards on the homepage, /shop catalog, search results, and /product/[slug] details."
        previewUrl="/shop"
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Products' }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-300"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-300"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Import (.JSON/.CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setFormData(DEFAULT_FORM_DATA);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-[#14181f] border border-zinc-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or brand (Jordan, Supreme, Nike)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Hoodies & Fleece">Hoodies & Fleece</option>
          <option value="T-Shirts & Tops">T-Shirts & Tops</option>
          <option value="Accessories & Carry">Accessories & Carry</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-[#14181f] border border-zinc-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1217] border-b border-zinc-200 text-zinc-800 font-semibold font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Product Item</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (USD)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 text-zinc-800 font-bold">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-100/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-300/50">
                        <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 font-bold line-clamp-1">{product.name}</div>
                        <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">{product.brand}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-semibold text-zinc-800 font-semibold">{product.sku}</td>

                  <td className="p-4">{product.category}</td>

                  <td className="p-4 font-mono font-bold text-zinc-900 font-bold">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="p-4 font-mono">
                    <span className={product.stock <= 5 ? 'text-rose-400 font-bold' : 'text-zinc-700'}>
                      {product.stock} units
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.stockStatus === 'in_stock'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : product.stockStatus === 'low_stock'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {product.stockStatus.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-zinc-800 font-semibold hover:text-amber-400 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-zinc-800 font-semibold hover:text-rose-400 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#14181f] text-zinc-900 font-bold rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 font-bold">
                {editingProduct ? 'Edit Product' : 'Create New Product Drop'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-lg text-zinc-800 font-semibold hover:text-zinc-900 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Air Jordan 4 Retro 'Military Black'"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">Brand / Label</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Jordan, Nike, Supreme"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Hoodies & Fleece">Hoodies & Fleece</option>
                    <option value="T-Shirts & Tops">T-Shirts & Tops</option>
                    <option value="Accessories & Carry">Accessories & Carry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. AJ4-MIL-BLK"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">High-Res Image URL</label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">Product Type</label>
                  <select
                    value={formData.type}
                    onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="simple">Standard Sneaker / Streetwear Item</option>
                    <option value="variable">Sized Footwear / Apparel (Multiple Sizes)</option>
                    <option value="bundle">Curated Drop Bundle</option>
                    <option value="gift_card">Storefront Gift Card Voucher</option>
                    <option value="service">Legit Check & Authentication Pass</option>
                  </select>
                </div>

                {formData.type === 'digital' && (
                  <div>
                    <label className="font-bold text-zinc-800 font-bold block mb-1">Digital Asset Download URL</label>
                    <input
                      type="text"
                      value={formData.digitalFileUrl}
                      onChange={(e) => setFormData({ ...formData, digitalFileUrl: e.target.value })}
                      placeholder="https://assets.stridedistrict.com/downloads/lookbook.pdf"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                )}

                {formData.type === 'subscription' && (
                  <div>
                    <label className="font-bold text-zinc-800 font-bold block mb-1">Billing Interval</label>
                    <select
                      value={formData.subscriptionInterval}
                      onChange={(e: any) => setFormData({ ...formData, subscriptionInterval: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                    >
                      <option value="monthly">Monthly Cycle</option>
                      <option value="quarterly">Quarterly Dispatch</option>
                      <option value="annual">Annual District VIP Pass</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Short Description</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={3}
                  placeholder="Summary of materials, transducers, and design architecture..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl text-zinc-800 font-semibold hover:text-zinc-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish to Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Catalog Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#14181f] text-zinc-900 font-bold rounded-3xl w-full max-w-xl p-6 sm:p-8 border border-zinc-200 shadow-2xl relative">
            <button
              onClick={() => {
                setIsImportModalOpen(false);
                setImportResult('');
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-zinc-900 font-bold">Bulk Catalog Import</h3>
            </div>
            <p className="text-xs text-zinc-800 font-semibold mb-4">
              Paste catalog records in JSON format (array of objects) or CSV schema. Products with existing SKUs will be updated; new SKUs will be created.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-800 font-bold mb-1">
                  Catalog JSON Payload
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  rows={8}
                  placeholder={`[\n  {\n    "sku": "AUR-IMP-01",\n    "name": "Beryllium Reference Amp",\n    "price": 890,\n    "category": "Audio & Acoustics",\n    "stock": 15\n  }\n]`}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-400"
                  required
                />
              </div>

              {importResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    importResult.startsWith('✓')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {importResult}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-800 font-semibold hover:text-zinc-900 font-bold text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-900 font-bold text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Execute Bulk Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
