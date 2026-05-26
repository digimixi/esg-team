'use client';

import React from 'react';
import Link from 'next/link';

export default function HubHeader({ hubSlug, title, contactUrl, activeTab }) {
  const tabs = [
    { id: 'home', label: '首頁 Home', href: `/hubs/${hubSlug}` },
    { id: 'products', label: '產品 Products', href: `/hubs/${hubSlug}/products` },
    { id: 'market', label: '市場 Market', href: `/hubs/${hubSlug}/market` },
    { id: 'supply-chain', label: '供應鏈 Supply Chain', href: `/hubs/${hubSlug}/supply-chain` },
  ];

  return (
    <header className="fixed top-0 w-full z-[999] bg-surface/95 backdrop-blur-lg border-b border-outline-variant shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto w-full relative z-[1000]">
        <div className="flex items-center gap-2 md:gap-stack-lg min-w-0">
          <Link href="/" className="text-headline-sm font-bold text-primary flex items-center gap-1 shrink-0">
            esg<span className="text-esg-emerald">.</span>team
          </Link>
          <span className="text-outline-variant shrink-0">|</span>
          <Link href={`/hubs/${hubSlug}`} className="text-[12px] md:text-body-base font-bold text-secondary hover:text-primary transition-colors truncate flex-1 min-w-[150px]">
            {title}
          </Link>
          <nav className="hidden lg:flex gap-4 xl:gap-gutter ml-2 xl:ml-stack-lg">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`font-body-base whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={contactUrl || '#'}
            className="px-3 py-1.5 bg-primary text-on-primary font-label-sm text-[11px] rounded-lg shrink-0 hover:bg-primary/90 active:scale-95 transition-all duration-150 whitespace-nowrap"
          >
            聯絡銷售
          </a>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-outline-variant bg-surface overflow-hidden">
        <nav className="flex overflow-x-auto no-scrollbar px-4 h-10 items-center gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`h-full flex items-center whitespace-nowrap shrink-0 text-label-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-secondary'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
