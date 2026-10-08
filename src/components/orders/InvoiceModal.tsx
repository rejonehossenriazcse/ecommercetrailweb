'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { OrderRecord } from '@/lib/db/schema';
import { Printer, X, FileText, PackageCheck, Check, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: OrderRecord;
  onClose: () => void;
  defaultMode?: 'invoice' | 'packing_slip';
}

export default function InvoiceModal({ order, onClose, defaultMode = 'invoice' }: InvoiceModalProps) {
  const [mode, setMode] = useState<'invoice' | 'packing_slip'>(defaultMode);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-zinc-50 text-zinc-900 font-bold border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('invoice')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mode === 'invoice' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-700 hover:text-white'
                }`}
              >
                Tax Invoice
              </button>
              <button
                type="button"
                onClick={() => setMode('packing_slip')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mode === 'packing_slip' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-700 hover:text-white'
                }`}
              >
                Warehouse Packing Slip
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-800 font-semibold hover:text-zinc-900 font-bold hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-order-doc" className="p-8 sm:p-12 overflow-y-auto space-y-8 bg-white print:p-0 print:m-0">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-zinc-200 pb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tighter text-zinc-950 font-mono">STRIDE</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-600 text-white font-bold tracking-wider">
                  DISTRICT
                </span>
              </div>
              <p className="text-xs text-zinc-800 font-semibold font-medium font-sans mt-1">100% Verified Authentic Sneakers & Grails</p>
              <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono mt-3 leading-relaxed">
                STRIDE DISTRICT INC.<br />
                540 Broadway, SoHo, New York, NY 10012<br />
                EIN: 13-9824018 • EORI: GB982341908 • VAT: US-942109831
              </div>
            </div>

            <div className="sm:text-right">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 font-mono">
                {mode === 'invoice' ? 'OFFICIAL TAX INVOICE' : 'WAREHOUSE PACKING SLIP'}
              </h2>
              <div className="text-xs font-mono font-bold text-zinc-900 mt-1">
                Ref: {order.orderNumber}
              </div>
              <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono mt-1">
                Issue Date: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">
                Payment Status:{' '}
                <span className="font-bold uppercase text-emerald-600">
                  {order.paymentStatus}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">
                  Waybill: <span className="font-bold">{order.carrier} {order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono border-b border-zinc-200 pb-8">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <div className="text-[10px] font-bold text-zinc-800 font-semibold uppercase tracking-wider mb-1.5">
                Billed To (Patron)
              </div>
              <div className="font-bold text-zinc-900 text-sm font-sans">{order.customerName}</div>
              <div className="text-zinc-800 font-semibold mt-1 leading-relaxed">
                {order.customerEmail}<br />
                {order.customerPhone && <>{order.customerPhone}<br /></>}
                Payment: {order.paymentMethod}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <div className="text-[10px] font-bold text-zinc-800 font-semibold uppercase tracking-wider mb-1.5">
                Consignee Shipping Destination
              </div>
              <div className="font-bold text-zinc-900 text-sm font-sans">{order.customerName}</div>
              <div className="text-zinc-800 font-semibold mt-1 leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                {order.shippingAddress.country}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-zinc-200 text-zinc-900 font-bold uppercase text-[11px]">
                  {mode === 'packing_slip' && <th className="py-2.5 px-2 w-8 text-center">Chk</th>}
                  <th className="py-2.5 px-2">Design Description</th>
                  <th className="py-2.5 px-2">SKU / Vault Bin</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  {mode === 'invoice' && (
                    <>
                      <th className="py-2.5 px-2 text-right">Unit Price</th>
                      <th className="py-2.5 px-2 text-right">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-800 font-bold">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="align-top">
                    {mode === 'packing_slip' && (
                      <td className="py-3 px-2 text-center">
                        <div className="w-4 h-4 border-2 border-zinc-400 rounded mx-auto" />
                      </td>
                    )}
                    <td className="py-3 px-2">
                      <div className="font-bold text-zinc-900 font-sans">{item.name}</div>
                      {item.selectedOptions && (
                        <div className="text-[10px] text-zinc-800 font-semibold font-medium">
                          {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-zinc-800 font-semibold font-medium">
                      <div>{item.sku}</div>
                      <div className="text-[10px] text-zinc-800 font-semibold font-sans">
                        {mode === 'packing_slip' ? `Bin: ZUR-V-${(idx + 1) * 4}B` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-zinc-900">
                      {item.quantity}
                    </td>
                    {mode === 'invoice' && (
                      <>
                        <td className="py-3 px-2 text-right text-zinc-800 font-semibold">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-zinc-900">
                          ${item.total.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown (Only shown in Invoice mode) */}
          {mode === 'invoice' ? (
            <div className="flex justify-end pt-4 border-t border-zinc-200 font-mono text-xs">
              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between text-zinc-800 font-semibold font-medium">
                  <span>Subtotal:</span>
                  <span className="font-bold text-zinc-900">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({order.couponCode || 'Promo'}):</span>
                    <span className="font-bold">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-800 font-semibold font-medium">
                  <span>Shipping & Handling:</span>
                  <span className="font-bold text-zinc-900">
                    {order.shipping === 0 ? 'COMPLIMENTARY' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-800 font-semibold font-medium">
                  <span>Estimated VAT / Tax (8%):</span>
                  <span className="font-bold text-zinc-900">${order.tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t-2 border-zinc-200 flex justify-between text-sm font-bold text-zinc-950">
                  <span>Total Amount:</span>
                  <span>${order.total.toFixed(2)} {order.currency}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Packing Slip Warehouse Inspection Sign-off block */
            <div className="pt-6 border-t border-zinc-200 text-xs font-mono space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] text-zinc-800 font-semibold uppercase font-bold">Inspected & Picked By</div>
                  <div className="mt-4 pt-2 border-b border-zinc-300 text-zinc-800 font-semibold font-medium text-[11px]">Vault Inspector #402</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-800 font-semibold uppercase font-bold">White-Glove Packaging</div>
                  <div className="mt-4 pt-2 border-b border-zinc-300 text-emerald-600 font-bold text-[11px]">Verified & Sealed</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-800 font-semibold uppercase font-bold">Consignment Weight</div>
                  <div className="mt-4 pt-2 border-b border-zinc-300 text-zinc-800 font-bold text-[11px]">3.42 kg gross</div>
                </div>
              </div>
            </div>
          )}

          {/* Barcode & Legal Footer */}
          <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[10px] text-zinc-800 font-semibold font-mono">
            <div>
              <div className="font-bold text-zinc-800 font-semibold uppercase">STRIDE DISTRICT 100% AUTHENTICITY GUARANTEE</div>
              <div>All grails verified deadstock with multi-point inspection and UV verification. Retain this invoice for your archive.</div>
            </div>

            <div className="flex flex-col items-center sm:items-end">
              <div className="tracking-[0.3em] font-mono font-bold text-xs text-zinc-800">
                |||| | ||||| || |||||| | |||| |||
              </div>
              <div className="text-[9px] text-zinc-800 font-semibold font-medium mt-0.5">{order.orderNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
