'use client';

import React, { useState, useEffect } from 'react';
import { CustomerRecord } from '@/lib/db/schema';
import {
  Users,
  Search,
  Filter,
  Award,
  CreditCard,
  ShoppingBag,
  Coins,
  Shield,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Plus,
  CheckCircle,
  X,
  AlertTriangle,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [creditAdjustment, setCreditAdjustment] = useState('');
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/v1/customers')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCustomers(json.data);
      })
      .finally(() => setLoading(false));
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesTier = tierFilter === 'all' || c.tier.toLowerCase() === tierFilter.toLowerCase();
    return matchesSearch && matchesTier;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const totalStoreCredit = customers.reduce((sum, c) => sum + c.storeCredit, 0);
  const vipCount = customers.filter((c) => c.tier === 'Platinum' || c.tier === 'Gold').length;

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const creditToAdd = parseFloat(creditAdjustment) || 0;
    const pointsToAdd = parseInt(pointsAdjustment, 10) || 0;

    const newStoreCredit = Math.max(0, selectedCustomer.storeCredit + creditToAdd);
    const newLoyaltyPoints = Math.max(0, selectedCustomer.loyaltyPoints + pointsToAdd);

    try {
      const res = await fetch(`/api/v1/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeCredit: newStoreCredit,
          loyaltyPoints: newLoyaltyPoints,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === selectedCustomer.id ? json.data : c))
        );
        setSelectedCustomer(json.data);
        setCreditAdjustment('');
        setPointsAdjustment('');
        setActionSuccess('Account balances successfully updated!');
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update customer balance', err);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedCustomer) return;
    const newStatus = selectedCustomer.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/v1/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === selectedCustomer.id ? json.data : c))
        );
        setSelectedCustomer(json.data);
      }
    } catch (err) {
      console.error('Status toggle failed', err);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Gold':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Silver':
        return 'bg-zinc-400/10 text-zinc-700 border-zinc-400/30';
      default:
        return 'bg-amber-700/10 text-amber-400 border-amber-700/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Customer Accounts"
        badge="Frontend Control: Customer Portal & VIP Tiers"
        description="Inspect registered customer profiles, order history, VIP tiers (Bronze, Silver, Gold, Platinum), and adjust loyalty store credits."
        controlsWhat="Customer account data, shipping addresses, and store credits visible when customers log in under /account."
        previewUrl="/account"
        breadcrumbs={[{ label: 'Operations' }, { label: 'Customer Accounts' }]}
        actions={
          <div className="px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-800 font-bold">
            Total Customer LTV: <span className="text-emerald-400 font-bold">${totalSpentAll.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Total Registered Patrons</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">{customers.length}</div>
          <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1 font-mono">100% Verified Identifiers</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">VIP Tier Patrons (Gold/Plat)</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">{vipCount}</div>
          <div className="text-[11px] text-purple-400/90 mt-1 font-mono">Priority Concierge Access</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Loyalty Points Balance</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">{totalLoyaltyPoints.toLocaleString()} pts</div>
          <div className="text-[11px] text-amber-400/80 mt-1 font-mono">Circulating Rewards</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Active Store Credit</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">${totalStoreCredit.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">Direct Wallet Liabilities</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#12151a] border border-zinc-200/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patron name, email or phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-bold placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-800 font-semibold" />
            <span className="text-xs text-zinc-800 font-semibold">Tier:</span>
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Tiers</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>
      </div>

      {/* Customer Accounts Table */}
      <div className="bg-[#12151a] border border-zinc-200/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-zinc-800 font-semibold font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Loyalty Points</th>
                <th className="py-3 px-4 text-right">Store Credit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-800 font-semibold font-medium">
                    Loading CRM database records...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-800 font-semibold font-medium">
                    No customer accounts matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-zinc-100/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 text-zinc-900 font-bold font-bold flex items-center justify-center text-xs shrink-0">
                          {cust.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 font-bold">{cust.name}</div>
                          <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${getTierBadge(cust.tier)}`}>
                        {cust.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-800 font-bold">
                      {cust.totalOrders}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-900 font-bold">
                      ${cust.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                      {cust.loyaltyPoints} pts
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-semibold">
                      ${cust.storeCredit.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          cust.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cust.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {cust.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold border border-zinc-300 transition-colors"
                      >
                        Manage Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Management Dossier Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#14171f] border border-zinc-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setActionSuccess('');
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100/80 hover:bg-zinc-100 text-zinc-800 font-semibold hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-zinc-950 font-black text-xl flex items-center justify-center shrink-0">
                {selectedCustomer.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-zinc-900 font-bold">{selectedCustomer.name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getTierBadge(selectedCustomer.tier)}`}>
                    {selectedCustomer.tier} Patron
                  </span>
                </div>
                <div className="text-xs text-zinc-800 font-semibold font-mono mt-0.5">
                  Identifier: {selectedCustomer.id} • Registered since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Action Success Alert */}
            {actionSuccess && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 space-y-2">
                <div className="text-[10px] font-mono text-zinc-800 font-semibold font-medium uppercase tracking-wider">Contact & Telephony</div>
                <div className="flex items-center gap-2 text-xs text-zinc-800 font-bold">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-800 font-bold">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 space-y-2">
                <div className="text-[10px] font-mono text-zinc-800 font-semibold font-medium uppercase tracking-wider">Primary Dispatch Address</div>
                <div className="flex items-start gap-2 text-xs text-zinc-800 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {selectedCustomer.defaultShippingAddress.street}, {selectedCustomer.defaultShippingAddress.city},{' '}
                    {selectedCustomer.defaultShippingAddress.state} {selectedCustomer.defaultShippingAddress.zip},{' '}
                    {selectedCustomer.defaultShippingAddress.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-[10px] font-mono text-zinc-800 font-semibold uppercase">Lifetime Spend</div>
                <div className="text-lg font-bold text-zinc-900 font-bold mt-1">${selectedCustomer.totalSpent.toFixed(2)}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-[10px] font-mono text-zinc-800 font-semibold uppercase">Loyalty Points</div>
                <div className="text-lg font-bold text-amber-400 mt-1">{selectedCustomer.loyaltyPoints}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-[10px] font-mono text-zinc-800 font-semibold uppercase">Store Credit</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">${selectedCustomer.storeCredit.toFixed(2)}</div>
              </div>
            </div>

            {/* Balance Adjustment Form */}
            <form onSubmit={handleUpdateBalance} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 mb-6">
              <h3 className="text-xs font-bold font-mono text-zinc-800 font-bold uppercase tracking-wider mb-3">
                Grant Rewards or Adjust Balances
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] text-zinc-800 font-semibold mb-1">Store Credit Delta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 50.00 or -20.00"
                    value={creditAdjustment}
                    onChange={(e) => setCreditAdjustment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-800 font-semibold mb-1">Loyalty Points Delta (pts)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 250 or -100"
                    value={pointsAdjustment}
                    onChange={(e) => setPointsAdjustment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!creditAdjustment && !pointsAdjustment}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors disabled:opacity-40"
              >
                Apply Balance Adjustments
              </button>
            </form>

            {/* Account Status Control */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/60 border border-zinc-200">
              <div>
                <div className="text-xs font-bold text-zinc-900 font-bold">Account Status Moderation</div>
                <div className="text-[11px] text-zinc-800 font-semibold font-medium">
                  Current state: <span className="text-zinc-800 font-bold capitalize">{selectedCustomer.status}</span>
                </div>
              </div>
              <button
                onClick={handleToggleStatus}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                  selectedCustomer.status === 'active'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                {selectedCustomer.status === 'active' ? 'Suspend Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
