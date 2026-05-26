'use client';

import React, { useState, useEffect } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 終極防彈版捲動偵測：同時檢查所有可能的捲動參數
    const checkScroll = () => {
      if (typeof window !== 'undefined') {
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        // 取得 body 或 html 的物理座標作為備案
        const rectTop = document.documentElement.getBoundingClientRect().top;
        
        // 只要任何一個指標顯示往下滑動超過 50px，就顯示按鈕
        setIsVisible(scrollY > 50 || rectTop < -50);
      }
    };

    // 1. 標準事件綁定
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('touchmove', checkScroll, { passive: true });

    // 2. 備用方案：強制物理座標檢查器 (每 300ms 檢查一次)
    // 這是唯一能 100% 繞過所有 Android/iOS 捲動引擎 Bug 的最終手段
    const fallbackTimer = setInterval(checkScroll, 300);

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('touchmove', checkScroll);
      clearInterval(fallbackTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      
      {/* Back To Top Button (Always Visible 測試) */}
      <button
        onClick={scrollToTop}
        className="pointer-events-auto shrink-0 w-12 h-12 bg-surface-container-highest/95 backdrop-blur border border-outline-variant rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center justify-center text-primary hover:bg-surface-container-high hover:text-esg-emerald transition-all duration-300 active:scale-90 group"
        aria-label="回到頂端"
      >
        <span className="material-symbols-outlined text-[20px] sm:text-xl group-hover:-translate-y-1 transition-transform">arrow_upward</span>
      </button>

      {/* Contact Sales Button (Always Visible) - 現在固定在最底部 */}
      <a 
        href="mailto:contact@esg.team" 
        className="pointer-events-auto bg-primary text-on-primary px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.2)] flex items-center gap-2 hover:scale-105 hover:bg-primary/90 transition-all active:scale-95 group border border-white/10"
        aria-label="聯絡銷售"
      >
        <span className="material-symbols-outlined text-[18px] sm:text-[20px] animate-pulse group-hover:animate-none">support_agent</span>
        <span className="font-label-sm text-[12px] sm:text-[13px] font-bold tracking-wider">聯絡銷售</span>
      </a>

    </div>
  );
}
