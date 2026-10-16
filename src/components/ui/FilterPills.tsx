interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  active: T;
  onChange: (value: T) => void;
  /** `white` for pills on a surface-coloured section, `surface` for pills on a white section. */
  variant?: 'white' | 'surface';
}

const inactiveStyles = {
  white: 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200',
  surface: 'bg-brand-surface text-slate-700 hover:bg-slate-200/70 border border-slate-200',
};

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
  variant = 'surface'
}: FilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={active === option.value}
          className={`px-4 py-2 text-xs font-semibold rounded-brand transition-all duration-200 ${
            active === option.value
              ? 'bg-brand-navy text-white shadow-sm'
              : inactiveStyles[variant]
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
