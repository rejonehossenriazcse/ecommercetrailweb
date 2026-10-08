'use client';

import React from 'react';
import { Smartphone, Zap, Bell, WifiOff, Download, QrCode } from 'lucide-react';

export default function AppDownloadBanner() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-zinc-50 text-zinc-900 font-bold p-8 sm:p-12 border border-zinc-200 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-900 font-bold text-xs font-mono font-bold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Progressive Web App Ready</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 font-bold tracking-tight">
            Install Stride District Mobile App & Experience Instant Drops
          </h3>

          <p className="text-xs sm:text-sm text-zinc-800 font-bold leading-relaxed">
            Get instant priority notifications 15 minutes before public flash sale releases, real-time carrier GPS package tracking, biometric one-touch checkout, and offline catalog access.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-800 font-bold">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Drop Alerts</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-800 font-bold">
              <Bell className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Real-Time Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-800 font-bold">
              <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Offline Browsing</span>
            </div>
          </div>
        </div>

        {/* QR Code and Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white border border-zinc-200 shrink-0">
          <div className="w-24 h-24 rounded-xl bg-white p-2 flex flex-col items-center justify-center text-zinc-900 shrink-0 shadow-md">
            <QrCode className="w-20 h-20 text-zinc-900" />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-bold">
              Scan with Smartphone
            </div>
            <p className="text-[11px] text-zinc-800 font-semibold">
              Point your iOS or Android camera to install the PWA instantly to your home screen.
            </p>
            <button
              onClick={() => alert('PWA Manifest is ready. Add to Home Screen from your browser menu!')}
              className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Device</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
