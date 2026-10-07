'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bespoke Horology Commission');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          orderNumber,
          message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setFeedback(json.message);
      }
    } catch (err) {
      console.error('Contact error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Title */}
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
          <Compass className="w-3.5 h-3.5" />
          <span>Private Client Services</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight font-serif">
          Atelier Concierge & Advisory
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-serif italic">
          Direct dialogue with our master watchmakers, acoustic engineers, and logistics directors across Zurich and Copenhagen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 font-serif">
                Inquiry Transmitted to Private Concierge
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                {feedback}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-2">
                <h3 className="text-sm font-bold text-zinc-900 uppercase font-mono tracking-wider">
                  Confidential Inquiry Form
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-bit Encrypted</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus.vance@collector.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Telephone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0192"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Consignment / Order # (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. AUR-2026-9042"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Inquiry Nature
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                >
                  <option value="Bespoke Horology Commission">Bespoke Horology Commission</option>
                  <option value="Showroom Private Appointment">Zurich / Copenhagen Showroom Viewing</option>
                  <option value="Consignment & Transit Tracking">Consignment & Insured Courier Tracking</option>
                  <option value="Corporate / Institutional Orders">Corporate & Architectural Acquisitions</option>
                  <option value="Press & Curatorial Relations">Press, Media & Curatorial Relations</option>
                  <option value="Other">Other Confidential Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your requirements, desired timeframes, or specific designs..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Inquiry to Concierge</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Global Showrooms & Vault Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900 text-white border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Building className="w-4 h-4" />
              <span>Zurich Vault & Cleanrooms</span>
            </div>
            <div className="text-xs text-zinc-300 space-y-2 font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span>Bahnhofstrasse 48, 8001 Zürich, Switzerland</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>Monday – Friday: 09:00 – 18:30 CET</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>+41 44 211 88 00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>concierge.zurich@aurastudios.com</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Copenhagen Design Studio</span>
            </div>
            <div className="text-xs text-zinc-600 space-y-2 font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Bredgade 24, 1260 København K, Denmark</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Tuesday – Saturday: 10:00 – 18:00 CET</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>+45 33 12 40 80</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>studio.cph@aurastudios.com</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 space-y-1">
            <div className="font-bold">VIP Private Showroom Access</div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Collectors holding Gold or Platinum patron tiers enjoy complimentary private viewing appointments, chauffeured transfers, and champagne tastings upon request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
