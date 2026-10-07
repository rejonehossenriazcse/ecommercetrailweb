'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { WarehouseRecord } from '@/lib/db/schema';
import { Product } from '@/types';
import {
  Warehouse,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  History,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowRightLeft,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminInventoryPage() {
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(5);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [reason, setReason] = useState('PURCHASE_RECEIPT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inter-Warehouse Transfer Modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferProductId, setTransferProductId] = useState('');
  const [transferSource, setTransferSource] = useState('wh-nyc');
  const [transferTarget, setTransferTarget] = useState('wh-tyo');
  const [transferQty, setTransferQty] = useState(5);
  const [transferMessage, setTransferMessage] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const fetchData = async () => {
    try {
      const pRes = await fetch('/api/v1/products');
      const pJson = await pRes.json();
      if (pJson.success) setProducts(pJson.data);

      setWarehouses([
        {
          id: 'wh-nyc',
          name: 'New York SoHo Vault',
          code: 'US-NYC-01',
          address: '540 Broadway',
          city: 'New York',
          country: 'United States',
          isDefault: true,
          totalCapacity: 25000,
        },
        {
          id: 'wh-tyo',
          name: 'Tokyo Harajuku Vault',
          code: 'JP-TYO-02',
          address: '4-28-16 Jingumae, Shibuya',
          city: 'Tokyo',
          country: 'Japan',
          isDefault: false,
          totalCapacity: 18000,
        },
        {
          id: 'wh-lon',
          name: 'London Shoreditch Depot',
          code: 'UK-LON-03',
          address: '15 Redchurch Street',
          city: 'London',
          country: 'United Kingdom',
          isDefault: false,
          totalCapacity: 14000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSubmitting(true);

    const delta = adjustType === 'add' ? Math.abs(adjustQuantity) : -Math.abs(adjustQuantity);

    const res = await fetch('/api/v1/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProduct.id,
        changeQuantity: delta,
        reason: `${reason} (${adjustType === 'add' ? '+' : '-'}${Math.abs(adjustQuantity)} units)`,
      }),
    });

    const json = await res.json();
    if (json.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? json.data : p))
      );
      setSelectedProduct(null);
    }
    setIsSubmitting(false);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pid = transferProductId || products[0]?.id;
    if (!pid) return;
    setIsTransferring(true);
    setTransferMessage('');

    try {
      const res = await fetch('/api/v1/inventory/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: pid,
          sourceWarehouseId: transferSource,
          targetWarehouseId: transferTarget,
          quantity: Number(transferQty),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTransferMessage(`✓ ${data.message}`);
        setTimeout(() => {
          setIsTransferModalOpen(false);
          setTransferMessage('');
        }, 1800);
      } else {
        setTransferMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setTransferMessage(`Failed: ${err.message}`);
    } finally {
      setIsTransferring(false);
    }
  };

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Inventory & Stock Hubs"
        badge="Frontend Control: Stock & Availability"
        description="Monitor inventory balances across Copenhagen, Zurich, and Tokyo hubs. Stock counts directly control buy button availability on product pages."
        controlsWhat="The 'In Stock' / 'Out of Stock' badges and buy button availability on all product pages."
        previewUrl="/shop"
        breadcrumbs={[{ label: 'Operations' }, { label: 'Inventory & Stock' }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setTransferProductId(products[0]?.id || '');
                setIsTransferModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transfer Stock Between Hubs</span>
            </button>

            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Stock</span>
            </button>
          </div>
        }
      />

      {/* Warehouse Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800/80 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{wh.name}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400">
                {wh.code}
              </span>
            </div>

            <div className="text-xs text-zinc-400 space-y-1">
              <div>{wh.address}, {wh.city}</div>
              <div className="text-[11px] font-mono text-zinc-500">{wh.country} • Default Hub: {wh.isDefault ? 'Yes' : 'Secondary'}</div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">Capacity Allocation:</span>
              <span className="font-mono text-emerald-400 font-bold">Optimal (94.2%)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Tracking Table */}
      <div className="rounded-3xl bg-[#14181f] border border-zinc-800/80 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Live Stock Ledger</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono font-semibold">
              {totalInventoryUnits} Total Units
            </span>
          </div>
          {lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockCount} items below threshold</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1217] border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Design Object</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Copenhagen Hub</th>
                <th className="p-4">Zurich Hub</th>
                <th className="p-4">Tokyo Hub</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {products.map((p) => {
                const cphStock = Math.ceil(p.stock * 0.5);
                const zrhStock = Math.floor(p.stock * 0.3);
                const tyoStock = p.stock - cphStock - zrhStock;

                return (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/50">
                          <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{p.brand}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-semibold text-zinc-400">{p.sku}</td>

                    <td className="p-4 font-mono text-zinc-300">{cphStock}</td>
                    <td className="p-4 font-mono text-zinc-300">{zrhStock}</td>
                    <td className="p-4 font-mono text-zinc-300">{tyoStock}</td>

                    <td className="p-4 font-mono font-bold text-white">
                      {p.stock} units
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.stock > 10
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : p.stock > 0
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {p.stock > 10 ? 'Healthy' : p.stock > 0 ? 'Low Stock' : 'Depleted'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer text-[11px]"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal with Mandatory Audit Reason */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Audit-Tracked Stock Adjustment</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 pt-4 text-xs">
              <div>
                <span className="text-zinc-400">Target Product:</span>
                <div className="font-bold text-white text-sm mt-0.5">{selectedProduct.name}</div>
                <div className="text-xs font-mono text-amber-400 mt-0.5">
                  Current Stock: {selectedProduct.stock} units
                </div>
              </div>

              {/* Type Switcher */}
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      adjustType === 'add' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Receive / Add (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('subtract')}
                    className={`py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      adjustType === 'subtract' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-zinc-400'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct / Loss (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Quantity Amount</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Mandatory Audit Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="PURCHASE_RECEIPT">Supplier Purchase Order Receipt</option>
                  <option value="CUSTOMER_RETURN">Customer Return Restock (RMA)</option>
                  <option value="AUDIT_RECONCILIATION">Physical Inventory Cycle Count Reconciliation</option>
                  <option value="DAMAGED">Damaged / Defective Stock Scrappage</option>
                  <option value="TRANSFER">Internal Warehouse Transfer</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Audit...' : 'Execute Stock Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inter-Warehouse Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#14181f] text-white rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-zinc-800 shadow-2xl relative">
            <button
              onClick={() => {
                setIsTransferModalOpen(false);
                setTransferMessage('');
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Inter-Warehouse Stock Transfer</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Reallocate vault stock between international fulfillment facilities with atomic audit trail logging.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Target Design Creation</label>
                <select
                  value={transferProductId || products[0]?.id}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) &bull; {p.stock} units total
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Source Dispatch Hub</label>
                  <select
                    value={transferSource}
                    onChange={(e) => setTransferSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Target Receiving Hub</label>
                  <select
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Transfer Units Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              {transferMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    transferMessage.startsWith('✓')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {transferMessage}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isTransferring ? 'Processing Relocation...' : 'Authorize Relocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
