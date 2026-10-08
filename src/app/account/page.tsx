'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore, DEFAULT_DEMO_CUSTOMER } from '@/context/StoreContext';
import { OrderRecord } from '@/lib/db/schema';
import { Address } from '@/types';
import InvoiceModal from '@/components/orders/InvoiceModal';
import {
  User,
  ShoppingBag,
  MapPin,
  Shield,
  Award,
  CreditCard,
  LogOut,
  ChevronRight,
  ExternalLink,
  Package,
  Truck,
  RotateCcw,
  CheckCircle,
  FileText,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  X,
  Share2,
  Sparkles,
  ArrowRight,
  Printer,
  Download,
  AlertTriangle,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const {
    customer,
    isCustomerLoggedIn,
    logoutCustomer,
    updateCustomerProfile,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    reorderOrder,
    formatPrice,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'profile' | 'rewards'>('overview');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<OrderRecord | null>(null);
  const [rmaOrder, setRmaOrder] = useState<OrderRecord | null>(null);
  const [rmaReason, setRmaReason] = useState('Change of preference');
  const [rmaSuccess, setRmaSuccess] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    title: 'Studio & Residence',
    recipientName: customer?.name || 'Marcus Vance',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: customer?.phone || '+1 (415) 555-0192',
    isDefaultShipping: true,
    isDefaultBilling: false,
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  const [isErasureModalOpen, setIsErasureModalOpen] = useState(false);
  const [erasureConfirmText, setErasureConfirmText] = useState('');
  const [isErasingData, setIsErasingData] = useState(false);

  const handleExportData = async () => {
    if (!customer?.email) return;
    setIsExportingData(true);
    try {
      const res = await fetch('/api/v1/customers/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customer.email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Export failed');

      const blob = new Blob([JSON.stringify(data.dossier, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AURA_Data_Dossier_${customer.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Data dossier downloaded successfully (GDPR Article 20 / CCPA § 1798.100).', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to generate data export.', 'error');
    } finally {
      setIsExportingData(false);
    }
  };

  const handleConfirmErasure = async () => {
    if (erasureConfirmText !== 'ERASE_MY_DATA' || !customer?.email) return;
    setIsErasingData(true);
    try {
      const res = await fetch('/api/v1/customers/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customer.email, confirmation: 'ERASE_MY_DATA' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Erasure failed');

      addToast('Your account and personal data have been cryptographically erased.', 'info');
      setIsErasureModalOpen(false);
      logoutCustomer();
      router.push('/');
    } catch (err: any) {
      addToast(err.message || 'Failed to complete erasure request.', 'error');
    } finally {
      setIsErasingData(false);
    }
  };

  // If not logged in, show prompt to log in or use demo account
  useEffect(() => {
    if (!customer) {
      router.push('/login?redirect=/account');
    }
  }, [customer, router]);

  useEffect(() => {
    fetch('/api/v1/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // If customer email matches, show customer orders, else fallback to seed orders
          const patronOrders = json.data.filter(
            (o: OrderRecord) =>
              !customer?.email ||
              o.customerEmail?.toLowerCase() === customer.email.toLowerCase() ||
              customer.email.toLowerCase().includes('marcus')
          );
          setOrders(patronOrders.length > 0 ? patronOrders : json.data);
        }
      })
      .finally(() => setLoadingOrders(false));
  }, [customer]);

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-zinc-200 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-800 font-semibold font-medium">Authenticating Patron Session...</p>
        </div>
      </div>
    );
  }

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(customer.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    addToast('Referral code copied to clipboard!', 'success');
  };

  const handleRmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmaOrder) return;
    const rmaCode = `RMA-${Math.floor(100000 + Math.random() * 900000)}`;
    setRmaSuccess(rmaCode);
    addToast(`Return Request initiated: ${rmaCode}`, 'success');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomerAddress(newAddress);
    setIsAddressModalOpen(false);
    setNewAddress({
      title: 'New Address',
      recipientName: customer.name,
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: customer.phone,
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Top Patron Dossier Header */}
      <div className="bg-zinc-50 text-zinc-900 font-bold rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Background ambient radial */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            {customer.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight">{customer.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {customer.tier} Patron
              </span>
            </div>
            <div className="text-xs text-zinc-800 font-semibold font-mono mt-1 flex items-center gap-3">
              <span>{customer.email}</span>
              <span>•</span>
              <span>Member since {new Date(customer.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="flex items-center gap-4 relative z-10 self-start md:self-center">
          <div className="px-4 py-2 rounded-2xl bg-zinc-100/80 border border-zinc-300/60 text-right">
            <div className="text-[10px] font-mono text-zinc-800 font-semibold uppercase">Loyalty Balance</div>
            <div className="text-base font-bold text-amber-400 font-mono">{customer.loyaltyPoints} pts</div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-zinc-100/80 border border-zinc-300/60 text-right">
            <div className="text-[10px] font-mono text-zinc-800 font-semibold uppercase">Store Credit</div>
            <div className="text-base font-bold text-emerald-400 font-mono">${customer.storeCredit.toFixed(2)}</div>
          </div>

          <button
            onClick={() => {
              logoutCustomer();
              router.push('/login');
            }}
            title="Sign out"
            className="p-3 rounded-2xl bg-zinc-100/80 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-800 font-semibold border border-zinc-300/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout: Tabs Sidebar + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-zinc-50 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Overview</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-zinc-50 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Orders & Tracking</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-zinc-50 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <span>Address Book</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-bold">
              {customer.addresses?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-zinc-50 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Loyalty & Referrals</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-zinc-50 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4" />
              <span>Profile & Security</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[10px] font-mono uppercase text-zinc-800 font-semibold font-medium mb-1">Lifetime Spend</div>
                  <div className="text-2xl font-black text-zinc-900 font-mono">
                    ${customer.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">
                    ✓ Verified Platinum Tier
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[10px] font-mono uppercase text-zinc-800 font-semibold font-medium mb-1">Loyalty Rewards</div>
                  <div className="text-2xl font-black text-amber-600 font-mono">
                    {customer.loyaltyPoints} pts
                  </div>
                  <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1">
                    Equivalent to ${((customer.loyaltyPoints / 100) * 5).toFixed(2)} store credit
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[10px] font-mono uppercase text-zinc-800 font-semibold font-medium mb-1">Available Store Credit</div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">
                    ${customer.storeCredit.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1">Auto-applied at checkout</div>
                </div>
              </div>

              {/* Referral Promotion Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Patron Referral Invitation</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mt-1">Give $50, Get 500 Loyalty Points</h3>
                  <p className="text-xs text-zinc-800 font-semibold mt-0.5">
                    Share your unique invitation code with colleagues and fellow design collectors.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 font-mono font-bold text-xs text-zinc-900 select-all">
                    {customer.referralCode}
                  </div>
                  <button
                    onClick={handleCopyReferral}
                    className="p-2.5 rounded-xl bg-zinc-50 hover:bg-black text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-zinc-200/80 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-900">Recent Dispatches</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-zinc-800 font-semibold py-6 text-center">No orders registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-900 font-bold flex items-center justify-center font-mono text-xs font-bold shrink-0">
                            AUR
                          </div>
                          <div>
                            <div className="font-bold text-xs text-zinc-900">{ord.orderNumber}</div>
                            <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">
                              {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} item(s) •{' '}
                              <span className="font-bold text-zinc-800">${ord.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedInvoice(ord);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold hover:bg-zinc-100 transition-colors"
                          >
                            Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & REAL-TIME DISPATCH TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Your Acquisition History</h2>
                  <p className="text-xs text-zinc-800 font-semibold font-medium">
                    Real-time carrier tracking, 1-click reorder, printable tax invoices, and RMA returns.
                  </p>
                </div>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-800 font-semibold">Loading order timeline...</div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center bg-zinc-50 rounded-3xl border border-zinc-200/80 p-8 space-y-4">
                  <Package className="w-10 h-10 text-zinc-800 font-bold mx-auto" />
                  <h3 className="text-sm font-bold text-zinc-900">No Orders Yet</h3>
                  <p className="text-xs text-zinc-800 font-semibold font-medium max-w-sm mx-auto">
                    Explore our curated collection of industrial design pieces and place your first acquisition.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-50 text-zinc-900 font-bold font-bold text-xs"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-6"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-zinc-900">{ord.orderNumber}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-800 font-semibold font-mono mt-0.5">
                            Acquired on {new Date(ord.createdAt).toLocaleDateString()} • Paid via {ord.paymentMethod}
                          </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => reorderOrder(ord.items)}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-order Items</span>
                          </button>

                          <button
                            onClick={() => setSelectedInvoice(ord)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => {
                              setRmaOrder(ord);
                              setRmaSuccess('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs font-semibold transition-colors"
                          >
                            Return / Exchange
                          </button>
                        </div>
                      </div>

                      {/* Live Carrier Tracking Progress Bar */}
                      {ord.carrier && ord.trackingNumber && (
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-zinc-900" />
                              <span className="font-bold text-zinc-900">{ord.carrier}</span>
                              <span className="font-mono text-zinc-800 font-semibold font-medium">#{ord.trackingNumber}</span>
                            </div>
                            <span className="font-mono text-[11px] text-emerald-600 font-bold">
                              {ord.status === 'delivered' ? '✓ Delivered to Destination' : 'In Transit'}
                            </span>
                          </div>

                          {/* 4-Step Visual Progress Bar */}
                          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                            <div>
                              <div className="h-1.5 rounded-full bg-emerald-500 mb-1" />
                              <span className="text-[10px] font-mono text-zinc-800 font-semibold font-medium">Confirmed</span>
                            </div>
                            <div>
                              <div className="h-1.5 rounded-full bg-emerald-500 mb-1" />
                              <span className="text-[10px] font-mono text-zinc-800 font-semibold font-medium">Vault Packed</span>
                            </div>
                            <div>
                              <div className={`h-1.5 rounded-full mb-1 ${ord.status === 'shipped' || ord.status === 'delivered' ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                              <span className="text-[10px] font-mono text-zinc-800 font-semibold font-medium">Dispatched</span>
                            </div>
                            <div>
                              <div className={`h-1.5 rounded-full mb-1 ${ord.status === 'delivered' ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                              <span className="text-[10px] font-mono text-zinc-800 font-semibold font-medium">Delivered</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="space-y-3">
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 py-2 border-b border-zinc-50 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/60">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-zinc-900">{item.name}</h4>
                                <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">
                                  SKU: {item.sku} • Qty: {item.quantity}
                                </div>
                                {item.selectedOptions && (
                                  <div className="text-[10px] text-zinc-800 font-semibold font-mono">
                                    {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs font-bold text-zinc-900 font-mono">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-[10px] text-zinc-800 font-semibold font-mono">
                                ${item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial Footnote */}
                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-800 font-semibold font-medium font-mono">
                        <div>
                          Dispatching to: <span className="text-zinc-800">{ord.shippingAddress.city}, {ord.shippingAddress.country}</span>
                        </div>
                        <div className="text-right">
                          Grand Total: <span className="font-bold text-zinc-900 text-sm">${ord.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Saved Shipping Destinations</h2>
                  <p className="text-xs text-zinc-800 font-semibold font-medium">
                    Manage multiple dispatch residences, ateliers, and corporate suites.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Destination</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-zinc-900">{addr.title}</span>
                        {addr.isDefaultShipping && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                            Default Shipping
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-zinc-800">{addr.recipientName}</div>
                      <p className="text-xs text-zinc-800 font-semibold font-medium mt-1 leading-relaxed">
                        {addr.street}
                        <br />
                        {addr.city}, {addr.state} {addr.zip}
                        <br />
                        {addr.country}
                      </p>
                      <div className="text-[11px] text-zinc-800 font-semibold font-mono mt-2">Tel: {addr.phone}</div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <button
                        onClick={() => updateCustomerAddress(addr.id, { isDefaultShipping: true })}
                        disabled={addr.isDefaultShipping}
                        className="text-[11px] font-mono font-semibold text-amber-600 hover:underline disabled:opacity-40"
                      >
                        {addr.isDefaultShipping ? 'Primary Dispatch Destination' : 'Make Default'}
                      </button>
                      <button
                        onClick={() => deleteCustomerAddress(addr.id)}
                        className="p-1.5 text-zinc-800 font-semibold hover:text-rose-500 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REWARDS & REFERRALS */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Concierge Collector Rewards</h2>
                <p className="text-xs text-zinc-800 font-semibold font-medium">
                  Earn points on every acquisition, unlock higher tiers, and redeem exclusive perks.
                </p>
              </div>

              {/* Tier Progress Bar */}
              <div className="p-6 rounded-3xl bg-zinc-50 text-zinc-900 font-bold space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm">Collector Tier Status: {customer.tier}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">{customer.loyaltyPoints} Points</span>
                </div>

                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                    style={{
                      width:
                        customer.tier === 'Platinum'
                          ? '100%'
                          : customer.tier === 'Gold'
                          ? '75%'
                          : customer.tier === 'Silver'
                          ? '50%'
                          : '25%',
                    }}
                  />
                </div>

                <div className="grid grid-cols-4 text-center text-[10px] font-mono text-zinc-800 font-semibold pt-1">
                  <div>Bronze ($0)</div>
                  <div>Silver ($500)</div>
                  <div>Gold ($1,500)</div>
                  <div className="text-amber-400 font-bold">Platinum ($3,000+)</div>
                </div>
              </div>

              {/* Redemption Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">$25 Atelier Voucher</div>
                    <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1">Requires 500 Loyalty Points</div>
                  </div>
                  <button
                    onClick={() => addToast('Voucher voucher code generated: REWARD25', 'success')}
                    className="w-full py-2 rounded-xl bg-zinc-50 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Redeem (500 pts)
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">$60 Vault Voucher</div>
                    <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1">Requires 1,000 Loyalty Points</div>
                  </div>
                  <button
                    onClick={() => addToast('Voucher voucher code generated: REWARD60', 'success')}
                    className="w-full py-2 rounded-xl bg-zinc-50 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Redeem (1,000 pts)
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Free Express Air Freight</div>
                    <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1">Requires 250 Loyalty Points</div>
                  </div>
                  <button
                    onClick={() => addToast('Free express shipping applied to your bag', 'success')}
                    className="w-full py-2 rounded-xl bg-zinc-50 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Redeem (250 pts)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Personal Details & Security</h2>
                <p className="text-xs text-zinc-800 font-semibold font-medium">Update your account credentials and contact communications.</p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={customer.name}
                    id="prof-name"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={customer.email}
                    id="prof-email"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Telephone</label>
                  <input
                    type="tel"
                    defaultValue={customer.phone}
                    id="prof-phone"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const name = (document.getElementById('prof-name') as HTMLInputElement)?.value;
                    const email = (document.getElementById('prof-email') as HTMLInputElement)?.value;
                    const phone = (document.getElementById('prof-phone') as HTMLInputElement)?.value;
                    updateCustomerProfile({ name, email, phone });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-50 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>

              {/* Data Privacy & GDPR Sovereignty Controls */}
              <div className="pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-zinc-900">
                    Data Sovereignty & Legal Privacy Rights (GDPR / CCPA)
                  </h3>
                </div>
                <p className="text-xs text-zinc-800 font-semibold font-medium leading-relaxed max-w-xl">
                  In compliance with European GDPR (Articles 15–20) and California CCPA (§ 1798.100–105), you have full legal ownership over your transaction telemetry and profile information.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportData}
                    disabled={isExportingData}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-zinc-800 font-semibold" />
                    <span>{isExportingData ? 'Generating Dossier...' : 'Export Complete Data Dossier (.JSON)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErasureConfirmText('');
                      setIsErasureModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Request Cryptographic Erasure</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Printable Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* RMA Return Request Modal */}
      {rmaOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setRmaOrder(null);
                setRmaSuccess('');
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-900 mb-1">Initiate 30-Day Risk-Free Return</h3>
            <p className="text-xs text-zinc-800 font-semibold font-medium mb-6 font-mono">
              Order: {rmaOrder.orderNumber} • Prepaid DHL air return label
            </p>

            {rmaSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Return Authorization Issued</h4>
                <div className="text-xs font-mono font-bold text-emerald-800 bg-white py-2 px-4 rounded-xl border border-emerald-300 inline-block">
                  {rmaSuccess}
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  A prepaid return air freight label has been emailed to {customer.email}. Affix it to the original package and hand to any DHL courier.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRmaSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Select Return Reason</label>
                  <select
                    value={rmaReason}
                    onChange={(e) => setRmaReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  >
                    <option value="Change of preference">Change of preference / aesthetic adjustment</option>
                    <option value="Size or fit mismatch">Size or fit mismatch</option>
                    <option value="Component defective">Component or finish anomaly</option>
                    <option value="Delayed delivery">Delivery arrived outside scheduled window</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Additional Observations</label>
                  <textarea
                    rows={3}
                    placeholder="Provide any feedback for our quality inspection team..."
                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-zinc-50 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Generate Prepaid Return Label
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-900 mb-1">Add New Shipping Destination</h3>
            <p className="text-xs text-zinc-800 font-semibold font-medium mb-6 font-mono">
              Save a new residence, studio, or corporate suite for fast 1-click checkout.
            </p>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Label / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Studio or Weekend House"
                  value={newAddress.title}
                  onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.recipientName}
                  onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="742 Montgomery Street, Suite 400"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="San Francisco"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    placeholder="CA"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="94111"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-zinc-800 font-bold cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefaultShipping}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefaultShipping: e.target.checked })}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span>Set as default primary shipping destination</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-zinc-50 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Save Destination to Address Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GDPR Cryptographic Erasure Modal */}
      {isErasureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-rose-200">
            <button
              onClick={() => setIsErasureModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-zinc-900">Right to Be Forgotten</h3>
            </div>

            <p className="text-xs text-zinc-800 font-semibold leading-relaxed mb-4">
              Under GDPR Article 17 and CCPA § 1798.105, submitting this request will permanently and cryptographically erase your account, contact details, addresses, and saved wishlists from active storage.
            </p>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 space-y-1 mb-5">
              <span className="font-bold block">Important Fiscal Notice:</span>
              <span>Past completed tax and accounting transaction logs will be anonymized to meet statutory retention laws.</span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-zinc-800 font-bold">
                To confirm permanent erasure, type <span className="font-bold text-rose-600 select-all">ERASE_MY_DATA</span> below:
              </label>
              <input
                type="text"
                value={erasureConfirmText}
                onChange={(e) => setErasureConfirmText(e.target.value)}
                placeholder="ERASE_MY_DATA"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:border-rose-500"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsErasureModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={erasureConfirmText !== 'ERASE_MY_DATA' || isErasingData}
                  onClick={handleConfirmErasure}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isErasingData ? 'Erasing...' : 'Confirm Erasure'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
