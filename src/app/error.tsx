'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, ShieldCheck } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Handled application exception:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 shadow-sm">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Resilient Session Recovery
          </span>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            An Exception Occurred
          </h1>
          <p className="text-xs text-zinc-800 font-semibold font-medium leading-relaxed">
            Our atelier engineers have captured the telemetry for this event. Your active bag items and account credentials remain intact.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Operation</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider transition-colors border border-zinc-200"
          >
            <Home className="w-4 h-4" />
            <span>Return to Flagship</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-800 font-semibold font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Automatic Circuit Breaker & Fault Isolation Active</span>
        </div>
      </div>
    </div>
  );
}
