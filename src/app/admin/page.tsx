'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ExternalLink,
  Compass,
  Columns,
  Menu as MenuIcon,
  Tag,
  HelpCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/analytics/overview')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 font-mono text-xs">
        Loading Executive Analytics Engine...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Performance Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time multi-channel revenue metrics, inventory health, and live customer conversion flow.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              dateRange === '7d' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              dateRange === '30d' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              dateRange === '90d' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Storefront CMS & Operations Shortcut Hub */}
      <div className="bg-[#14171d] border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              Frontend Control Center & Quick Navigation
            </h3>
          </div>
          <Link
            href="/admin/guide"
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Store Owner Guides</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <Link
            href="/admin/cms"
            className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Homepage Builder</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Controls hero slider, deals, category showcase, and product tabs on homepage.
            </p>
          </Link>

          <Link
            href="/admin/header"
            className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                <MenuIcon className="w-4 h-4 text-emerald-400" />
                <span>Header & Menus</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Controls top logo, announcement voucher strip, navigation menus, and search bar.
            </p>
          </Link>

          <Link
            href="/admin/footer"
            className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                <Columns className="w-4 h-4 text-cyan-400" />
                <span>Footer Management</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Controls newsletter subscription, footer columns, contact details, and payment icons.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>Products & Catalog</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Add new designs, adjust pricing, inspect inventory SKUs, and manage variants.
            </p>
          </Link>
        </div>
      </div>

      {/* 4 Key Performance Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#14181f] border border-zinc-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs previous period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#14181f] border border-zinc-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Verified Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {data.orderCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.2% volume increase</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-2xl bg-[#14181f] border border-zinc-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Average Order Value (AOV)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${data.aov.toFixed(2)}
          </div>
          <div className="text-xs text-zinc-400">
            Across 5 global currencies
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="p-5 rounded-2xl bg-[#14181f] border border-zinc-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Storefront Conversion</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {data.conversionRate}%
          </div>
          <div className="text-xs text-zinc-400">
            Industry Benchmark: 2.1%
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Timeline & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Revenue Chart Bar representation */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#14181f] border border-zinc-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Daily Revenue Trend</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Dispatched sales volume over past 7 calendar days</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block font-mono">Peak Day: Oct 03</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">$4,190.00</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 border-b border-zinc-800 pb-2">
            {data.revenueByDate.map((item: any) => {
              const maxVal = 5000;
              const heightPercent = Math.round((item.revenue / maxVal) * 100);
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.revenue}
                  </span>
                  <div className="w-full bg-zinc-800/80 hover:bg-amber-400 rounded-xl transition-all duration-300 relative group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]" style={{ height: `${heightPercent}%` }} />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Abandoned Cart Rate: <strong className="text-white">{data.abandonedCartRate}%</strong></span>
            <span>Customer Lifetime Value (LTV): <strong className="text-white">$840.00</strong></span>
          </div>
        </div>

        {/* Sales by Channel */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#14181f] border border-zinc-800/80 space-y-5">
          <h3 className="text-base font-bold text-white">Sales by Channel</h3>
          <div className="space-y-4 pt-1">
            {data.salesByChannel.map((ch: any) => (
              <div key={ch.channel} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{ch.channel}</span>
                  <span className="font-mono text-white font-bold">{ch.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <span className="text-xs font-semibold text-zinc-400 block">Fast Actions:</span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/products"
                className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-semibold text-white flex items-center justify-between transition-colors"
              >
                <span>Add Product</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
              <Link
                href="/admin/cms"
                className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-semibold text-white flex items-center justify-between transition-colors"
              >
                <span>Edit CMS</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#14181f] border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-800/60 overflow-x-auto text-xs">
            {data.recentOrders.map((ord: any) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono font-bold text-white flex items-center gap-2">
                    <span>{ord.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {ord.customerName} • {ord.paymentMethod}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-white">${ord.total.toFixed(2)}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{new Date(ord.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#14181f] border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Critical Stock Thresholds</h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              Manage Hubs
            </Link>
          </div>

          <div className="divide-y divide-zinc-800/60 text-xs">
            {data.lowStockProducts.map((p: any) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{p.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">SKU: {p.sku}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px]">
                    {p.stock} units left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
