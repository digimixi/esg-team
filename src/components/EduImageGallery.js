'use client';

import React, { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';

export default function EduImageGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[16/9] bg-[#e6e8ea] rounded-xl flex items-center justify-center text-[#76777d] border border-[#c6c6cd]">
        No Gallery Images
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[16/9] bg-[#e6e8ea] rounded-xl overflow-hidden border border-[#c6c6cd] shadow-inner group">
        <img 
          src={urlFor(images[activeIndex]).width(1600).url()} 
          alt={`${title} - Image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Slide {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === idx 
                  ? 'border-primary ring-2 ring-primary/20 scale-95' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={urlFor(img).width(200).url()} 
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
