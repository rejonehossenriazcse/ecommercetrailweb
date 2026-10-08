'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore, DEFAULT_DEMO_CUSTOMER } from '@/context/StoreContext';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  CheckCircle,
  AlertCircle,
  Truck,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { loginCustomer, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickDemoLogin = () => {
    loginCustomer(DEFAULT_DEMO_CUSTOMER);
    addToast('Authenticated as VIP Patron (Marcus Vance)', 'success');
    router.push(redirectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate/Authenticate
      if (email.toLowerCase().includes('marcus') || email === DEFAULT_DEMO_CUSTOMER.email) {
        loginCustomer(DEFAULT_DEMO_CUSTOMER);
        router.push(redirectUrl);
        return;
      }

      // Allow login with any valid formatted email as registered customer
      const patronUser = {
        ...DEFAULT_DEMO_CUSTOMER,
        id: `cust-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email,
        tier: 'Bronze' as const,
        totalOrders: 1,
        totalSpent: 185.00,
        loyaltyPoints: 100,
        storeCredit: 0.00,
        referralCode: `AURA-${email.slice(0, 4).toUpperCase()}-2026`,
      };

      loginCustomer(patronUser);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/50">
      <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-zinc-900/5 relative overflow-hidden">
        {/* Top badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-800 font-semibold font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Patron Concierge</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-center text-zinc-900 tracking-tight mb-2">
          Sign In to AURA
        </h1>
        <p className="text-xs text-center text-zinc-800 font-semibold font-medium mb-8 leading-relaxed">
          Access your collector tier benefits, saved shipping destinations, and real-time parcel dispatch tracking.
        </p>

        {/* 1-Click Quick Demo Login */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-950 font-mono">1-Click Evaluation Access</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
              Platinum VIP
            </span>
          </div>
          <p className="text-[11px] text-amber-800 leading-snug">
            Instantly authenticate as Marcus Vance with pre-configured orders, addresses, and $150 store credit.
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full mt-2 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Authenticate as Demo VIP Patron
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-mono text-zinc-800 font-semibold uppercase">
            Or sign in with email
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 font-bold mb-1.5 uppercase font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-800 font-semibold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@aurastudios.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-200 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-800 font-bold uppercase font-mono">
                Password
              </label>
              <button
                type="button"
                onClick={() => addToast('Password reset link dispatched to registered email', 'info')}
                className="text-[11px] text-zinc-800 font-semibold font-medium hover:text-zinc-900 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-800 font-semibold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-200 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-50 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col gap-3 text-center text-xs text-zinc-800 font-semibold font-medium">
          <div>
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-bold text-zinc-900 hover:underline">
              Create Patron Membership
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-zinc-800 font-semibold pt-2">
            <Link href="/track" className="hover:text-zinc-900 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-zinc-800 font-semibold font-medium" />
              <span>Lookup Guest Order</span>
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-amber-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs font-mono text-zinc-800 font-semibold">Loading Concierge...</div>}>
      <LoginForm />
    </Suspense>
  );
}
