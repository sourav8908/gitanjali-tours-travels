import React from 'react';
import { KonarkWheel } from '../components/ui/KonarkWheel';
import { eyebrowClass } from './styles';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  size?: 'sm' | 'md';
}

/** Accessible on/off switch (navy when on). */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, id, size = 'md' }) => {
  const track = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const shift = size === 'sm' ? 'translate-x-[18px]' : 'translate-x-[22px]';
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex ${track} shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
        checked ? 'bg-brand-navy' : 'bg-slate-300'
      }`}
    >
      <span className={`inline-block ${knob} rounded-full bg-white shadow transition-transform ${checked ? shift : 'translate-x-0.5'}`} />
    </button>
  );
};

export type BadgeTone = 'gold' | 'green' | 'amber' | 'neutral' | 'red' | 'navy';

const badgeTones: Record<BadgeTone, string> = {
  gold: 'bg-brand-gold-light text-brand-gold-dark border-brand-gold/40',
  green: 'bg-green-50 text-green-800 border-green-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  neutral: 'bg-white text-slate-600 border-brand-line',
  red: 'bg-red-50 text-red-700 border-red-200',
  navy: 'bg-brand-navy text-brand-gold border-brand-navy',
};

export const Badge: React.FC<{ tone?: BadgeTone; children: React.ReactNode; dot?: boolean }> = ({ tone = 'neutral', children, dot }) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap ${badgeTones[tone]}`}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export const Card: React.FC<{ title?: string; description?: string; children: React.ReactNode; actions?: React.ReactNode; className?: string }> = ({
  title,
  description,
  children,
  actions,
  className = '',
}) => (
  <section className={`bg-white rounded-brand-lg border border-brand-line shadow-subtle ${className}`}>
    {(title || actions) && (
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 sm:px-6 pt-5">
        <div>
          {title && <h2 className="font-display text-lg font-bold text-brand-navy">{title}</h2>}
          {description && <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">{description}</p>}
        </div>
        {actions}
      </header>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

/** Page title block with the website's Konark-wheel eyebrow. */
export const PageHeader: React.FC<{ eyebrow: string; title: string; description: string; aside?: React.ReactNode }> = ({
  eyebrow,
  title,
  description,
  aside,
}) => (
  <header className="flex flex-wrap items-end justify-between gap-4 mb-7">
    <div>
      <span className={eyebrowClass}>
        <KonarkWheel className="w-3.5 h-3.5 text-brand-gold" strokeWidth={5} />
        {eyebrow}
      </span>
      <h1 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-brand-navy">{title}</h1>
      <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">{description}</p>
    </div>
    {aside}
  </header>
);
