import React, { useState } from 'react';
import type { ZodType } from 'zod';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, ImageOff } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { asset } from '../utils/asset';
import { ObjectForm } from './fields';
import { friendlyMessage, getPath, normalize, setPath, type FieldDef } from './paths';
import { Badge, Toggle, type BadgeTone } from './ui';
import { btn } from './styles';

export type Item = Record<string, unknown>;

export interface ListConfig {
  /** Singular name, e.g. "Vehicle". */
  itemLabel: string;
  fields: FieldDef[];
  itemSchema: ZodType;
  summary: (item: Item) => {
    title: string;
    subtitle?: string;
    image?: string;
    badges?: { label: string; tone: BadgeTone }[];
  };
  /** Switches shown on each row. `invert` shows "on" when the value is false (e.g. hidden → Visible). */
  toggles?: { key: string; label: string; invert?: boolean }[];
  newItem: () => Item;
  /** Show photo thumbnails in the list. */
  showImage?: boolean;
}

interface ListEditorProps {
  items: Item[];
  onChange: (items: Item[]) => void;
  config: ListConfig;
  /** Row indexes with validation problems from the last save attempt. */
  invalidRows?: Set<number>;
}

export const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, config, invalidRows }) => {
  // index of the item being edited; -1 = adding a new one
  const [editing, setEditing] = useState<{ index: number; draft: Item } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const remove = (index: number) => {
    const { title } = config.summary(items[index]);
    if (window.confirm(`Delete "${title || config.itemLabel}"? You can undo this with "Discard changes" until you save.`)) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const openEditor = (index: number) => {
    setErrors({});
    setEditing({ index, draft: structuredClone(index === -1 ? config.newItem() : items[index]) });
  };

  const commit = () => {
    if (!editing) return;
    const cleaned = normalize(editing.draft, config.fields);
    const result = config.itemSchema.safeParse(cleaned);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        // Map nested list errors (e.g. features.2) to their field
        const field = config.fields.find((f) => key === f.key || key.startsWith(`${f.key}.`));
        next[field?.key ?? key] ??= friendlyMessage(issue.message);
      }
      setErrors(next);
      return;
    }
    const saved = result.data as Item;
    onChange(editing.index === -1 ? [...items, saved] : items.map((it, i) => (i === editing.index ? saved : it)));
    setEditing(null);
  };

  return (
    <div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-brand">
          Nothing here yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 border border-slate-200 rounded-brand">
          {items.map((item, index) => {
            const s = config.summary(item);
            const invalid = invalidRows?.has(index);
            return (
              <li key={(item.id as string) ?? index}
                className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 ${invalid ? 'bg-red-50' : ''}`}>
                <div className="flex flex-col">
                  <button type="button" className={btn.icon} onClick={() => move(index, index - 1)} disabled={index === 0}
                    aria-label={`Move ${s.title} up`}>
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" className={btn.icon} onClick={() => move(index, index + 1)} disabled={index === items.length - 1}
                    aria-label={`Move ${s.title} down`}>
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {config.showImage && (
                  <div className="w-20 h-14 rounded overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    {s.image ? (
                      <img src={asset(s.image)} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff className="w-5 h-5 text-slate-300" aria-hidden="true" />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-[10rem]">
                  <p className="text-sm font-semibold text-brand-navy">{s.title || <em className="text-slate-400">Untitled</em>}</p>
                  {s.subtitle && <p className="text-xs text-slate-500 mt-0.5">{s.subtitle}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {invalid && <Badge tone="red">Needs attention</Badge>}
                    {s.badges?.map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}
                  </div>
                </div>

                {config.toggles?.map((t) => {
                  const raw = Boolean(getPath(item, t.key));
                  const on = t.invert ? !raw : raw;
                  return (
                    <label key={t.key} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Toggle checked={on} label={`${t.label}: ${s.title}`}
                        onChange={(v) => onChange(items.map((it, i) => (i === index ? setPath(it, t.key, t.invert ? !v : v) : it)))} />
                      {t.label}
                    </label>
                  );
                })}

                <div className="flex items-center gap-1 ml-auto">
                  <button type="button" className={btn.ghost} onClick={() => openEditor(index)}>
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button type="button" className={btn.icon} onClick={() => remove(index)} aria-label={`Delete ${s.title}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className={`${btn.dark} mt-4`} onClick={() => openEditor(-1)}>
        <Plus className="w-4 h-4" /> Add {config.itemLabel.toLowerCase()}
      </button>

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.index === -1 ? `New ${config.itemLabel.toLowerCase()}` : `Edit ${config.itemLabel.toLowerCase()}`}
        maxWidth="max-w-3xl"
      >
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); commit(); }}>
            <ObjectForm
              fields={config.fields}
              value={editing.draft}
              onChange={(draft) => setEditing({ ...editing, draft: draft as Item })}
              errors={errors}
            />
            {Object.keys(errors).length > 0 && (
              <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-brand p-3" role="alert">
                Please fix the highlighted fields.
              </p>
            )}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
              <button type="button" className={btn.ghost} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className={btn.dark}>
                {editing.index === -1 ? `Add ${config.itemLabel.toLowerCase()}` : 'Done'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
