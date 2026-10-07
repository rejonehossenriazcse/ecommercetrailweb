'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export default function CookieConsent() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('stride_cookie_consent') || localStorage.getItem('aura_cookie_consent');
    if (!saved) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: { essential: boolean; analytics: boolean; marketing: boolean }) => {
    const payload: CookiePreferences = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('stride_cookie_consent', JSON.stringify(payload));
    localStorage.setItem('aura_cookie_consent', JSON.stringify(payload));
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (pathname === '/admin' || pathname?.startsWith('/admin/')) return null;
  if (!isVisible) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="p-5 sm:p-6 rounded-3xl bg-zinc-950/95 text-white border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20 shrink-0">
                <Cookie className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  Patron Privacy & Telemetry
                </h4>
                <div className="text-[10px] text-zinc-400 font-mono">GDPR & CCPA Compliant</div>
              </div>
            </div>

            <button
              onClick={handleRejectNonEssential}
              className="text-zinc-500 hover:text-white p-1 rounded-lg"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            We use strictly essential cryptographic tokens for bag and vault security, and optional privacy-preserving telemetry to refine our spatial acoustics and horology dispatches.{' '}
            <Link href="/privacy" className="text-amber-400 hover:underline">
              Review Privacy Charter
            </Link>.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer border border-zinc-800"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800 flex items-center justify-center"
              title="Configure Preferences"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14181f] text-white rounded-3xl p-6 sm:p-7 border border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Cookie & Telemetry Preferences
                </h3>
              </div>
              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Essential */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Strictly Essential & Security</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Cart session, CSRF tokens, checkout encryption.
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px] uppercase font-bold">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Analytics & Performance</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Anonymous Core Web Vitals and navigation flows.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-400 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Marketing */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Marketing & Pixel Attribution</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Meta Pixel and Conversions API deduplication.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-400 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
