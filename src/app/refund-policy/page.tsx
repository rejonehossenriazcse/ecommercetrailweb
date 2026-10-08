import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-xs text-zinc-800 font-bold leading-relaxed">
      <div>
        <span className="font-mono text-zinc-800 font-semibold uppercase tracking-widest text-[11px]">Satisfaction Guarantee</span>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mt-1">30-Day Risk-Free Trial & Returns (RMA)</h1>
        <p className="text-zinc-800 font-semibold font-medium mt-1">Zero-Hassle Prepaid Return Protocol</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">1. The 30-Day Trial Window</h2>
          <p>
            We invite you to experience our hardware in your home, studio, and daily transit. If an item fails to exceed your acoustic or tactile expectations, you may initiate an RMA return within 30 days of confirmed carrier delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">2. Complimentary Return Labels</h2>
          <p>
            We supply a prepaid return shipping label and scheduled courier pickup from your address. Items must be returned in original protective packaging with all accessories and cables included.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">3. Rapid Refund Settlement</h2>
          <p>
            Once received and inspected by our technical atelier, refunds are credited back to your original payment method (Credit card, Stripe, PayPal, Apple Pay, Google Pay) within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
