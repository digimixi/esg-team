'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { title: '全域入口', sub: 'Global Portal', href: '/' },
    { title: '資源目錄', sub: 'Catalog', href: '/catalog' },
    { title: '解決方案', sub: 'Solutions', href: '/solutions' },
    { title: '工具中心', sub: 'SaaS Tools', href: '/tools' },
    { title: '碳資產管理', sub: 'Carbon Assets', href: '/hubs/graphite' },
    { title: '永續洞察', sub: 'Insights', href: '#' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-[999] bg-surface/95 backdrop-blur-lg border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto w-full relative z-[1000]">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="text-headline-sm sm:text-headline-md font-bold text-primary flex items-center gap-0.5 group">
              esg<span className="text-esg-emerald">.</span>team
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-stack-md ml-4 xl:ml-stack-lg">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx}
                  className={`flex flex-col transition-colors group whitespace-nowrap ${
                    link.active ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'
                  }`}
                  href={link.href}
                >
                  <span className="font-body-base text-body-base">{link.title}</span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-70">{link.sub}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-stack-md shrink-0">
            <button className="hidden sm:block cursor-pointer active:scale-95 duration-150 text-secondary font-label-sm text-label-sm px-4 py-2 whitespace-nowrap">
              聯繫團隊 <span className="text-[10px] ml-1 opacity-70 italic">Contact</span>
            </button>
            
            {/* Login Button - Hidden on mobile, shown on sm+ to prevent overlap */}
            <button className="hidden sm:flex cursor-pointer active:scale-95 duration-150 bg-primary text-on-primary p-2 sm:px-4 sm:py-2 font-label-sm text-label-sm rounded items-center gap-1 min-w-[40px] justify-center">
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span className="hidden sm:inline">企業登錄</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation (Scrollable Horizontal Tabs) */}
        <div className="lg:hidden border-t border-outline-variant bg-surface overflow-hidden">
          <nav className="flex overflow-x-auto no-scrollbar px-4 h-10 items-center gap-6">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="h-full flex flex-col justify-center whitespace-nowrap shrink-0 text-secondary hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className="font-body-base text-sm font-bold">{link.title}</span>
                  <span className="text-[9px] uppercase tracking-tighter opacity-60">{link.sub}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
