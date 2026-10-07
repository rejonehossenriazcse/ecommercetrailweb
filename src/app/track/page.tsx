'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { OrderRecord } from '@/lib/db/schema';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { reorderOrder } = useStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState<OrderRecord | null>(null);

  const handleQuickFill = () => {
    setOrderNumber('AUR-2026-9042');
    setEmail('marcus.vance@collector.com');
    setError('');
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setOrderResult(null);

    try {
      const res = await fetch('/api/v1/orders');
      const json = await res.json();

      if (!json.success || !json.data) {
        throw new Error('Could not connect to tracking dispatch system.');
      }

      const cleanOrder = orderNumber.trim().toUpperCase();
      const cleanEmail = email.trim().toLowerCase();

      const matched = json.data.find(
        (o: OrderRecord) =>
          (o.orderNumber.toUpperCase() === cleanOrder || o.id.toUpperCase() === cleanOrder) &&
          (!cleanEmail || o.customerEmail.toLowerCase() === cleanEmail)
      );

      if (!matched) {
        throw new Error(`No consignment found matching "${cleanOrder}" and "${cleanEmail}". Please check your order confirmation email.`);
      }

      setOrderResult(matched);
    } catch (err: any) {
      setError(err.message || 'Error querying tracking information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-2">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          <span>Real-Time Consignment Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
          Track Your Dispatch
        </h1>
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
          Input your order number and customer email to view real-time transit telemetry, temperature-controlled vault packing, and air carrier milestones.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="max-w-xl mx-auto bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-900/5 mb-10">
        {/* Quick Fill Testing Helper */}
        <div className="mb-6 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-600">
            Test Order: <span className="font-mono font-bold text-zinc-900">AUR-2026-9042</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl transition-colors cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1 uppercase">
              Order Number or Consignment ID
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. AUR-2026-9042"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1 uppercase">
              Billing or Shipping Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marcus.vance@collector.com"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Locate Dispatch Telemetry</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tracking Results Dossier */}
      {orderResult && (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-900/5 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-zinc-900 font-mono">{orderResult.orderNumber}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    orderResult.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : orderResult.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {orderResult.status}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1">
                Air Freight Carrier: <span className="font-bold text-zinc-900">{orderResult.carrier || 'DHL Express Priority'}</span> • Tracking:{' '}
                <span className="font-bold text-zinc-900">{orderResult.trackingNumber || 'DHL-9481928371'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => reorderOrder(orderResult.items)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-order Items</span>
              </button>
            </div>
          </div>

          {/* 4-Step Visual Progress Bar */}
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/60 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Order Confirmed</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Payment Tokenized</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Vault Inspection</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Zurich Vault QC Passed</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">In Air Transit</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{orderResult.carrier || 'DHL Express Air'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${orderResult.status === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Final Delivery</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{orderResult.status === 'delivered' ? 'Signed at Destination' : 'Out for Delivery'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Consignment Items */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Consignment Contents ({orderResult.items.length})
            </h3>
            <div className="space-y-3">
              {orderResult.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-zinc-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{item.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        SKU: {item.sku} • Quantity: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-zinc-900 font-mono">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-start gap-3 text-xs">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-zinc-900">Destination Address</div>
              <div className="text-zinc-600 mt-0.5">
                {orderResult.shippingAddress.street}, {orderResult.shippingAddress.city}, {orderResult.shippingAddress.state} {orderResult.shippingAddress.zip}, {orderResult.shippingAddress.country}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
