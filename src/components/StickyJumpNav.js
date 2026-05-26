'use client';

import React from 'react';

export default function StickyJumpNav({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="sticky top-[104px] lg:top-16 mt-[104px] lg:mt-16 z-[900] w-full bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm transition-all duration-300">
      <div className="max-w-container-max mx-auto px-4 sm:px-margin">
        <nav className="flex overflow-x-auto no-scrollbar items-center gap-6 h-12">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest shrink-0 opacity-70">
            本頁導覽
          </span>
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={`text-xs whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 relative group ${
                link.isPrimary 
                  ? 'text-esg-emerald font-extrabold tracking-wide' 
                  : 'text-primary font-bold hover:text-esg-emerald'
              }`}
            >
              {link.label}
              <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0">
                arrow_drop_down
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
