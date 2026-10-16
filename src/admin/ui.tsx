import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

/** Accessible on/off switch. */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, id }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
      checked ? 'bg-brand-ocean' : 'bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-0.5'
      }`}
    />
  </button>
);

export type BadgeTone = 'green' | 'amber' | 'slate' | 'gold' | 'blue' | 'red';

const badgeTones: Record<BadgeTone, string> = {
  green: 'bg-green-50 text-green-800 border-green-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  gold: 'bg-brand-gold-light text-brand-gold-dark border-brand-gold/40',
  blue: 'bg-brand-ocean-light text-brand-ocean border-brand-ocean/20',
  red: 'bg-red-50 text-red-700 border-red-200',
};

export const Badge: React.FC<{ tone?: BadgeTone; children: React.ReactNode }> = ({ tone = 'slate', children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badgeTones[tone]}`}>
    {children}
  </span>
);

export const Card: React.FC<{ title?: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }> = ({
  title,
  description,
  children,
  actions,
}) => (
  <section className="bg-white rounded-brand-lg border border-slate-200 shadow-subtle">
    {(title || actions) && (
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 sm:px-6 pt-5">
        <div>
          {title && <h2 className="text-base font-bold text-brand-navy">{title}</h2>}
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
        {actions}
      </header>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);
