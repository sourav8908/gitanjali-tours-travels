import React from 'react';
import { Plus, X } from 'lucide-react';
import { ImageField } from './ImageField';
import { Toggle } from './ui';
import { inputClass, labelClass } from './styles';
import { getPath, setPath, type FieldDef, type Option } from './paths';

const optionValue = (o: Option) => (typeof o === 'string' ? o : o.value);
const optionLabel = (o: Option) => (typeof o === 'string' ? o : o.label);

const fieldId = (key: string) => `f-${key.replace(/\W+/g, '-') || 'root'}`;

interface FieldInputProps {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  root: unknown;
  error?: string;
}

const Help: React.FC<{ error?: string; hint?: string }> = ({ error, hint }) =>
  error ? (
    <p className="text-xs font-medium text-red-600 mt-1.5" role="alert">{error}</p>
  ) : hint ? (
    <p className="text-xs text-slate-500 mt-1.5">{hint}</p>
  ) : null;

export const FieldInput: React.FC<FieldInputProps> = ({ field, value, onChange, root, error }) => {
  const id = fieldId(field.key);
  const setText = (v: string) => onChange(field.optional && v === '' ? undefined : v);
  const errorRing = error ? ' border-red-400 focus:border-red-500 focus:ring-red-200' : '';

  if (field.type === 'heading') {
    return (
      <div className="sm:col-span-2 pt-3 first:pt-0">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-sandstone pb-2 border-b border-brand-line">{field.label}</p>
        {field.hint && <p className="text-xs text-slate-500 mt-2">{field.hint}</p>}
      </div>
    );
  }

  // On/off settings read best as a row: label and hint on the left, switch on the right
  if (field.type === 'boolean') {
    return (
      <div className={`flex items-center justify-between gap-4 p-3.5 rounded-brand border border-brand-line bg-brand-ivory/60 ${field.wide ? 'sm:col-span-2' : ''}`}>
        <label htmlFor={id} className="min-w-0 cursor-pointer">
          <span className="block text-sm font-semibold text-brand-navy">{field.label}</span>
          {field.hint && <span className="block text-xs text-slate-500 mt-0.5">{field.hint}</span>}
        </label>
        <Toggle id={id} checked={Boolean(value)} onChange={onChange} label={field.label} />
      </div>
    );
  }

  let control: React.ReactNode;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea id={id} rows={3} value={(value as string) ?? ''} placeholder={field.placeholder}
          onChange={(e) => setText(e.target.value)} className={inputClass + errorRing} />
      );
      break;
    case 'number':
      control = (
        <input id={id} type="number" inputMode="decimal" min={field.min} max={field.max} step={field.step ?? 'any'}
          value={value === undefined || value === null || Number.isNaN(value) ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={inputClass + errorRing} />
      );
      break;
    case 'select': {
      const options = typeof field.options === 'function' ? field.options(root) : field.options;
      control = (
        <select id={id} value={(value as string) ?? ''} onChange={(e) => setText(e.target.value)} className={inputClass + errorRing}>
          {field.optional && <option value="">None</option>}
          {!field.optional && value === undefined && <option value="">Choose…</option>}
          {options.map((o) => (
            <option key={optionValue(o)} value={optionValue(o)}>{optionLabel(o)}</option>
          ))}
        </select>
      );
      break;
    }
    case 'image':
      control = <ImageField value={(value as string) ?? ''} onChange={(v) => setText(v)} optional={field.optional} />;
      break;
    case 'lines':
      control = <LinesField value={(value as string[]) ?? []} onChange={onChange} itemLabel={field.itemLabel ?? 'item'} />;
      break;
    default:
      control = (
        <input id={id} type={field.type} value={(value as string) ?? ''} placeholder={field.placeholder}
          onChange={(e) => setText(e.target.value)} className={inputClass + errorRing} />
      );
  }

  return (
    <div className={field.wide || ['textarea', 'image', 'lines'].includes(field.type) ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.optional && <span className="font-normal text-slate-400"> · optional</span>}
      </label>
      {control}
      <Help error={error} hint={field.hint} />
    </div>
  );
};

const LinesField: React.FC<{ value: string[]; onChange: (v: string[]) => void; itemLabel: string }> = ({ value, onChange, itemLabel }) => (
  <div className="space-y-2">
    {value.map((line, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="w-6 text-xs font-semibold text-slate-400 text-right shrink-0">{i + 1}.</span>
        <input
          value={line}
          onChange={(e) => onChange(value.map((l, j) => (j === i ? e.target.value : l)))}
          className={inputClass}
          aria-label={`${itemLabel} ${i + 1}`}
        />
        <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
          className="p-2 rounded-brand text-slate-400 hover:text-red-600 hover:bg-red-50" aria-label={`Remove ${itemLabel} ${i + 1}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button type="button" onClick={() => onChange([...value, ''])}
      className="inline-flex items-center gap-1.5 ml-8 text-sm font-semibold text-brand-gold-dark hover:text-brand-navy">
      <Plus className="w-4 h-4" /> Add {itemLabel}
    </button>
  </div>
);

interface ObjectFormProps {
  fields: FieldDef[];
  value: unknown;
  onChange: (value: unknown) => void;
  errors?: Record<string, string>;
}

/** A two-column form for the given fields of an object. */
export const ObjectForm: React.FC<ObjectFormProps> = ({ fields, value, onChange, errors = {} }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
    {fields.map((field) => (
      <FieldInput
        key={field.key || field.label}
        field={field}
        value={field.type === 'heading' ? undefined : getPath(value, field.key)}
        onChange={(v) => onChange(setPath(value, field.key, v))}
        root={value}
        error={errors[field.key]}
      />
    ))}
  </div>
);
