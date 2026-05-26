"use client";

import React from 'react';

/**
 * @component InsightCard
 * @description A premium, reusable ESG Insight Card styled in Google Stitch high-density visual語彙.
 * Supports automated standards compliance mapping display.
 */
const InsightCard = ({ insight }) => {
  if (!insight) return null;

  const {
    title,
    summary,
    excerpt,
    publishedAt,
    source,
    externalUrl,
    category,
    hubTitle,
    standards,
    sourceRef
  } = insight;

  const formattedDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : '';

  return (
    <div 
      onClick={(e) => {
        // Prevent click if clicking a sub-link or button
        if (e.target.closest('.no-card-click')) return;
        if (externalUrl) window.open(externalUrl, '_blank', 'noopener,noreferrer');
      }}
      className="flex flex-col bg-surface border border-outline-variant rounded-xl p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative cursor-pointer min-h-[220px]"
    >
      {/* Top Metadata Section */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] bg-outline-variant/30 text-secondary px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-outline-variant/20">
          {source || 'INTELLIGENCE'}
        </span>
        <span className="text-[10px] text-outline font-mono">
          {formattedDate}
        </span>
      </div>

      {/* Main content */}
      <h3 className="font-bold text-primary mb-2 line-clamp-2 group-hover:text-esg-emerald transition-colors leading-snug">
        {title}
      </h3>

      {/* 🏷️ ESG Standards Compliance Anchors (Google Stitch HSL Precise Style) */}
      {standards && standards.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {standards.map((std) => (
            <span 
              key={std} 
              className="inline-flex items-center text-[9px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded-md border border-outline-variant/60 bg-surface-container-high/40 text-secondary hover:border-esg-emerald/50 hover:text-primary transition-all duration-300"
              title={`關聯標準: ${std}`}
            >
              <span className="w-1 h-1 rounded-full bg-esg-emerald mr-1 shrink-0 animate-pulse"></span>
              {std}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 mb-6 opacity-80 flex-grow">
        {summary || excerpt || '點擊閱讀由 AI 引擎提取的高度精煉情報分析。'}
      </p>

      {/* Card Footer */}
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant/50">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-esg-emerald font-bold font-mono tracking-wide">
            #{hubTitle || category || '全域情報'}
          </span>
          {sourceRef && sourceRef.title && (
            <a 
              href={sourceRef.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="no-card-click text-[9px] text-outline hover:text-esg-emerald transition-colors font-sans flex items-center gap-0.5 mt-0.5"
              title={`原始書籤來源: ${sourceRef.title}`}
            >
              <span className="material-symbols-outlined text-[10px]">link</span>
              採集來源：<span className="underline decoration-dotted">{sourceRef.title}</span>
            </a>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
          <span className="material-symbols-outlined text-sm">arrow_outward</span>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
