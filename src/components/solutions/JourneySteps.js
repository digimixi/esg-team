import React from 'react';

/**
 * @component JourneySteps
 * @description Sequential steps or roadmap component.
 */
const JourneySteps = ({ steps, title, subtitle }) => {
  return (
    <section className="py-stack-lg border-t border-outline-variant">
      <div className="mb-stack-md">
        <h2 className="text-headline-lg font-headline-lg text-primary">{title}</h2>
        {subtitle && <p className="text-body-base text-on-surface-variant">{subtitle}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mt-stack-lg">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Connection Line (Desktop) */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-1/2 w-full h-[1px] bg-outline-variant group-hover:bg-primary transition-colors"></div>
            )}
            
            <div className="relative z-10 space-y-stack-sm">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-headline-sm font-headline-sm text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                {idx + 1}
              </div>
              <h3 className="text-headline-sm font-headline-sm pt-2">{step.title}</h3>
              <p className="text-body-base text-on-surface-variant leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JourneySteps;
