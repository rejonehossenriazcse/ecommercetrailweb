'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { CustomerUser } from '@/types';
import {
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Gift,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { loginCustomer, addToast } = useStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Please agree to the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newUser: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        phone: phone.trim() || '+1 (555) 000-0000',
        tier: 'Bronze',
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 100, // 100 Welcome points!
        storeCredit: 0.00,
        referralCode: `STRIDE-${firstName.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      loginCustomer(newUser);
      addToast('Welcome to Stride District! 100 Loyalty Points credited to your account.', 'success');
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Failed to create membership account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/50">
      <div className="w-full max-w-lg bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-zinc-900/5 relative overflow-hidden">
        {/* Welcome Incentive Ribbon */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 mb-6">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-950 font-mono">100 Welcome Points Award</div>
              <div className="text-[11px] text-amber-800">Immediately unlock Bronze tier perks and voucher rewards</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
            Complimentary
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-center text-zinc-900 tracking-tight mb-2">
          Create Patron Account
        </h1>
        <p className="text-xs text-center text-zinc-500 mb-8 leading-relaxed">
          Join our global community of collectors and enjoy priority access to limited edition horology, acoustics, and optics.
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase font-mono">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Elena"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase font-mono">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rostova"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena.rostova@studio.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase font-mono">
              Telephone (For Dispatch Updates)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (415) 555-0192"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase font-mono">
              Create Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 mt-0.5"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms-of-service" target="_blank" className="font-semibold text-zinc-900 underline">
                  Terms of Service
                </Link>{' '}
                and acknowledge the{' '}
                <Link href="/privacy-policy" target="_blank" className="font-semibold text-zinc-900 underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-4"
          >
            <span>Complete Registration & Claim 100 Pts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-100 text-center text-xs text-zinc-500">
          Already registered as a Stride District member?{' '}
          <Link href="/login" className="font-bold text-zinc-900 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
