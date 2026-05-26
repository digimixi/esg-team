import React from 'react';

/**
 * @component MarketIndexBar
 * @description Standardized market index bar used on Home, Hubs, and Solutions.
 */
const MarketIndexBar = ({ indices, lastUpdated }) => {
  if (!indices || indices.length === 0) return null;

  return (
    <section className="bg-[var(--color-surface-container)] border-b border-outline-variant overflow-hidden h-10 flex items-center">
      {/* Fixed Title Label on the Left */}
      <div className="flex items-center gap-2 shrink-0 bg-[var(--color-surface-container)] z-10 px-4 shadow-[10px_0_10px_-5px_rgba(0,0,0,0.05)] border-r border-outline-variant/30 h-full">
        <span className="material-symbols-outlined text-secondary text-[16px]">monitoring</span>
        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-bold">市場實時指數</span>
      </div>
      
      {/* Marquee Track */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        {/* We duplicate the array to create a seamless loop */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...indices, ...indices].map((index, idx) => (
            <div key={`${index._id}-${idx}`} className="flex items-center gap-2 px-6 border-r border-outline-variant/30 h-6 shrink-0">
              <span className="font-label-sm text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
                {index.name}
              </span>
              <span className="font-data-mono text-[13px] text-primary font-bold">
                {index.value} 
              </span>
              <span className={`text-[10px] font-bold ${index.trendPercentage?.includes('-') ? 'text-error' : 'text-esg-emerald'}`}>
                {index.trendPercentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketIndexBar;
