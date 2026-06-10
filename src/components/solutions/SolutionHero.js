import React from 'react';

/**
 * @component SolutionHero
 * @description Standardized hero section for all ESG solution and hub pages.
 * @param {string} title - Main Chinese title
 * @param {string} subtitle - English subtitle
 * @param {string} description - Detailed description text
 * @param {string} badgeText - Category or status badge text
 * @param {string} badgeIcon - Material icon name for the badge
 * @param {string} imageUrl - Background image URL
 * @param {object} cta - CTA button configuration { label, href }
 * @param {boolean} isFullWidth - If true, uses a centered layout with background image
 */
const SolutionHero = ({ 
  title, 
  subtitle, 
  description, 
  badgeText, 
  badgeIcon = 'verified', 
  imageUrl, 
  cta,
  features = [],
  jumpLinks = [],
  isFullWidth = false
}) => {
  if (isFullWidth) {
    return (
      <section className="relative min-h-[180px] md:h-[500px] py-6 md:py-0 flex items-center overflow-hidden border-b border-outline-variant bg-surface-container-high">
        <div className="absolute inset-0 z-0">
          {imageUrl ? (
            <img src={imageUrl} className="w-full h-full object-cover opacity-60" alt={title} />
          ) : (
            <div className="w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/80 to-surface"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-margin w-full flex flex-col items-center text-center">
          {badgeText && (
            <div className="mb-4 inline-flex items-center border border-outline-variant bg-surface-container-lowest px-3 py-1 rounded">
              <span className="material-symbols-outlined text-[18px] text-secondary mr-2">{badgeIcon}</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{badgeText}</span>
            </div>
          )}
          <h1 className="font-display-lg font-extrabold text-headline-lg sm:text-headline-md md:text-display-lg text-primary mb-4 md:mb-stack-md leading-tight tracking-tight">
            <span className="block">{title}</span>
            <span className="text-body-base sm:text-headline-md block text-secondary mt-1 md:mt-2 font-normal hidden sm:block">{subtitle}</span>
          </h1>
          
          {/* [2. 功能摘要徽章 Cognitive Badges] */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {features.map((feature, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/50 rounded-lg text-[11px] font-bold text-secondary uppercase tracking-widest shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-esg-emerald">check_circle</span>
                  {feature}
                </span>
              ))}
            </div>
          )}

          <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto mb-6 md:mb-stack-lg hidden md:block">
            {description}
          </p>

          <div className="flex flex-col items-center gap-4 md:gap-6">
            {cta && (
              <a href={cta.href} className="bg-primary text-on-primary px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-bold text-xs md:text-label-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] active:scale-95">
                {cta.label} <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            )}
            
            {/* [1. 頁內快顯導航 Action Jump Links] */}
            {jumpLinks && jumpLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {jumpLinks.map((link, idx) => (
                  <a key={idx} href={link.href} className="text-[11px] font-bold text-primary bg-surface-container-lowest border border-outline-variant/60 px-4 py-1.5 rounded-full hover:bg-surface-container hover:border-outline-variant transition-all shadow-sm flex items-center gap-1 active:scale-95">
                    <span className="material-symbols-outlined text-[14px] text-secondary opacity-70">south</span>
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-stack-lg border border-outline-variant bg-surface-container-lowest p-4 sm:p-stack-lg flex flex-col md:flex-row gap-gutter items-center overflow-hidden">
      <div className="flex-1 space-y-stack-md z-10 w-full">
        {badgeText && (
          <div className="inline-flex items-center space-x-2 bg-secondary-container text-on-secondary-fixed px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[18px]">{badgeIcon}</span>
            <span className="text-label-sm font-label-sm">{badgeText}</span>
          </div>
        )}
        
        <h1 className="text-headline-md sm:text-display-lg font-display-lg text-primary tracking-tight leading-tight">
          {title} <span className="text-secondary font-light block sm:inline text-body-base sm:text-display-lg">{subtitle}</span>
        </h1>
        
        <p className="text-body-base font-body-base text-on-surface-variant max-w-2xl leading-relaxed">
          {description}
        </p>
        
        {cta && (
          <div className="flex space-x-stack-md pt-stack-sm">
            <a href={cta.href} className="w-full sm:w-auto justify-center px-stack-lg py-3 bg-primary text-on-primary text-label-sm font-label-sm flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm active:scale-95">
              {cta.label} <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        )}
      </div>
      
      <div className="flex-1 w-full h-[240px] sm:h-[320px] md:h-[400px] bg-surface-container-high rounded-lg overflow-hidden relative border border-outline-variant shadow-inner">
        {imageUrl ? (
          <img 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            src={imageUrl} 
            alt={title} 
          />
        ) : (
          <div className="w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default SolutionHero;
