'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Compass, Search } from 'lucide-react';
import SocialGallery from '@/components/home/SocialGallery';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            The District Community
          </h1>
          <p className="text-zinc-400 text-sm">
            Join the culture. Share your fits, discover new trends, and connect with other streetwear enthusiasts worldwide. Tag #StrideDistrict to be featured.
          </p>
        </div>

        <SocialGallery />

        <div className="flex items-center justify-center pt-10 border-t border-zinc-900 gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Shop Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
