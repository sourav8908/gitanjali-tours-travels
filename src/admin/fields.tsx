import React from 'react';
import { Plus, X } from 'lucide-react';
import { ImageField } from './ImageField';
import { Toggle } from './ui';
import { inputClass } from './styles';
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

export const FieldInput: React.FC<FieldInputProps> = ({ field, value, onChange, root, error }) => {
  const id = fieldId(field.key);
  const setText = (v: string) => onChange(field.optional && v === '' ? undefined : v);
  let control: React.ReactNode;

  switch (field.type) {
    case 'textarea':
      control = (
        <textarea id={id} rows={3} value={(value as string) ?? ''} placeholder={field.placeholder}
          onChange={(e) => setText(e.target.value)} className={inputClass} />
      );
      break;
    case 'number':
      control = (
        <input id={id} type="number" inputMode="decimal" min={field.min} max={field.max} step={field.step ?? 'any'}
          value={value === undefined || value === null || Number.isNaN(value) ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={inputClass} />
      );
      break;
    case 'boolean':
      control = (
        <div className="flex items-center gap-3 pt-1">
          <Toggle id={id} checked={Boolean(value)} onChange={onChange} label={field.label} />
          <span className="text-sm text-slate-600">{value ? 'On' : 'Off'}</span>
        </div>
      );
      break;
    case 'select': {
      const options = typeof field.options === 'function' ? field.options(root) : field.options;
      control = (
        <select id={id} value={(value as string) ?? ''} onChange={(e) => setText(e.target.value)} className={inputClass}>
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
          onChange={(e) => setText(e.target.value)} className={inputClass} />
      );
  }

  return (
    <div className={field.wide || ['textarea', 'image', 'lines'].includes(field.type) ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {field.label}
        {field.optional && <span className="font-normal text-slate-400"> (optional)</span>}
      </label>
      {control}
      {error ? (
        <p className="text-xs text-red-600 mt-1.5" role="alert">{error}</p>
      ) : (
        field.hint && <p className="text-xs text-slate-500 mt-1.5">{field.hint}</p>
      )}
    </div>
  );
};

const LinesField: React.FC<{ value: string[]; onChange: (v: string[]) => void; itemLabel: string }> = ({ value, onChange, itemLabel }) => (
  <div className="space-y-2">
    {value.map((line, i) => (
      <div key={i} className="flex items-center gap-2">
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
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ocean hover:text-brand-ocean-hover">
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
        value={getPath(value, field.key)}
        onChange={(v) => onChange(setPath(value, field.key, v))}
        root={value}
        error={errors[field.key]}
      />
    ))}
  </div>
);
