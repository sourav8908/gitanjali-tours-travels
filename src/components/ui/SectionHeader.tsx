import React from 'react';
import { KonarkWheel } from './KonarkWheel';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Rendered to the right of the heading on wide screens (e.g. filter pills). */
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
  className = 'mb-10'
}) => {
  const heading = (
    <div>
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-sandstone mb-3">
        <KonarkWheel className="w-4 h-4 text-brand-gold" strokeWidth={5} />
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-navy">
        {title}
      </h2>
      {description && (
        <p className={`text-base text-slate-600 mt-3 leading-relaxed ${action ? 'max-w-xl' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );

  if (!action) {
    return <div className={`max-w-3xl ${className}`}>{heading}</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 ${className}`}>
      {heading}
      {action}
    </div>
  );
};
