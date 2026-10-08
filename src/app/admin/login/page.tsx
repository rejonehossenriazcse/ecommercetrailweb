'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      // Store token
      localStorage.setItem('stride_admin_token', data.token);
      localStorage.setItem('aura_admin_token', data.token);
      document.cookie = `stride_auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `aura_auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-orange-500/10 via-amber-400/5 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#13161c] border border-zinc-200 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand identity */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-black font-black text-3xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 italic transform -rotate-3">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-lg tracking-wider text-zinc-900 font-bold">
              STRIDE<span className="text-orange-500 ml-1">DISTRICT</span>
              <span className="text-zinc-800 font-semibold font-medium font-light text-xs ml-1">CMS</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-orange-400/10 text-orange-600 font-bold border border-orange-400/20 px-2 py-0.5 rounded-full font-bold">
              v1.0
            </span>
          </div>
          <p className="text-xs text-zinc-800 font-semibold mt-2 font-mono">
            Streetwear Drop Control & Architecture Center
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <span>Authentication verified. Redirecting to Executive Overview...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1.5 uppercase tracking-wider">
              Root Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-800 font-semibold mb-1.5 uppercase tracking-wider">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized</span>
                </>
              ) : (
                <>
                  <span>Sign In to Executive Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security badges */}
        <div className="mt-8 pt-6 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-800 font-semibold font-medium font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit JWT Session</span>
          </div>
          <Link
            href="/"
            className="text-zinc-800 font-semibold hover:text-zinc-900 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
