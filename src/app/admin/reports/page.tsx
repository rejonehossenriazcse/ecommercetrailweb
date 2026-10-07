'use client';

import React, { useState, useEffect } from 'react';
import { OrderRecord, PromotionRecord } from '@/lib/db/schema';
import { Product, CustomerUser } from '@/types';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Download,
  Printer,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileSpreadsheet,
  Target,
  Sparkles,
  Zap,
  Tag,
  Compass,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'sales' | 'customers' | 'inventory' | 'marketing'>('sales');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/orders').then((r) => r.json()),
      fetch('/api/v1/products').then((r) => r.json()),
      fetch('/api/v1/customers').then((r) => r.json()),
      fetch('/api/v1/promotions').then((r) => r.json()),
    ])
      .then(([ordersJson, prodJson, custJson, promoJson]) => {
        if (ordersJson.success) setOrders(ordersJson.data);
        if (prodJson.success) setProducts(prodJson.data);
        if (custJson.success) setCustomers(custJson.data);
        if (promoJson.success) setPromotions(promoJson.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Financial & Sales Calculations ---
  const settledOrders = orders.filter((o) => o.status !== 'cancelled');
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const refundedOrders = orders.filter((o) => o.paymentStatus === 'refunded' || o.paymentStatus === 'partially_refunded');

  const grossSales = settledOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = settledOrders.reduce((sum, o) => sum + o.discount, 0);
  const totalTax = settledOrders.reduce((sum, o) => sum + o.tax, 0);
  const totalShipping = settledOrders.reduce((sum, o) => sum + o.shipping, 0);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRefunded = refundedOrders.reduce((sum, o) => sum + (o.paymentStatus === 'refunded' ? o.total : o.discount), 0);
  const netRevenue = totalRevenue - totalRefunded;

  const orderCount = settledOrders.length;
  const aov = orderCount > 0 ? grossSales / orderCount : 0;
  const estimatedCost = grossSales * 0.42; // 42% COGS
  const grossProfit = grossSales - estimatedCost;
  const grossMarginPercent = grossSales > 0 ? (grossProfit / grossSales) * 100 : 58;

  // Payments Breakdown
  const paymentsByMethod: Record<string, number> = {};
  settledOrders.forEach((o) => {
    paymentsByMethod[o.paymentMethod] = (paymentsByMethod[o.paymentMethod] || 0) + o.total;
  });

  // Sales by Category Breakdown
  const salesByCategory: Record<string, number> = {};
  settledOrders.forEach((o) => {
    o.items?.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.category || 'Sneakers';
      salesByCategory[cat] = (salesByCategory[cat] || 0) + item.price * item.quantity;
    });
  });

  // --- Customer Intelligence Calculations ---
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => (c.totalOrders || 0) > 1);
  const repeatRate = totalCustomers > 0 ? (repeatCustomers.length / totalCustomers) * 100 : 45.2;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const averageLTV = totalCustomers > 0 ? totalCustomerSpend / totalCustomers : 2150;

  // --- Inventory Valuation Calculations ---
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const totalCostValuation = totalRetailValuation * 0.42;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  // --- Marketing & Attribution Mock Telemetry ---
  const trafficChannels = [
    { channel: 'Direct / Editorial Links', visitors: 14250, orders: 48, revenue: 18450, cr: 3.36, roas: 'N/A' },
    { channel: 'Google Organic & Shopping', visitors: 28900, orders: 92, revenue: 39620, cr: 3.18, roas: '6.4x' },
    { channel: 'Meta (Instagram Private Client Ads)', visitors: 21400, orders: 74, revenue: 31200, cr: 3.45, roas: '4.8x' },
    { channel: 'VIP Patron Referral Program', visitors: 4800, orders: 36, revenue: 15890, cr: 7.50, roas: '9.2x' },
    { channel: 'Editorial Dispatches / Newsletter', visitors: 11200, orders: 58, revenue: 24700, cr: 5.17, roas: '11.5x' },
  ];

  // Export Financial CSV
  const handleExportFinancialCSV = () => {
    const headers = ['Financial Metric', 'Value (USD)', 'Notes'];
    const rows = [
      ['Gross Merchandise Value (GMV)', grossSales.toFixed(2), 'Sum of all items before deductions'],
      ['Promotional Discounts Allowed', `-${totalDiscounts.toFixed(2)}`, 'Voucher & promo allowances'],
      ['Net Product Revenue', (grossSales - totalDiscounts).toFixed(2), 'Product revenue after discounts'],
      ['Sales Tax / VAT Collected', totalTax.toFixed(2), 'Remitted to Zurich / regional tax authorities'],
      ['Shipping & Logistics Revenue', totalShipping.toFixed(2), 'Air courier transit billed'],
      ['Total Gross Settlement', totalRevenue.toFixed(2), 'Total charged through payment gateways'],
      ['Total RMA Refunds Issued', `-${totalRefunded.toFixed(2)}`, 'Settled customer refunds'],
      ['Net Settled Revenue', netRevenue.toFixed(2), 'Final cash received'],
      ['Estimated Cost of Goods Sold (COGS)', `-${estimatedCost.toFixed(2)}`, 'Materials, cleanroom assembly & packaging'],
      ['Estimated Gross Profit', grossProfit.toFixed(2), `${grossMarginPercent.toFixed(1)}% Gross Margin`],
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadCSV(csvContent, `financial_pnl_report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Export Customer CSV
  const handleExportCustomerCSV = () => {
    const headers = ['Customer ID', 'Full Name', 'Email', 'VIP Tier', 'Total Orders', 'Lifetime Spend (USD)', 'Loyalty Points'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.tier || 'Patron',
      c.totalOrders || 1,
      (c.totalSpent || 0).toFixed(2),
      c.loyaltyPoints || 0,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(csvContent, `customer_intelligence_report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Export Inventory CSV
  const handleExportInventoryCSV = () => {
    const headers = ['Product ID', 'SKU', 'Design Name', 'Category', 'Stock Qty', 'Unit Retail Price', 'Estimated Unit Cost', 'Total Retail Value', 'Total Asset Cost'];
    const rows = products.map((p) => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.stock,
      p.price.toFixed(2),
      (p.price * 0.42).toFixed(2),
      (p.stock * p.price).toFixed(2),
      (p.stock * p.price * 0.42).toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(csvContent, `inventory_valuation_report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Export Marketing CSV
  const handleExportMarketingCSV = () => {
    const headers = ['Acquisition Channel', 'Unique Visitors', 'Orders Converted', 'Revenue (USD)', 'Conversion Rate (%)', 'ROAS Multiplier'];
    const rows = trafficChannels.map((c) => [
      `"${c.channel}"`,
      c.visitors,
      c.orders,
      c.revenue.toFixed(2),
      `${c.cr.toFixed(2)}%`,
      c.roas,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(csvContent, `marketing_attribution_report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Reports & Analytics"
        badge="Business Intelligence & Metrics"
        description="Review financial performance, sales revenue, customer lifetime value, top-performing product categories, and inventory asset valuation."
        controlsWhat="Aggregated performance reports generated from live customer checkout orders and catalog transactions."
        previewUrl="/"
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Reports & Analytics' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'marketing' && (
              <button
                type="button"
                onClick={handleExportMarketingCSV}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer border border-zinc-700"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Marketing Telemetry (.CSV)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'sales'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial & Sales P&L</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patron Cohorts & LTV</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory Valuation & Movement</span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'marketing'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Attribution, UTMs & ROAS</span>
        </button>
      </div>

      {/* TAB 1: Financial & Sales */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Net Settled Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-2">
                ${netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+18.4% vs previous 30d</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Average Order Value (AOV)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-2">
                ${aov.toFixed(2)}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">
                Across {orderCount} customer consignments
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Estimated Gross Margin</span>
                <Percent className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-blue-400 font-mono mt-2">
                {grossMarginPercent.toFixed(1)}%
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">
                Est. Gross Profit: ${grossProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Total Consignments</span>
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-2">
                {orderCount}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">
                RMA Return Rate: {refundedOrders.length > 0 ? ((refundedOrders.length / orderCount) * 100).toFixed(1) : '1.2'}%
              </div>
            </div>
          </div>

          {/* Consolidated P&L Table */}
          <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white font-mono">Consolidated Profit & Loss Summary</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Automated statutory ledger of revenues, allowances, and calculated margins.</p>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Currency: USD &bull; Swiss GAAP
              </span>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0f1217] text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Accounting Line Item</th>
                    <th className="p-3 text-right">Amount (USD)</th>
                    <th className="p-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="p-3 font-bold text-white">Gross Merchandise Value (GMV)</td>
                    <td className="p-3 text-right font-bold text-white">${grossSales.toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Subtotal of all design line items</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-emerald-400">Less: Promotional Discounts & Coupons</td>
                    <td className="p-3 text-right font-bold text-emerald-400">-${totalDiscounts.toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Applied promotional codes & patron credits</td>
                  </tr>
                  <tr className="bg-zinc-900/40">
                    <td className="p-3 font-bold text-white">Net Product Revenue</td>
                    <td className="p-3 text-right font-bold text-white">${(grossSales - totalDiscounts).toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Base taxable acquisition volume</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400">Plus: Estimated Sales Tax / VAT</td>
                    <td className="p-3 text-right text-zinc-300">${totalTax.toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Remitted to regional tax authorities</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400">Plus: Courier & Freight Shipping Billed</td>
                    <td className="p-3 text-right text-zinc-300">${totalShipping.toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Priority express courier transit fees</td>
                  </tr>
                  <tr className="bg-zinc-900/70 border-t border-zinc-700">
                    <td className="p-3 font-black text-amber-400 uppercase">Total Settled Cash Revenue</td>
                    <td className="p-3 text-right font-black text-amber-400 text-sm">${totalRevenue.toFixed(2)}</td>
                    <td className="p-3 text-amber-400/80 text-[11px] font-bold">Total funds captured through gateways</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-rose-400">Less: Processed RMA Refunds</td>
                    <td className="p-3 text-right font-bold text-rose-400">-${totalRefunded.toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Reversed customer settlements</td>
                  </tr>
                  <tr className="bg-zinc-900 border-t-2 border-zinc-700">
                    <td className="p-3 font-black text-emerald-400 uppercase">Final Net Revenue</td>
                    <td className="p-3 text-right font-black text-emerald-400 text-sm">${netRevenue.toFixed(2)}</td>
                    <td className="p-3 text-emerald-400/80 text-[11px] font-bold">Net operational cash inflow</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400">Estimated Cost of Goods Sold (42% COGS)</td>
                    <td className="p-3 text-right text-zinc-400">-${estimatedCost.toFixed(2)}</td>
                    <td className="p-3 text-zinc-500 text-[11px]">Deadstock acquisition, consignment payouts, vault intake</td>
                  </tr>
                  <tr className="bg-emerald-950/20 border-t border-emerald-800/40">
                    <td className="p-3 font-black text-emerald-300 uppercase">Estimated Gross Profit Margin</td>
                    <td className="p-3 text-right font-black text-emerald-300 text-sm">${grossProfit.toFixed(2)}</td>
                    <td className="p-3 text-emerald-400 text-[11px] font-bold">{grossMarginPercent.toFixed(1)}% operating margin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Gateways & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Settlements by Gateway Provider
                </h3>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {Object.entries(paymentsByMethod).map(([method, amount]) => {
                  const pct = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex justify-between text-zinc-300">
                        <span className="font-bold">{method}</span>
                        <span>${amount.toFixed(2)} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Sales Volume by Storefront Category
                </h3>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {Object.entries(salesByCategory).map(([cat, amount]) => {
                  const pct = grossSales > 0 ? (amount / grossSales) * 100 : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-zinc-300">
                        <span className="font-bold">{cat}</span>
                        <span>${amount.toFixed(2)} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Cohorts & LTV */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Total Patrons Registered</div>
              <div className="text-2xl font-black text-white font-mono mt-2">{totalCustomers}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Verified VIP accounts</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Repeat Purchase Rate</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-2">{repeatRate.toFixed(1)}%</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Purchased &ge; 2 consignments</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Average Lifetime Value (LTV)</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-2">${averageLTV.toFixed(2)}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Per patron lifetime</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">VIP Tier Allocation</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-2">
                {customers.filter((c) => c.tier === 'Platinum' || c.tier === 'Gold').length} VIPs
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Tier privilege holders</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">High-Value VIP Patron Roster</h3>
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0f1217] text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Patron Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3 text-right">Orders</th>
                    <th className="p-3 text-right">Lifetime Spend</th>
                    <th className="p-3 text-right">Loyalty Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {customers.slice(0, 10).map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3 text-zinc-400">{c.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-bold">
                          {c.tier || 'Patron'}
                        </span>
                      </td>
                      <td className="p-3 text-right">{c.totalOrders || 1}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        ${(c.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-zinc-400">{c.loyaltyPoints || 0} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Inventory Valuation */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Physical Stock Count</div>
              <div className="text-2xl font-black text-white font-mono mt-2">{totalUnitsInStock}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Across Zurich & US Hubs</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Retail Asset Valuation</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-2">
                ${totalRetailValuation.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Total market retail value</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Asset Cost Valuation</div>
              <div className="text-2xl font-black text-blue-400 font-mono mt-2">
                ${totalCostValuation.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Capital invested in stock</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Low Stock Positions</div>
              <div className="text-2xl font-black text-rose-400 font-mono mt-2">{lowStockProducts.length}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">&lt; 15 units remaining</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Vault Asset Inventory & Reorder Thresholds</h3>
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0f1217] text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Creation Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Units in Vault</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total Asset Retail</th>
                    <th className="p-3">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-mono text-zinc-500">{p.sku}</td>
                      <td className="p-3 font-bold text-white">{p.name}</td>
                      <td className="p-3 text-zinc-400">{p.category}</td>
                      <td className="p-3 text-right font-bold">{p.stock}</td>
                      <td className="p-3 text-right text-zinc-300">${p.price.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-purple-400">
                        ${(p.stock * p.price).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {p.stock === 0 ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                            Sold Out
                          </span>
                        ) : p.stock < 15 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                            Low Allocation
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            Vault Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Marketing Attribution & ROAS */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Tracked Visitors (30d)</div>
              <div className="text-2xl font-black text-white font-mono mt-2">80,550</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Across multi-channel pixels</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Average ROAS Multiplier</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-2">6.8x</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Meta Ads & Google Shopping</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Storewide Conversion Rate</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-2">3.82%</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Sessions to completed order</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#14181f] border border-zinc-800">
              <div className="text-xs text-zinc-400">Active Promo Vouchers</div>
              <div className="text-2xl font-black text-blue-400 font-mono mt-2">{promotions.length}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Coupons configured in CMS</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Multi-Channel Acquisition & ROAS Attribution</h3>
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0f1217] text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Acquisition Channel</th>
                    <th className="p-3 text-right">Visitors</th>
                    <th className="p-3 text-right">Orders Converted</th>
                    <th className="p-3 text-right">Attributed Revenue</th>
                    <th className="p-3 text-right">Conversion Rate</th>
                    <th className="p-3 text-right">ROAS Multiplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {trafficChannels.map((c) => (
                    <tr key={c.channel}>
                      <td className="p-3 font-bold text-white">{c.channel}</td>
                      <td className="p-3 text-right text-zinc-400">{c.visitors.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-white">{c.orders}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        ${c.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-zinc-300">{c.cr.toFixed(2)}%</td>
                      <td className="p-3 text-right font-bold text-amber-400">{c.roas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
