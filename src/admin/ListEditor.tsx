import React, { useState } from 'react';
import type { ZodType } from 'zod';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ImageOff, Pencil, Plus, Trash2 } from 'lucide-react';
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
    /** Highlighted figure, e.g. a price. */
    value?: string;
    image?: string;
    badges?: { label: string; tone: BadgeTone }[];
  };
  /** Switches shown on each item. `invert` shows "on" when the value is false (e.g. hidden → Visible). */
  toggles?: { key: string; label: string; invert?: boolean }[];
  newItem: () => Item;
  /** Show items as photo cards instead of rows. */
  showImage?: boolean;
}

interface ListEditorProps {
  items: Item[];
  onChange: (items: Item[]) => void;
  config: ListConfig;
  /** Item indexes with validation problems from the last save attempt. */
  invalidRows?: Set<number>;
}

export const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, config, invalidRows }) => {
  // index of the item being edited; -1 = adding a new one
  const [editing, setEditing] = useState<{ index: number; draft: Item } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const label = config.itemLabel.toLowerCase();

  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const remove = (index: number) => {
    const { title } = config.summary(items[index]);
    if (window.confirm(`Delete "${title || config.itemLabel}"? You can undo with "Discard" until you save.`)) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const setToggle = (index: number, key: string, value: boolean) =>
    onChange(items.map((it, i) => (i === index ? setPath(it, key, value) : it)));

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
        const field = config.fields.find((f) => f.type !== 'heading' && (key === f.key || key.startsWith(`${f.key}.`)));
        next[field?.key ?? key] ??= friendlyMessage(issue.message);
      }
      setErrors(next);
      return;
    }
    const saved = result.data as Item;
    onChange(editing.index === -1 ? [...items, saved] : items.map((it, i) => (i === editing.index ? saved : it)));
    setEditing(null);
  };

  const toggles = (item: Item, index: number, title: string) =>
    config.toggles?.map((t) => {
      const raw = Boolean(getPath(item, t.key));
      return (
        <label key={t.key} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
          <Toggle size="sm" checked={t.invert ? !raw : raw} label={`${t.label}: ${title}`}
            onChange={(v) => setToggle(index, t.key, t.invert ? !v : v)} />
          {t.label}
        </label>
      );
    });

  const actions = (index: number, title: string, horizontal: boolean) => (
    <div className="flex items-center gap-0.5">
      <button type="button" className={btn.icon} onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={`Move ${title} ${horizontal ? 'earlier' : 'up'}`}>
        {horizontal ? <ArrowLeft className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
      </button>
      <button type="button" className={btn.icon} onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label={`Move ${title} ${horizontal ? 'later' : 'down'}`}>
        {horizontal ? <ArrowRight className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      </button>
      <button type="button" className={`${btn.icon} hover:!text-red-600 hover:!bg-red-50`} onClick={() => remove(index)} aria-label={`Delete ${title}`}>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const addButton = (
    <button type="button" className={config.showImage ? `${btn.add} min-h-[220px] w-full flex-col` : `${btn.add} w-full`} onClick={() => openEditor(-1)}>
      <Plus className={config.showImage ? 'w-6 h-6' : 'w-4 h-4'} /> Add {label}
    </button>
  );

  return (
    <div>
      {config.showImage ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const s = config.summary(item);
            const invalid = invalidRows?.has(index);
            return (
              <li key={(item.id as string) ?? index}
                className={`group flex flex-col bg-white rounded-brand-lg border overflow-hidden transition-shadow hover:shadow-card ${
                  invalid ? 'border-red-400 ring-2 ring-red-200' : 'border-brand-line'
                }`}>
                <div className="relative aspect-[16/10] bg-brand-ivory">
                  {s.image ? (
                    <img src={asset(s.image)} alt="" loading="lazy" className={`w-full h-full object-cover ${item.hidden ? 'opacity-40 grayscale' : ''}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageOff className="w-8 h-8 text-slate-300" aria-hidden="true" /></div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {invalid && <Badge tone="red">Needs attention</Badge>}
                    {s.badges?.map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-base font-bold text-brand-navy leading-snug">{s.title || <em className="text-slate-400 font-sans text-sm">Untitled</em>}</p>
                    {s.value && <p className="text-sm font-bold text-brand-navy whitespace-nowrap">{s.value}</p>}
                  </div>
                  {s.subtitle && <p className="text-xs text-slate-500 mt-1">{s.subtitle}</p>}
                  {config.toggles && <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">{toggles(item, index, s.title)}</div>}
                  <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <button type="button" className={btn.secondary} onClick={() => openEditor(index)}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    {actions(index, s.title, true)}
                  </div>
                </div>
              </li>
            );
          })}
          <li>{addButton}</li>
        </ul>
      ) : (
        <>
          {items.length > 0 && (
            <ul className="divide-y divide-brand-line border border-brand-line rounded-brand-lg overflow-hidden mb-4">
              {items.map((item, index) => {
                const s = config.summary(item);
                const invalid = invalidRows?.has(index);
                return (
                  <li key={(item.id as string) ?? index}
                    className={`flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-3 px-4 py-3 ${invalid ? 'bg-red-50' : 'bg-white hover:bg-brand-ivory/60'}`}>
                    <div className="flex-1 min-w-[12rem]">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-brand-navy">{s.title || <em className="text-slate-400">Untitled</em>}</p>
                        {invalid && <Badge tone="red">Needs attention</Badge>}
                        {s.badges?.map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}
                      </div>
                      {s.subtitle && <p className="text-xs text-slate-500 mt-0.5">{s.subtitle}</p>}
                    </div>
                    {s.value && <p className="text-sm font-bold text-brand-navy whitespace-nowrap">{s.value}</p>}
                    {config.toggles && <div className="flex gap-4">{toggles(item, index, s.title)}</div>}
                    <div className="flex items-center gap-1 ml-auto">
                      <button type="button" className={btn.secondary} onClick={() => openEditor(index)}>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      {actions(index, s.title, false)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {addButton}
        </>
      )}

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.index === -1 ? `New ${label}` : `Edit ${label}`}
        maxWidth="max-w-3xl"
      >
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); commit(); }}>
            <ObjectForm
              fields={config.fields}
              value={editing.draft}
              onChange={(draft) => {
                // Clear the message on any field the user has just changed
                const next = draft as Item;
                setErrors((errs) => Object.fromEntries(
                  Object.entries(errs).filter(([key]) => JSON.stringify(getPath(next, key)) === JSON.stringify(getPath(editing.draft, key)))
                ));
                setEditing({ ...editing, draft: next });
              }}
              errors={errors}
            />
            <div className="sticky -bottom-6 -mx-6 -mb-6 mt-6 px-6 py-4 bg-white/95 backdrop-blur border-t border-brand-line flex flex-wrap items-center justify-end gap-2">
              {Object.keys(errors).length > 0 && (
                <p className="mr-auto text-sm font-medium text-red-700" role="alert">Please fix the fields marked in red.</p>
              )}
              <button type="button" className={btn.secondary} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className={btn.primary}>{editing.index === -1 ? `Add ${label}` : 'Done'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
