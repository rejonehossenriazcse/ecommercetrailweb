import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-xs text-zinc-400 leading-relaxed">
      <div>
        <span className="font-mono text-orange-400 uppercase tracking-widest text-[11px]">Legal Framework</span>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">Terms of Service</h1>
        <p className="text-zinc-500 mt-1">Effective Date: October 4, 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Acceptance of Terms</h2>
          <p>
            By accessing the Stride District platform or placing an order, you agree to be bound by these Terms of Service and all applicable trade regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Product Authenticity & Limited Drops</h2>
          <p>
            All products listed on Stride District are 100% verified authentic deadstock, inspected via our multi-point laboratory process. We reserve the right to limit order quantities per household during high-demand shock drops.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Pricing & Currency Conversion</h2>
          <p>
            Prices are displayed in selected currencies (USD, EUR, GBP, CAD, AUD) using real-time market exchange rates. Taxes and duties are calculated transparently at checkout.
          </p>
        </section>
      </div>
    </div>
  );
}
