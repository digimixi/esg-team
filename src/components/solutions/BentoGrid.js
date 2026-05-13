import React from 'react';

/**
 * @component BentoCard
 * @description Flexible card for bento grid layouts.
 */
export const BentoCard = ({ 
  title, 
  subtitle, 
  value, 
  unit, 
  icon, 
  description, 
  children, 
  className = "",
  variant = "default" // default, primary, highlight
}) => {
  const variantStyles = {
    default: "bg-surface-container-lowest",
    primary: "bg-primary-container text-on-primary-container",
    highlight: "bg-tertiary-container text-on-tertiary-container"
  };

  return (
    <div className={`border border-outline-variant p-stack-md flex flex-col ${variantStyles[variant]} ${className}`}>
      <div className="flex justify-between items-start mb-stack-sm">
        <div>
          <h3 className="text-headline-sm font-headline-sm flex items-center gap-2">
            {title}
            {subtitle && <span className="text-body-small font-normal opacity-70">{subtitle}</span>}
          </h3>
          {description && <p className="text-label-sm font-label-sm opacity-80 mt-1">{description}</p>}
        </div>
        {icon && (
          <span className="material-symbols-outlined p-2 rounded bg-surface-container-high">
            {icon}
          </span>
        )}
      </div>
      
      {value && (
        <div className="mt-auto">
          <div className="text-display-sm font-display-sm">
            {value} <span className="text-headline-sm font-light">{unit}</span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

/**
 * @component BentoGrid
 * @description Grid container for bento cards.
 */
export const BentoGrid = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-gutter ${className}`}>
      {children}
    </div>
  );
};
