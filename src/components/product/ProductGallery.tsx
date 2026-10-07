'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, RotateCw } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  badges: string[];
}

export default function ProductGallery({
  images,
  productName,
  badges,
}: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [is360Active, setIs360Active] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);

  const activeImage = images[activeImageIndex] || images[0];

  const handleRotate = () => {
    setRotationDegree((prev) => (prev + 90) % 360);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-black border border-zinc-800 group shadow-2xl">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out"
          style={is360Active ? { transform: `rotate(${rotationDegree}deg)` } : {}}
        />

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider shadow-md ${
                badge === 'Sale'
                  ? 'bg-rose-500 text-white'
                  : badge === 'New'
                  ? 'bg-lime-400 text-black'
                  : 'bg-orange-500 text-white'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => {
              setIs360Active(!is360Active);
              handleRotate();
            }}
            className="p-2.5 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-md transition-all cursor-pointer"
            title="360° Studio Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-2.5 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-md transition-all cursor-pointer"
            title="Full-Resolution Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {is360Active && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 backdrop-blur text-white text-[11px] font-mono flex items-center gap-1.5 shadow">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
            <span>Interactive 360° View Mode</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImageIndex(idx);
                setIs360Active(false);
              }}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-md'
                  : 'border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg animate-in fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={productName}
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}
