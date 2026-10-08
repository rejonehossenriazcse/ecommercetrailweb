import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-800 font-semibold animate-pulse">
        Synchronizing Atelier Feed...
      </p>
    </div>
  );
}
