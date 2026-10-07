'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [tab, setTab] = useState<'sneakers' | 'apparel'>('sneakers');

  if (!isOpen) return null;

  const sneakerSizes = [
    { us: 'US 8', uk: 'UK 7', eu: 'EU 41', cm: '26.0' },
    { us: 'US 8.5', uk: 'UK 7.5', eu: 'EU 42', cm: '26.5' },
    { us: 'US 9', uk: 'UK 8', eu: 'EU 42.5', cm: '27.0' },
    { us: 'US 9.5', uk: 'UK 8.5', eu: 'EU 43', cm: '27.5' },
    { us: 'US 10', uk: 'UK 9', eu: 'EU 44', cm: '28.0' },
    { us: 'US 10.5', uk: 'UK 9.5', eu: 'EU 44.5', cm: '28.5' },
    { us: 'US 11', uk: 'UK 10', eu: 'EU 45', cm: '29.0' },
    { us: 'US 12', uk: 'UK 11', eu: 'EU 46', cm: '30.0' },
  ];

  const apparelSizes = [
    { size: 'S', chest: '36 - 38 in (91-96 cm)', length: '27.5 in', fit: 'Slightly Relaxed' },
    { size: 'M', chest: '39 - 41 in (99-104 cm)', length: '28.5 in', fit: 'Streetwear Boxy' },
    { size: 'L', chest: '42 - 44 in (107-112 cm)', length: '29.5 in', fit: 'Oversized Drape' },
    { size: 'XL', chest: '45 - 47 in (114-119 cm)', length: '30.5 in', fit: 'Voluminous Boxy' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-black uppercase text-white">District Fit & Sizing Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => setTab('sneakers')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              tab === 'sneakers'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Sneakers & Kicks
          </button>
          <button
            onClick={() => setTab('apparel')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              tab === 'apparel'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Hoodies & Tees
          </button>
        </div>

        {/* Table Content */}
        {tab === 'sneakers' ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-850 overflow-hidden divide-y divide-zinc-850 text-xs font-mono">
              <div className="grid grid-cols-4 p-2.5 bg-zinc-950 font-bold text-orange-400">
                <span>US MEN</span>
                <span>UK</span>
                <span>EU</span>
                <span>CM</span>
              </div>
              {sneakerSizes.map((row) => (
                <div key={row.us} className="grid grid-cols-4 p-2.5 hover:bg-zinc-850/50 text-zinc-300">
                  <span className="font-bold text-white">{row.us}</span>
                  <span>{row.uk}</span>
                  <span>{row.eu}</span>
                  <span>{row.cm}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              <strong>Tip:</strong> Air Jordan 1 and Dunks fit True To Size (TTS). Yeezy slides recommend going 1 full size up.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-850 overflow-hidden divide-y divide-zinc-850 text-xs font-mono">
              <div className="grid grid-cols-4 p-2.5 bg-zinc-950 font-bold text-orange-400">
                <span>SIZE</span>
                <span>CHEST</span>
                <span>LENGTH</span>
                <span>FIT</span>
              </div>
              {apparelSizes.map((row) => (
                <div key={row.size} className="grid grid-cols-4 p-2.5 hover:bg-zinc-850/50 text-zinc-300">
                  <span className="font-bold text-white">{row.size}</span>
                  <span>{row.chest}</span>
                  <span>{row.length}</span>
                  <span className="text-orange-400">{row.fit}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              <strong>Tip:</strong> Stussy and Essentials cut hoodies with dropped shoulders for an oversized streetwear drape.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
