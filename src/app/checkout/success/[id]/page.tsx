'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { OrderRecord } from '@/lib/db/schema';
import InvoiceModal from '@/components/orders/InvoiceModal';
import {
  CheckCircle,
  Package,
  Truck,
  FileText,
  ArrowRight,
  ExternalLink,
  Printer,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/v1/orders/${orderId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrder(json.data);
        } else {
          // If query by orderNumber
          fetch('/api/v1/orders')
            .then((res) => res.json())
            .then((list) => {
              if (list.success) {
                const found = list.data.find(
                  (o: OrderRecord) => o.id === orderId || o.orderNumber === orderId
                );
                if (found) setOrder(found);
              }
            });
        }
      })
      .catch((err) => console.error('Failed to fetch order', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Celebration Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-300">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-emerald-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment Authorized • Consignment Confirmed</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
          Thank You for Your Acquisition
        </h1>

        <p className="text-xs text-zinc-800 font-semibold font-medium leading-relaxed">
          Your order has been encrypted and transmitted to our Zurich & Copenhagen Vault facilities for white-glove inspection and custom packaging.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-800 font-semibold">
          Generating official consignment dossier...
        </div>
      ) : order ? (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-zinc-900/5 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Order Identity Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 font-mono text-xs">
            <div>
              <div className="text-zinc-800 font-semibold text-[10px] uppercase">Consignment Number</div>
              <div className="text-sm font-bold text-zinc-900 mt-0.5">{order.orderNumber}</div>
            </div>

            <div>
              <div className="text-zinc-800 font-semibold text-[10px] uppercase">Confirmation Dispatched To</div>
              <div className="text-sm font-bold text-zinc-900 mt-0.5">{order.customerEmail}</div>
            </div>

            <div>
              <div className="text-zinc-800 font-semibold text-[10px] uppercase">Est. Air Delivery</div>
              <div className="text-sm font-bold text-emerald-600 mt-0.5">3–5 Business Days</div>
            </div>
          </div>

          {/* Real-time Dispatch Milestones */}
          <div className="p-6 rounded-2xl bg-zinc-50 text-zinc-900 font-bold space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span className="font-bold">{order.carrier || 'DHL Express Priority Air'}</span>
                <span className="text-zinc-800 font-semibold font-mono">#{order.trackingNumber || 'DHL-9481928371'}</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">● Active Dispatch</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-mono">
              <div>
                <div className="h-1.5 rounded-full bg-emerald-400 mb-1" />
                <span className="text-zinc-900 font-bold">Confirmed</span>
              </div>
              <div>
                <div className="h-1.5 rounded-full bg-emerald-400 mb-1" />
                <span className="text-zinc-900 font-bold">Vault QC</span>
              </div>
              <div>
                <div className="h-1.5 rounded-full bg-zinc-200 mb-1" />
                <span className="text-zinc-800 font-semibold">In Air Transit</span>
              </div>
              <div>
                <div className="h-1.5 rounded-full bg-zinc-200 mb-1" />
                <span className="text-zinc-800 font-semibold">Delivered</span>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 font-semibold">
              Purchased Hardware ({order.items.length})
            </h3>
            <div className="divide-y divide-zinc-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
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
                        SKU: {item.sku} • Quantity: {item.quantity}
                      </div>
                      {item.selectedOptions && (
                        <div className="text-[10px] text-zinc-800 font-semibold font-mono">
                          {Object.values(item.selectedOptions).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-900 font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
            <div className="text-xs text-zinc-800 font-semibold space-y-1">
              <div className="font-bold text-zinc-900 font-mono uppercase text-[11px] mb-2">
                Shipping Destination:
              </div>
              <div>{order.customerName}</div>
              <div>{order.shippingAddress.street}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </div>
              <div>{order.shippingAddress.country}</div>
            </div>

            <div className="space-y-2 text-xs font-mono text-right">
              <div className="flex justify-between text-zinc-800 font-semibold font-medium">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promotional Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-800 font-semibold font-medium">
                <span>Air Freight Shipping</span>
                <span className="font-semibold text-zinc-900">
                  {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-800 font-semibold font-medium">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold text-zinc-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-bold text-zinc-900">
                <span>Total Paid</span>
                <span className="text-base text-zinc-950">${order.total.toFixed(2)} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Next Steps Actions */}
          <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Tax Invoice</span>
              </button>

              <Link
                href="/track"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Telemetry Tracker</span>
              </Link>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-50 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              <span>Explore More Atelier Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-10 text-center space-y-4">
          <p className="text-xs text-zinc-800 font-semibold font-medium">
            Order confirmed. Your invoice and tracking telemetry have been dispatched to your email.
          </p>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-50 text-zinc-900 font-bold font-bold text-xs"
          >
            <span>View in Patron Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Printable Tax Invoice Modal */}
      {isInvoiceOpen && order && (
        <InvoiceModal order={order} onClose={() => setIsInvoiceOpen(false)} />
      )}
    </div>
  );
}
