/** Field definitions and value helpers for admin forms. */

export type Option = string | { value: string; label: string };

interface BaseField {
  /** Dotted path into the edited object, e.g. "address.city". "" means the value itself. */
  key: string;
  label: string;
  hint?: string;
  placeholder?: string;
  /** Not required; an empty value is removed instead of saved. */
  optional?: boolean;
  /** Span both columns of the form grid. */
  wide?: boolean;
}

export type FieldDef =
  | (BaseField & { type: 'text' | 'textarea' | 'email' | 'url' | 'tel' })
  | (BaseField & { type: 'number'; min?: number; max?: number; step?: number })
  | (BaseField & { type: 'boolean' })
  | (BaseField & { type: 'select'; options: Option[] | ((root: unknown) => Option[]) })
  | (BaseField & { type: 'image' })
  | (BaseField & { type: 'lines'; itemLabel?: string })
  /** A sub-heading that groups the fields after it (not a value; key must be unique, e.g. "_h-per-hour"). */
  | (BaseField & { type: 'heading' });

type AnyRecord = Record<string, unknown>;

export function getPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as AnyRecord)[k]), obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  if (!path) return value as T;
  const [head, ...rest] = path.split('.');
  const base = (Array.isArray(obj) ? [...obj] : { ...((obj as AnyRecord) ?? {}) }) as AnyRecord;
  const next = setPath(base[head], rest.join('.'), value);
  if (next === undefined) delete base[head];
  else base[head] = next;
  return base as T;
}

/** Remove blank lines from list fields before validating. */
export function normalize<T>(value: T, fields: FieldDef[]): T {
  let out = value;
  for (const field of fields) {
    if (field.type === 'lines') {
      const lines = getPath(out, field.key);
      if (Array.isArray(lines)) out = setPath(out, field.key, lines.map((l) => String(l).trim()).filter(Boolean));
    }
  }
  return out;
}

/** Turn a validation message into plain language. */
export function friendlyMessage(message: string): string {
  if (/received undefined|Required/i.test(message)) return 'Required';
  if (/expected number/i.test(message)) return 'Enter a number';
  if (/Invalid option/i.test(message)) return 'Choose one of the options';
  const min = message.match(/Too small: expected number to be >=?(\S+)/i);
  if (min) return `Must be at least ${min[1]}`;
  const max = message.match(/Too big: expected number to be <=?(\S+)/i);
  if (max) return `Must be at most ${max[1]}`;
  if (/expected int/i.test(message)) return 'Enter a whole number';
  if (/Invalid email/i.test(message)) return 'Enter a valid email address';
  if (/Invalid URL/i.test(message)) return 'Enter a full link starting with https://';
  return message;
}
