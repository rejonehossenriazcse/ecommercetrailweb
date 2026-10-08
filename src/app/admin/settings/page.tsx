'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  Mail,
  CreditCard,
  DollarSign,
  Truck,
  Save,
  CheckCircle2,
  FileText,
  User,
  AlertCircle,
} from 'lucide-react';
import { AuditLogRecord } from '@/lib/db/schema';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminSettingsPage() {
  // Super Admin Account settings
  const [adminEmail, setAdminEmail] = useState('admin@stridedistrict.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSaveMessage, setAdminSaveMessage] = useState('');

  // Payment Gateway credentials
  const [payments, setPayments] = useState({
    stripeEnabled: true,
    stripePublishableKey: 'pk_live_stride_sample_51O2kQ8aJ',
    stripeSecretKey: '••••••••••••••••••••••••••••••••',
    paypalEnabled: true,
    paypalClientId: 'AX_stride_live_client_sample_098',
    applePayEnabled: true,
    googlePayEnabled: true,
    codEnabled: false,
  });

  // General & Tax
  const [general, setGeneral] = useState({
    storeName: 'STRIDE DISTRICT Flagship',
    supportEmail: 'concierge@stridedistrict.com',
    taxRatePercent: 8,
    freeShippingThreshold: 150,
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.superAdmin?.email) setAdminEmail(json.data.superAdmin.email);
          if (json.data.general) setGeneral(json.data.general);
          if (json.data.payments) setPayments((prev) => ({ ...prev, ...json.data.payments }));
        }
      });

    fetch('/api/v1/audit-logs')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAuditLogs(json.data);
      });
  }, []);

  const handleUpdateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setAdminSaveMessage('Updating Super Admin credentials...');
    const res = await fetch('/api/v1/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        superAdmin: { email: adminEmail },
        newSuperAdminPassword: newPassword || undefined,
      }),
    });

    const json = await res.json();
    if (json.success) {
      setAdminSaveMessage('✓ Super Admin credentials updated & secured');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setAdminSaveMessage(''), 4000);

      // Refresh audit logs
      fetch('/api/v1/audit-logs')
        .then((r) => r.json())
        .then((j) => j.success && setAuditLogs(j.data));
    }
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/v1/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ general, payments }),
    });
    const json = await res.json();
    if (json.success) {
      alert('Platform configurations and payment gateways saved successfully.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Store Settings & Security"
        badge="Frontend Control: Store Info, Taxes & Gateways"
        description="Manage store contact information, administrator login credentials, Stripe / PayPal payment gateways, sales tax rates, and security audit logs."
        controlsWhat="Checkout payment options (Stripe/Apple Pay/Google Pay/PayPal), tax calculation at checkout, and currency display."
        previewUrl="/checkout"
        breadcrumbs={[{ label: 'System & Help' }, { label: 'Store Settings' }]}
      />

      {/* 1. Super Admin Account Manager (Requirement #9) */}
      <div className="p-6 rounded-3xl bg-[#14181f] border border-amber-500/30 space-y-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-bold">Super Admin Account & Ownership</h2>
              <p className="text-xs text-zinc-800 font-semibold mt-0.5">
                Set your personal email address and update your root authentication password at any time.
              </p>
            </div>
          </div>

          {adminSaveMessage && (
            <span className="text-xs font-mono font-bold text-emerald-400">{adminSaveMessage}</span>
          )}
        </div>

        <form onSubmit={handleUpdateSuperAdmin} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Super Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="your-personal-email@domain.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">New Root Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-800 font-semibold font-mono">
              Role: SUPER_ADMIN • Granular Root Authorization Enabled
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer shadow-md"
            >
              Update Super Admin Credentials
            </button>
          </div>
        </form>
      </div>

      {/* 2. Payment Gateways & Tax Rules */}
      <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-200/80 space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-zinc-900 font-bold">Payment Gateways & Currencies</h2>
        </div>

        <form onSubmit={handleSavePlatformSettings} className="space-y-6 text-xs">
          {/* Stripe Config */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 font-bold text-sm">Stripe Payment Gateway</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-zinc-800 font-semibold">Enable Card Tokenization</span>
                <input
                  type="checkbox"
                  checked={payments.stripeEnabled}
                  onChange={(e) => setPayments({ ...payments, stripeEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-400 accent-amber-400"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-zinc-800 font-semibold block mb-1">Publishable Key</label>
                <input
                  type="text"
                  value={payments.stripePublishableKey}
                  onChange={(e) => setPayments({ ...payments, stripePublishableKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-bold font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-800 font-semibold block mb-1">Secret Key (Encrypted in Vault)</label>
                <input
                  type="password"
                  value={payments.stripeSecretKey}
                  onChange={(e) => setPayments({ ...payments, stripeSecretKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* PayPal & Digital Wallets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 font-bold block">Apple Pay</span>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={payments.applePayEnabled}
                  onChange={(e) => setPayments({ ...payments, applePayEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                <span className="text-zinc-800 font-bold">Biometric 1-Touch Checkout</span>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 font-bold block">Google Pay</span>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={payments.googlePayEnabled}
                  onChange={(e) => setPayments({ ...payments, googlePayEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                <span className="text-zinc-800 font-bold">Android Quick Payment</span>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 font-bold block">PayPal Express</span>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={payments.paypalEnabled}
                  onChange={(e) => setPayments({ ...payments, paypalEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                <span className="text-zinc-800 font-bold">One-Click Wallet</span>
              </label>
            </div>
          </div>

          {/* Tax & Free Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Standard Sales Tax Rate (%)</label>
              <input
                type="number"
                value={general.taxRatePercent}
                onChange={(e) => setGeneral({ ...general, taxRatePercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-800 font-bold block mb-1">Free Shipping Threshold ($ USD)</label>
              <input
                type="number"
                value={general.freeShippingThreshold}
                onChange={(e) => setGeneral({ ...general, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Save Platform Settings
            </button>
          </div>
        </form>
      </div>

      {/* 3. Security Audit Logs Trail */}
      <div className="p-6 rounded-3xl bg-[#14181f] border border-zinc-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-zinc-900 font-bold">Chronological Security Audit Log</h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-800 font-semibold font-medium">
            Immutable Audit Trail • {auditLogs.length} Entries Recorded
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1217] border-b border-zinc-200 text-zinc-800 font-semibold font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Event Details</th>
                <th className="p-3 font-mono">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800 font-bold">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-100/30">
                  <td className="p-3 font-mono text-[11px] text-zinc-800 font-semibold font-medium whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-bold text-zinc-900 font-bold">{log.userName}</span>
                    <span className="text-[10px] text-zinc-800 font-semibold font-medium font-mono block uppercase">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-semibold text-amber-400 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-3 whitespace-nowrap font-medium text-zinc-800 font-bold">
                    {log.entity}
                  </td>
                  <td className="p-3 text-zinc-800 font-semibold max-w-sm">
                    {log.details}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-zinc-800 font-semibold font-medium whitespace-nowrap">
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
