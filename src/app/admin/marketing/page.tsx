'use client';

import React, { useState, useEffect } from 'react';
import { PromotionRecord, ContactInquiryRecord, NewsletterSubscriberRecord } from '@/lib/db/schema';
import {
  Tag,
  Plus,
  Trash2,
  Activity,
  CheckCircle2,
  Save,
  Lock,
  Zap,
  Mail,
  MessageSquare,
  Download,
  Check,
  Sparkles,
  Users,
  Clock,
  Eye,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminMarketingPage() {
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberRecord[]>([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed_amount' | 'free_shipping'>('percentage');
  const [newValue, setNewValue] = useState(15);
  const [newMinSpend, setNewMinSpend] = useState(100);
  const [newDesc, setNewDesc] = useState('');

  // Pixel settings
  const [trackingSettings, setTrackingSettings] = useState({
    metaPixelId: '109827364519283',
    conversionsApiToken: 'EAAO8ZCeR29sample_live_capi_token',
    ga4MeasurementId: 'G-STRIDE2026EXP',
    gtmContainerId: 'GTM-STRIDE01',
    tiktokPixelId: 'C89STRIDE_TK',
    serverSideTaggingEnabled: true,
  });
  const [saveStatus, setSaveStatus] = useState('');

  const loadData = async () => {
    try {
      const [promoRes, inqRes, subRes, setRes] = await Promise.all([
        fetch('/api/v1/promotions'),
        fetch('/api/v1/contact'),
        fetch('/api/v1/newsletter'),
        fetch('/api/v1/settings'),
      ]);
      const [promoJson, inqJson, subJson, setJson] = await Promise.all([
        promoRes.json(),
        inqRes.json(),
        subRes.json(),
        setRes.json(),
      ]);

      if (promoJson.success) setPromotions(promoJson.data);
      if (inqJson.success) setInquiries(inqJson.data);
      if (subJson.success) setSubscribers(subJson.data);
      if (setJson.success && setJson.data.tracking) {
        setTrackingSettings((prev) => ({ ...prev, ...setJson.data.tracking }));
      }
    } catch (err) {
      console.error('Failed to load marketing telemetry', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const res = await fetch('/api/v1/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: newCode.toUpperCase(),
        type: newType,
        value: Number(newValue),
        minSpend: Number(newMinSpend),
        description: newDesc || `${newValue}${newType === 'percentage' ? '%' : '$'} streetwear drop discount`,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setPromotions([json.data, ...promotions]);
      setIsCouponModalOpen(false);
      setNewCode('');
      setNewDesc('');
    }
  };

  const handleDeletePromotion = async (id: string, code: string) => {
    if (!confirm(`Delete promotion code ${code}?`)) return;
    const res = await fetch(`/api/v1/promotions/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      setPromotions(promotions.filter((p) => p.id !== id && p.code !== id));
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving tracking credentials...');
    const res = await fetch('/api/v1/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracking: trackingSettings }),
    });
    const json = await res.json();
    if (json.success) {
      setSaveStatus('✓ Marketing pixels & Conversions API credentials synchronized');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Export Subscribers to CSV
  const handleExportSubscribers = () => {
    if (subscribers.length === 0) return;
    const headers = ['Email', 'Source', 'Subscribed At', 'Welcome Coupon'];
    const rows = subscribers.map((s) => [
      `"${s.email}"`,
      `"${s.source}"`,
      `"${s.subscribedAt}"`,
      `"${s.welcomeCouponIssued || 'WELCOME10'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Coupons & Discounts"
        badge="Frontend Control: Checkout Discounts & Pixels"
        description="Set up promotional discount codes, manage newsletter subscriber audiences, and connect Meta Pixel and Google Analytics tracking."
        controlsWhat="The promo code voucher input on the cart drawer and checkout page, and ad conversion tracking."
        previewUrl="/checkout"
        breadcrumbs={[{ label: 'Marketing' }, { label: 'Coupons & Discounts' }]}
        actions={
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Coupon</span>
          </button>
        }
      />

      {/* Coupons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-zinc-900 font-bold">Active Promotional Vouchers ({promotions.length})</h2>
          </div>
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Voucher</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((c) => (
            <div
              key={c.id || c.code}
              className="p-5 rounded-3xl bg-[#14181f] border border-zinc-200/80 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-400 text-base">{c.code}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                    {c.type === 'percentage'
                      ? `${c.value}% OFF`
                      : c.type === 'free_shipping'
                      ? 'FREE SHIPPING'
                      : `$${c.value} OFF`}
                  </span>
                  <button
                    onClick={() => handleDeletePromotion(c.id || c.code, c.code)}
                    className="p-1 text-zinc-800 font-semibold font-medium hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-800 font-semibold leading-relaxed line-clamp-2">{c.description}</p>

              <div className="text-[11px] font-mono text-zinc-800 font-semibold font-medium pt-2 border-t border-zinc-200/80 flex items-center justify-between">
                <span>Min Spend: ${c.minSpend || 0}</span>
                <span>Used: {c.usageCount || 0} times</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concierge Inquiries & Submissions */}
      <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-bold">Concierge Inquiries ({inquiries.length})</h2>
              <p className="text-xs text-zinc-800 font-semibold mt-0.5">
                Submissions from the storefront contact desk and bespoke acquisition requests.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1217] border-b border-zinc-200 text-zinc-800 font-semibold font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Patron Name</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Nature of Inquiry</th>
                <th className="p-3">Message Summary</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 text-zinc-800 font-bold">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-zinc-100/30 transition-colors">
                  <td className="p-3 font-bold text-zinc-900 font-bold">{inq.name}</td>
                  <td className="p-3">
                    <div>{inq.email}</div>
                    {inq.phone && <div className="text-[10px] text-zinc-800 font-semibold font-medium font-mono">{inq.phone}</div>}
                  </td>
                  <td className="p-3 text-amber-400 font-semibold">{inq.subject}</td>
                  <td className="p-3 text-zinc-800 font-semibold max-w-xs truncate">{inq.message}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
                      {inq.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-[11px] text-zinc-800 font-semibold font-medium">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Newsletter Subscribers Audience */}
      <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-bold">
                Newsletter Subscribers & VIP Registrants ({subscribers.length})
              </h2>
              <p className="text-xs text-zinc-800 font-semibold mt-0.5">
                Active audience members who opted in for editorial dispatches and private sale invitations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportSubscribers}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs font-bold transition-colors cursor-pointer border border-zinc-300 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Subscribers (.CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subscribers.map((sub) => (
            <div
              key={sub.id || sub.email}
              className="p-3 rounded-2xl bg-zinc-50/60 border border-zinc-200/60 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-zinc-900 font-bold font-mono">{sub.email}</div>
                <div className="text-[10px] text-zinc-800 font-semibold font-medium">
                  Via: {sub.source} • Joined {new Date(sub.subscribedAt).toLocaleDateString()}
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                {sub.welcomeCouponIssued || 'WELCOME10'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Pixels & Conversions API Settings */}
      <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-200/80 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-bold">Configurable Tracking Center</h2>
              <p className="text-xs text-zinc-800 font-semibold mt-0.5">
                Client-side pixels and server-side Conversions API event attribution with automatic deduplication.
              </p>
            </div>
          </div>
          {saveStatus && (
            <span className="text-xs font-mono font-bold text-emerald-400">{saveStatus}</span>
          )}
        </div>

        <form onSubmit={handleSaveTracking} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Meta Pixel ID (Facebook / Instagram)</label>
              <input
                type="text"
                value={trackingSettings.metaPixelId}
                onChange={(e) => setTrackingSettings({ ...trackingSettings, metaPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Meta Conversions API (CAPI) Server Token</label>
              <input
                type="password"
                value={trackingSettings.conversionsApiToken}
                onChange={(e) => setTrackingSettings({ ...trackingSettings, conversionsApiToken: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={trackingSettings.ga4MeasurementId}
                onChange={(e) => setTrackingSettings({ ...trackingSettings, ga4MeasurementId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Google Tag Manager (GTM) Container ID</label>
              <input
                type="text"
                value={trackingSettings.gtmContainerId}
                onChange={(e) => setTrackingSettings({ ...trackingSettings, gtmContainerId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                value={trackingSettings.tiktokPixelId}
                onChange={(e) => setTrackingSettings({ ...trackingSettings, tiktokPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-800 font-semibold text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Tokens and Pixel IDs are stored securely and injected dynamically.</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Tracking Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-zinc-900 font-bold rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 font-bold">Create Promotional Voucher</h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Dollar ($)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-800 font-bold block mb-1">
                    Value {newType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Minimum Spend ($)</label>
                <input
                  type="number"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Description / Campaign Note</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. VIP Collector seasonal promotion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-800 font-semibold hover:text-zinc-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase hover:bg-amber-300 cursor-pointer"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
