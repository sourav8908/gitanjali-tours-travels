/**
 * Admin design tokens (class names).
 *
 * Colour roles, kept consistent across the admin:
 *  - navy:  structure, text, switches, secondary emphasis
 *  - gold:  the primary action on a screen (Save, Add, Sign in) and active states
 *  - warm neutrals (ivory, brand-line): backgrounds and borders
 *  - green / amber / red: status only (available, unsaved or sample, errors)
 */
export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-navy bg-brand-gold hover:bg-brand-gold-dark hover:text-white rounded-brand shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-brand-line hover:border-brand-gold/60 hover:bg-brand-gold-light rounded-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  dark:
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-light rounded-brand transition-colors disabled:opacity-50',
  danger:
    'inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  icon:
    'p-2 rounded-brand text-slate-500 hover:text-brand-navy hover:bg-brand-gold-light transition-colors disabled:opacity-30 disabled:hover:bg-transparent',
  /** Dashed "add" tile/button */
  add:
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-gold-dark border-2 border-dashed border-brand-gold/50 hover:border-brand-gold hover:bg-brand-gold-light rounded-brand-lg transition-colors',
};

export const inputClass =
  'w-full px-3.5 py-2.5 bg-white border border-brand-line rounded-brand text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/25 transition-colors';

export const labelClass = 'block text-[13px] font-semibold text-brand-navy mb-1.5';

/** Small uppercase eyebrow, matching the website's section headers. */
export const eyebrowClass = 'inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-sandstone';
