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
    { title: '解決方案', sub: 'Solutions', href: '/solutions', active: true },
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

            {/* Hamburger Menu Button - Integrated into Layout Flow */}
            <label 
              htmlFor="menu-check"
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center z-[10000] text-primary bg-white/90 backdrop-blur-md border border-outline-variant/50 rounded-full shadow-sm cursor-pointer active:scale-95 transition-all group"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between pointer-events-none">
                <span className="w-5 h-[2px] bg-current rounded-full transition-all duration-300"></span>
                <span className="w-5 h-[2px] bg-current rounded-full transition-all duration-300"></span>
                <span className="w-5 h-[2px] bg-current rounded-full transition-all duration-300"></span>
              </div>
            </label>
          </div>
        </div>

        {/* CSS-Only Menu Toggle Controller */}
        <input type="checkbox" id="menu-check" className="hidden peer" />
        
        {/* Backdrop for closing by clicking outside */}
        <label 
          htmlFor="menu-check" 
          className="hidden peer-checked:block fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[1px] transition-all"
        ></label>

        {/* CSS Trick for Icon Animation - Updated Selectors */}
        <style jsx>{`
          #menu-check:checked ~ div label div span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
          #menu-check:checked ~ div label div span:nth-child(2) { opacity: 0; }
          #menu-check:checked ~ div label div span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        `}</style>

        {/* CSS-Only Dropdown Menu - State of the Art Design */}
        <div className="hidden peer-checked:flex fixed top-[72px] right-4 left-4 z-[9999] bg-surface flex-col rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right backdrop-blur-xl bg-white/98">
          <div className="flex flex-col p-5 gap-1">
            <div className="px-4 py-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-secondary opacity-50 font-sans">Explorer</span>
              <div className="h-1 w-12 bg-outline-variant/30 rounded-full"></div>
            </div>
            
            {navLinks.map((link, idx) => (
              <Link 
                key={idx}
                href={link.href}
                className="flex items-center justify-between p-4 hover:bg-surface-container-low active:bg-surface-container rounded-2xl transition-all group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-body-lg font-bold text-primary tracking-tight">{link.title}</span>
                  <span className="text-[10px] text-secondary/60 uppercase tracking-widest font-medium">{link.sub}</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high group-active:bg-primary group-active:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </Link>
            ))}
            
            <div className="mt-6 p-2 space-y-4">
              <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg active:scale-[0.97] transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                即刻諮詢專家 Contact
              </button>
              
              <div className="flex justify-center gap-6 py-2 opacity-40">
                <span className="text-[10px] font-medium text-secondary">Privacy Policy</span>
                <span className="text-[10px] font-medium text-secondary">ESG Matrix © 2024</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
