import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, Save } from 'lucide-react';
import { contentSchemas } from '../content/schema';
import { contentRules } from '../content/rules';
import { defaultContent } from '../content/defaults';
import { editedSections, loadSection, resetSection, saveSection } from '../content/store';
import type { ContentBundle } from '../types';
import { ObjectForm } from './fields';
import { friendlyMessage, getPath, setPath, type FieldDef } from './paths';
import { ListEditor, type Item } from './ListEditor';
import type { Block, SectionDef } from './sections';
import { Badge, Card, PageHeader } from './ui';
import { btn } from './styles';

interface SectionEditorProps {
  def: SectionDef;
  onDirtyChange: (dirty: boolean) => void;
  notify: (message: string) => void;
}

interface Problem {
  text: string;
  /** For list items: which block and row, to highlight it. */
  listPath?: string;
  row?: number;
  /** For plain fields: which field, and the message to show under it. */
  fieldKey?: string;
  message?: string;
}

/** Turn a validation issue path into "Fleet › Toyota Innova Crysta › Seats: Required". */
function describeIssue(def: SectionDef, draft: unknown, path: PropertyKey[], message: string): Problem {
  const keys = path.map(String);
  for (const block of def.blocks) {
    if (block.kind === 'list') {
      const prefix = block.path ? block.path.split('.') : [];
      if (prefix.every((p, i) => keys[i] === p) && keys.length > prefix.length && /^\d+$/.test(keys[prefix.length])) {
        const row = Number(keys[prefix.length]);
        const items = (getPath(draft, block.path) as Item[]) ?? [];
        const title = items[row] ? block.config.summary(items[row]).title || `${block.config.itemLabel} ${row + 1}` : '';
        const fieldKey = keys.slice(prefix.length + 1).join('.');
        const field = block.config.fields.find((f) => fieldKey === f.key || fieldKey.startsWith(`${f.key}.`));
        return {
          text: `${block.title ?? def.label} › ${title}${field ? ` › ${field.label}` : ''}: ${friendlyMessage(message)}`,
          listPath: block.path,
          row,
        };
      }
      if (keys.join('.') === block.path) return { text: `${block.title ?? def.label}: ${friendlyMessage(message)}` };
    } else {
      const field = block.fields.find((f) => keys.join('.') === f.key || keys.join('.').startsWith(`${f.key}.`) || (!f.key && keys.length <= 1));
      if (field) return { text: `${field.label}: ${friendlyMessage(message)}`, fieldKey: field.key, message: friendlyMessage(message) };
    }
  }
  return { text: `${keys.join(' › ') || def.label}: ${friendlyMessage(message)}` };
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ def, onDirtyChange, notify }) => {
  const [saved, setSaved] = useState(() => JSON.stringify(loadSection(def.key)));
  const [draft, setDraft] = useState<unknown>(() => JSON.parse(saved));
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isEdited, setIsEdited] = useState(() => editedSections().includes(def.key));

  const dirty = useMemo(() => JSON.stringify(draft) !== saved, [draft, saved]);
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const save = () => {
    const result = contentSchemas[def.key].safeParse(draft);
    const found: Problem[] = result.success
      ? []
      : result.error.issues.map((issue) => describeIssue(def, draft, issue.path, issue.message));
    for (const text of contentRules[def.key]?.(result.success ? result.data : draft) ?? []) found.push({ text });
    setProblems(found);
    if (found.length) return;

    try {
      const value = result.data as ContentBundle[typeof def.key];
      saveSection(def.key, value);
      const json = JSON.stringify(value);
      setSaved(json);
      setDraft(JSON.parse(json));
      setIsEdited(true);
      notify('Saved. Open the website in this browser to see your changes.');
    } catch {
      setProblems([{ text: "This browser's storage is full. Remove some uploaded photos or reset other sections, then try again." }]);
    }
  };

  const discard = () => {
    setDraft(JSON.parse(saved));
    setProblems([]);
  };

  const resetToPublished = () => {
    if (!window.confirm(`Reset "${def.label}" to the published version? Your demo edits in this section will be lost.`)) return;
    resetSection(def.key);
    const json = JSON.stringify(defaultContent[def.key]);
    setSaved(json);
    setDraft(JSON.parse(json));
    setProblems([]);
    setIsEdited(false);
    notify(`"${def.label}" reset to the published version.`);
  };

  const invalidRows = (listPath: string) =>
    new Set(problems.filter((p) => p.listPath === listPath && p.row !== undefined).map((p) => p.row as number));

  const renderBlock = (block: Block, i: number) => {
    if (block.kind === 'list') {
      return (
        <Card key={i} title={block.title} description={block.description}>
          <ListEditor
            items={(getPath(draft, block.path) as Item[]) ?? []}
            onChange={(items) => setDraft(setPath(draft, block.path, items))}
            config={block.config}
            invalidRows={invalidRows(block.path)}
          />
        </Card>
      );
    }
    const keys = new Set(block.fields.map((f: FieldDef) => f.key));
    const errors = Object.fromEntries(
      problems.filter((p) => p.fieldKey !== undefined && keys.has(p.fieldKey)).map((p) => [p.fieldKey, p.message])
    );
    return (
      <Card key={i} title={block.title} description={block.description}>
        <ObjectForm
          fields={block.fields}
          value={draft}
          onChange={(next) => {
            // Clear messages for fields the user has just changed
            setProblems((ps) => ps.filter((p) => p.fieldKey === undefined || JSON.stringify(getPath(next, p.fieldKey)) === JSON.stringify(getPath(draft, p.fieldKey))));
            setDraft(next);
          }}
          errors={errors}
        />
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        eyebrow={def.group}
        title={def.label}
        description={def.description}
        aside={
          <div className="flex items-center gap-2">
            {dirty ? (
              <Badge tone="amber" dot>Unsaved changes</Badge>
            ) : isEdited ? (
              <Badge tone="gold" dot>Edited in this browser</Badge>
            ) : (
              <Badge dot>Published version</Badge>
            )}
            {isEdited && !dirty && (
              <button type="button" className={btn.secondary} onClick={resetToPublished}>
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
          </div>
        }
      />

      {problems.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-brand-lg" role="alert">
          <p className="flex items-center gap-2 text-sm font-bold text-red-800 mb-2">
            <AlertTriangle className="w-4 h-4" /> Not saved. Please fix {problems.length === 1 ? 'this' : `these ${problems.length} things`}:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-red-800">
            {problems.map((p, i) => <li key={i}>{p.text}</li>)}
          </ul>
        </div>
      )}

      {def.blocks.map(renderBlock)}

      {/* Save bar: appears while there are unsaved changes */}
      <div
        className={`fixed bottom-5 left-1/2 lg:left-[calc(50%+8rem)] -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-xl transition-all duration-300 ${
          dirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        aria-hidden={!dirty}
      >
        <div className="flex items-center gap-3 pl-5 pr-2 py-2 bg-brand-navy text-white rounded-full shadow-2xl ring-1 ring-white/10">
          <span className="flex items-center gap-2 text-sm font-semibold mr-auto">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Unsaved changes
          </span>
          <button type="button" onClick={discard} tabIndex={dirty ? 0 : -1}
            className="px-3.5 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-full">
            Discard
          </button>
          <button type="button" onClick={save} tabIndex={dirty ? 0 : -1}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-navy bg-brand-gold hover:bg-brand-gold-dark hover:text-white rounded-full transition-colors">
            <Save className="w-4 h-4" /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
