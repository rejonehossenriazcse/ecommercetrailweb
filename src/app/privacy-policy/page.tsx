import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-xs text-zinc-800 font-semibold leading-relaxed">
      <div>
        <span className="font-mono text-orange-600 font-bold uppercase tracking-widest text-[11px]">Compliance & Governance</span>
        <h1 className="text-3xl font-black text-zinc-900 font-bold tracking-tight mt-1">Privacy & Data Governance Policy</h1>
        <p className="text-zinc-800 font-semibold font-medium mt-1">Last Updated: October 4, 2026 • Valid for GDPR, CCPA, and UK Data Protection</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 font-bold uppercase tracking-wider">1. Privacy Commitment</h2>
          <p>
            At Stride District, your privacy is paramount. We do not sell personal data, monetize behavioral telemetries, or track users outside of authorized store functions. All communications are encrypted end-to-end via TLS 1.3 protocol.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 font-bold uppercase tracking-wider">2. Information Collection & Usage</h2>
          <p>We process information strictly required to facilitate checkout and international fulfillment:</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-800 font-bold pl-2">
            <li><strong>Identity:</strong> Name, billing and shipping address, email, telephone number.</li>
            <li><strong>Transactional:</strong> Tokenized payment confirmations (we never retain raw credit card credentials).</li>
            <li><strong>Technical Telemetry:</strong> Anonymized session metrics, Core Web Vital diagnostic latencies, and device viewports.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 font-bold uppercase tracking-wider">3. GDPR & CCPA Compliance Rights</h2>
          <p>
            As a global customer, you retain the complete right to request data inspection, data rectification, portability, and permanent cryptographic erasure. To exercise your rights, visit your Account Settings or email concierge@stridedistrict.com.
          </p>
        </section>
      </div>
    </div>
  );
}
