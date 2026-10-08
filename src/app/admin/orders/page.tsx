'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { OrderRecord } from '@/lib/db/schema';
import InvoiceModal from '@/components/orders/InvoiceModal';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileText,
  Search,
  ChevronRight,
  ShieldCheck,
  X,
  CreditCard,
  User,
  MapPin,
  Download,
  AlertCircle,
  PackageCheck,
  Ban,
  DollarSign,
  Printer,
  Sparkles,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Manual Order Creation states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerEmail, setManualCustomerEmail] = useState('');
  const [manualStreet, setManualStreet] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualState, setManualState] = useState('');
  const [manualZip, setManualZip] = useState('');
  const [manualCountry, setManualCountry] = useState('US');
  const [manualPaymentMethod, setManualPaymentMethod] = useState('Stripe Credit Card');
  const [manualPaymentStatus, setManualPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [manualShippingFee, setManualShippingFee] = useState<number>(0);
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [manualNotes, setManualNotes] = useState('');
  const [manualItems, setManualItems] = useState<
    Array<{
      productId: string;
      productName: string;
      sku: string;
      price: number;
      quantity: number;
      image: string;
    }>
  >([]);

  // Fulfillment modal states
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [carrier, setCarrier] = useState('DHL Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Refund modal states
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Customer Satisfaction RMA');
  const [refundRestock, setRefundRestock] = useState(true);

  // Cancellation modal states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Customer requested order cancellation');

  // Invoice / Packing Slip Modal
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<OrderRecord | null>(null);
  const [invoiceModalMode, setInvoiceModalMode] = useState<'invoice' | 'packing_slip'>('invoice');

  const fetchOrders = () => {
    fetch('/api/v1/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setOrders(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (status: OrderRecord['status'], fulfillment: OrderRecord['fulfillmentStatus']) => {
    if (!selectedOrder) return;
    const res = await fetch(`/api/v1/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        fulfillmentStatus: fulfillment,
        carrier,
        trackingNumber: trackingNumber || `TRK-${Date.now().toString().slice(-8)}`,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? json.data : o)));
      setSelectedOrder(json.data);
      setIsFulfillModalOpen(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedOrder) return;
    const res = await fetch(`/api/v1/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'refund',
        refundAmount: refundAmount || selectedOrder.total,
        reason: refundReason,
        restock: refundRestock,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? json.data : o)));
      setSelectedOrder(json.data);
      setIsRefundModalOpen(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    const res = await fetch(`/api/v1/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'cancel',
        reason: cancelReason,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? json.data : o)));
      setSelectedOrder(json.data);
      setIsCancelModalOpen(false);
    }
  };

  const handleReviewReturn = async (returnStatus: 'approved' | 'rejected', reason: string) => {
    if (!selectedOrder) return;
    const res = await fetch(`/api/v1/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_return',
        returnStatus,
        reason,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? json.data : o)));
      setSelectedOrder(json.data);
    }
  };

  // Manual Order Handlers
  const handleOpenCreateModal = async () => {
    setIsCreateModalOpen(true);
    if (catalogProducts.length === 0) {
      try {
        const res = await fetch('/api/v1/products');
        const json = await res.json();
        if (json.success) {
          setCatalogProducts(json.data);
        }
      } catch (err) {
        console.error('Failed to load catalog products', err);
      }
    }
  };

  const handleAddManualItem = (productId: string) => {
    const prod = catalogProducts.find((p) => p.id === productId);
    if (!prod) return;
    const existing = manualItems.find((i) => i.productId === prod.id);
    if (existing) {
      setManualItems(
        manualItems.map((i) => (i.productId === prod.id ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      setManualItems([
        ...manualItems,
        {
          productId: prod.id,
          productName: prod.title,
          sku: prod.sku || `SKU-${prod.id.slice(0, 6)}`,
          price: prod.price,
          quantity: 1,
          image: prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        },
      ]);
    }
  };

  const handleRemoveManualItem = (index: number) => {
    setManualItems(manualItems.filter((_, idx) => idx !== index));
  };

  const handleUpdateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveManualItem(index);
      return;
    }
    setManualItems(
      manualItems.map((item, idx) => (idx === index ? { ...item, quantity } : item))
    );
  };

  const handleSubmitManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualItems.length === 0) {
      alert('Please add at least one line item to the order.');
      return;
    }
    const subtotal = manualItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal + tax + Number(manualShippingFee) - Number(manualDiscount));

    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: manualCustomerName || 'Walk-in / Phone Client',
          customerEmail: manualCustomerEmail || 'phone-orders@aurora-vault.com',
          status: 'processing',
          paymentStatus: manualPaymentStatus,
          paymentMethod: manualPaymentMethod,
          subtotal,
          tax,
          shipping: Number(manualShippingFee),
          discount: Number(manualDiscount),
          total,
          items: manualItems,
          shippingAddress: {
            street: manualStreet || 'Manual Order Pick-Up',
            city: manualCity || 'New York',
            state: manualState || 'NY',
            zip: manualZip || '10001',
            country: manualCountry || 'US',
          },
          notes: manualNotes || 'Created manually by Store Administrator.',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) => [json.data, ...prev]);
        setSelectedOrder(json.data);
        setIsCreateModalOpen(false);
        setManualCustomerName('');
        setManualCustomerEmail('');
        setManualStreet('');
        setManualCity('');
        setManualState('');
        setManualZip('');
        setManualItems([]);
        setManualNotes('');
        alert(`Order ${json.data.orderNumber} created successfully!`);
      } else {
        alert(json.error || 'Failed to create manual order');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create manual order');
    }
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Email',
      'Payment Status',
      'Fulfillment Status',
      'Shipping Status',
      'Payment Method',
      'Items Count',
      'Subtotal',
      'Discount',
      'Tax',
      'Shipping',
      'Total Paid',
      'Carrier',
      'Tracking Number',
      'Return Status',
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toISOString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerEmail}"`,
      `"${o.paymentStatus}"`,
      `"${o.fulfillmentStatus}"`,
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
      o.items.length,
      o.subtotal.toFixed(2),
      o.discount.toFixed(2),
      o.tax.toFixed(2),
      o.shipping.toFixed(2),
      o.total.toFixed(2),
      `"${o.carrier || ''}"`,
      `"${o.trackingNumber || ''}"`,
      `"${o.returnStatus || 'none'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate Metrics
  const grossRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.paymentStatus !== 'refunded')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingFulfillmentCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const inTransitCount = orders.filter((o) => o.status === 'shipped').length;
  const returnsCount = orders.filter((o) => o.returnStatus === 'requested').length;

  const filtered = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'returns') {
      matchesStatus = o.returnStatus === 'requested' || o.returnStatus === 'approved';
    } else {
      matchesStatus = o.status === statusFilter;
    }

    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Orders & Shipments"
        badge="Frontend Control: Order History & Tracking"
        description="Fulfill incoming customer orders, input courier waybills (DHL Express, FedEx, UPS), generate printable invoices, and manage returns."
        controlsWhat="Customer order history under /account, tracking lookup at /track, and dispatch confirmation emails."
        previewUrl="/track"
        breadcrumbs={[{ label: 'Sales & Orders' }, { label: 'Orders & Shipments' }]}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Manual Order</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer border border-zinc-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#14181f] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-2">
            ${grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Across settled orders</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14181f] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pending Dispatch</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-2">
            {pendingFulfillmentCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Awaiting vault packaging</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14181f] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>In-Transit Air Cargo</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono mt-2">
            {inTransitCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Courier active telemetry</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14181f] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>RMA Return Claims</span>
            <RotateCcw className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono mt-2">
            {returnsCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Needs review & restock</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#14181f] border border-zinc-800 rounded-2xl text-xs">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'returns', 'refunded', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st} {st === 'returns' && returnsCount > 0 && `(${returnsCount})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, email, or tracking..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#14181f] border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#14181f] border border-zinc-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1217] border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Collector</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                    No orders matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-white flex items-center gap-1.5">
                      <span>{ord.orderNumber}</span>
                      {ord.returnStatus === 'requested' && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" title="RMA Requested" />
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-zinc-500">{ord.customerEmail}</div>
                    </td>

                    <td className="p-4 font-mono text-zinc-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.paymentStatus === 'refunded'
                            ? 'bg-rose-500/20 text-rose-400'
                            : ord.paymentStatus === 'partially_refunded'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.status === 'shipped'
                            ? 'bg-blue-500/20 text-blue-400'
                            : ord.status === 'processing'
                            ? 'bg-purple-500/20 text-purple-400'
                            : ord.status === 'refunded'
                            ? 'bg-rose-500/20 text-rose-400'
                            : ord.status === 'cancelled'
                            ? 'bg-zinc-700 text-zinc-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-white">
                      ${ord.total.toFixed(2)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setRefundAmount(ord.total);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer text-[11px]"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#14181f] text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Order Dossier
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* RMA Return Request Banner (if applicable) */}
            {selectedOrder.returnStatus === 'requested' && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-purple-400" />
                    <span>Customer Submitted RMA Return Request</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 uppercase">
                    Action Required
                  </span>
                </div>
                <div className="text-xs text-zinc-300">
                  <strong>Reason:</strong> {selectedOrder.returnReason || 'Customer requested return'}
                </div>
                <div className="flex gap-2 pt-1 text-xs">
                  <button
                    onClick={() => handleReviewReturn('approved', 'Approved by store management. Refund issued & inventory restocked.')}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer"
                  >
                    Approve RMA & Restock
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('State reason for RMA rejection:') || 'Not eligible for return';
                      handleReviewReturn('rejected', reason);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-colors cursor-pointer"
                  >
                    Reject RMA
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
              {selectedOrder.status !== 'shipped' &&
                selectedOrder.status !== 'delivered' &&
                selectedOrder.status !== 'refunded' &&
                selectedOrder.status !== 'cancelled' && (
                  <button
                    onClick={() => setIsFulfillModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch & Assign Waybill</span>
                  </button>
                )}

              {selectedOrder.status === 'shipped' && (
                <button
                  onClick={() => handleUpdateStatus('delivered', 'fulfilled')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Delivered</span>
                </button>
              )}

              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'refunded' && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-rose-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Order</span>
                </button>
              )}

              {selectedOrder.paymentStatus !== 'refunded' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => setIsRefundModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Process Refund</span>
                </button>
              )}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => {
                    setInvoiceModalOrder(selectedOrder);
                    setInvoiceModalMode('invoice');
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Official Tax Invoice"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tax Invoice</span>
                </button>

                <button
                  onClick={() => {
                    setInvoiceModalOrder(selectedOrder);
                    setInvoiceModalMode('packing_slip');
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Warehouse Packing Slip"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Packing Slip</span>
                </button>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Purchased Designs</h4>
              <div className="divide-y divide-zinc-800 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                        <Image src={it.image} alt={it.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{it.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          SKU: {it.sku} • Qty: {it.quantity} • Unit: ${it.price.toFixed(2)}
                        </div>
                        {it.selectedOptions && (
                          <div className="text-[10px] text-zinc-400">
                            {Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-white text-xs">
                      ${it.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shipping Destination</span>
                </div>
                <div className="text-zinc-400 leading-relaxed font-mono">
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}<br />
                  {selectedOrder.shippingAddress.country}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Financial Breakdown</span>
                </div>
                <div className="text-zinc-400 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-white">
                      {selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span className="text-white">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-zinc-800 text-xs">
                    <span>Total Settled:</span>
                    <span>${selectedOrder.total.toFixed(2)} {selectedOrder.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Telemetry Banner */}
            {selectedOrder.trackingNumber && (
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold">Carrier:</span> {selectedOrder.carrier} • Tracking:{' '}
                  <span className="font-mono font-bold">{selectedOrder.trackingNumber}</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
                  {selectedOrder.status === 'delivered' ? 'Delivered' : 'In Transit'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {isFulfillModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-white rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Assign Carrier & Dispatch Shipment</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Carrier Provider</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  <option value="DHL Express">DHL Express Worldwide</option>
                  <option value="FedEx International Priority">FedEx International Priority</option>
                  <option value="UPS Worldwide Express">UPS Worldwide Express Saver</option>
                  <option value="District Insured Express Courier">District Insured Express Courier</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Waybill / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DHL-9481928371"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsFulfillModalOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus('shipped', 'fulfilled')}
                className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase hover:bg-amber-300 cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {isCancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-white rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cancel Order & Restock Inventory</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to cancel order <strong>{selectedOrder.orderNumber}</strong>? All items will be restored to warehouse inventory stock.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Cancellation Reason</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold uppercase hover:bg-rose-500 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal (Full & Partial) */}
      {isRefundModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-white rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Process Refund Settlement</h3>
            <p className="text-xs text-zinc-400">
              Order Total: <strong>${selectedOrder.total.toFixed(2)}</strong> via {selectedOrder.paymentMethod}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">
                  Refund Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedOrder.total}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  required
                />
                <div className="text-[10px] text-zinc-500 mt-1 flex justify-between">
                  <span>Enter {selectedOrder.total} for Full Refund</span>
                  <button
                    type="button"
                    onClick={() => setRefundAmount(selectedOrder.total)}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Set Max
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">RMA Reason / Note</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="refundRestock"
                  checked={refundRestock}
                  onChange={(e) => setRefundRestock(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-400 focus:ring-0"
                />
                <label htmlFor="refundRestock" className="text-zinc-300 cursor-pointer">
                  Restock line items to warehouse inventory
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold uppercase hover:bg-rose-500 cursor-pointer"
              >
                Execute Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Order Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#0f1217] border border-zinc-800 p-6 space-y-6 text-white my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Create Manual Back-Office Order</h3>
                  <p className="text-xs text-zinc-400">Dispatch phone orders, VIP client reservations, or walk-in purchases</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitManualOrder} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">1. Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerName}
                      onChange={(e) => setManualCustomerName(e.target.value)}
                      placeholder="e.g. Lady Genevieve Vance"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-amber-400/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={manualCustomerEmail}
                      onChange={(e) => setManualCustomerEmail(e.target.value)}
                      placeholder="e.g. genevieve@vance-holdings.co.uk"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-amber-400/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">2. Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-3">
                    <label className="text-zinc-400 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={manualStreet}
                      onChange={(e) => setManualStreet(e.target.value)}
                      placeholder="e.g. 740 Park Avenue, Penthouse B"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-amber-400/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-amber-400/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">State / Province</label>
                    <input
                      type="text"
                      value={manualState}
                      onChange={(e) => setManualState(e.target.value)}
                      placeholder="NY"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-amber-400/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={manualZip}
                      onChange={(e) => setManualZip(e.target.value)}
                      placeholder="10021"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-amber-400/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Items Picker */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">3. Line Items</h4>
                  <div className="flex items-center gap-2">
                    <select
                      id="manualProductPicker"
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white outline-none"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddManualItem(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="" disabled>Select product to add...</option>
                      {catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (${p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {manualItems.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                    No items added yet. Select a product above to add to this order.
                  </div>
                ) : (
                  <div className="space-y-2 border border-zinc-800/80 rounded-xl overflow-hidden bg-black/20">
                    {manualItems.map((item, idx) => (
                      <div key={item.productId} className="flex items-center justify-between p-3 border-b border-zinc-800/60 last:border-b-0 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                          <div>
                            <div className="font-bold text-white">{item.productName}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{item.sku} &bull; ${item.price.toFixed(2)} ea</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(idx, item.quantity - 1)}
                              className="px-2 py-1 text-zinc-400 hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-2 text-white font-mono">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(idx, item.quantity + 1)}
                              className="px-2 py-1 text-zinc-400 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-mono font-bold text-white w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveManualItem(idx)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment & Financial Adjustments */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">4. Payment & Billing Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Payment Method</label>
                    <select
                      value={manualPaymentMethod}
                      onChange={(e) => setManualPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none"
                    >
                      <option value="Stripe Credit Card">Stripe Credit Card (Pre-authorized)</option>
                      <option value="Direct Bank Wire">Direct Bank Wire (IBAN/SWIFT)</option>
                      <option value="Cash on Delivery">Cash on Delivery (Courier Escrow)</option>
                      <option value="POS Retail Terminal">POS Retail Terminal / In-Store Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Payment Status</label>
                    <select
                      value={manualPaymentStatus}
                      onChange={(e) => setManualPaymentStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none"
                    >
                      <option value="paid">Paid / Settled</option>
                      <option value="pending">Pending Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Shipping Fee ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={manualShippingFee}
                      onChange={(e) => setManualShippingFee(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Discounts / Concessions ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={manualDiscount}
                      onChange={(e) => setManualDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-zinc-400 block mb-1">Internal Notes</label>
                    <input
                      type="text"
                      value={manualNotes}
                      onChange={(e) => setManualNotes(e.target.value)}
                      placeholder="e.g. VIP client booked via private concierge telephone line."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SUBTOTAL</span>
                    <span className="text-white font-bold">
                      ${manualItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">EST. TAX (8%)</span>
                    <span className="text-zinc-300">
                      ${(manualItems.reduce((acc, i) => acc + i.price * i.quantity, 0) * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">GRAND TOTAL</span>
                    <span className="text-emerald-400 font-bold text-base">
                      ${Math.max(
                        0,
                        manualItems.reduce((acc, i) => acc + i.price * i.quantity, 0) * 1.08 +
                          Number(manualShippingFee) -
                          Number(manualDiscount)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={manualItems.length === 0}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Create & Record Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Tax Invoice & Packing Slip Modal */}
      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          defaultMode={invoiceModalMode}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
}
