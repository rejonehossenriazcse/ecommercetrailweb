import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-xs text-zinc-700 leading-relaxed">
      <div>
        <span className="font-mono text-zinc-400 uppercase tracking-widest text-[11px]">Logistics Protocol</span>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mt-1">Shipping & Transit Policy</h1>
        <p className="text-zinc-500 mt-1">Carbon-Neutral Global Fulfillment</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">1. Dispatch Schedules</h2>
          <p>
            Orders verified before 2:00 PM CET are packaged in biodegradable cushioned containers and dispatched the same business day from our primary Copenhagen or secondary Zurich regional logistics hubs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">2. Complimentary Shipping Threshold</h2>
          <p>
            All international orders exceeding $150.00 USD (or equivalent in EUR, GBP, CAD, AUD) qualify for automated Complimentary Insured Air Express Delivery via DHL Express or FedEx International Priority.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">3. Real-Time Tracking & Signature Verification</h2>
          <p>
            Upon carrier scan, customers receive an automated SMS/email with a direct tracking link and delivery time-window selector. All high-value horological and beryllium audio shipments require direct adult signature.
          </p>
        </section>
      </div>
    </div>
  );
}
