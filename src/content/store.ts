import type { ContentBundle, ContentKey } from '../types';
import { defaultContent } from './defaults';

/**
 * DEMO content storage.
 *
 * Edits made in the admin panel are saved in this browser's localStorage and
 * layered over the published content. They are visible only in the browser
 * that made them; customers always see the published JSON files. This stands
 * in for a real database until one is chosen; the same ContentBundle shape
 * can be loaded from an API instead.
 */

/** Bump the version when the content shape changes, so stale demo edits are ignored. */
export const STORAGE_KEY = 'gitanjali-tours:demo-content:v2';

const contentKeys = Object.keys(defaultContent) as ContentKey[];

function readStorage(): Partial<ContentBundle> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    // Keep only known sections
    return Object.fromEntries(
      Object.entries(parsed).filter(([key]) => contentKeys.includes(key as ContentKey))
    ) as Partial<ContentBundle>;
  } catch {
    return {};
  }
}

function writeStorage(overrides: Partial<ContentBundle>): void {
  if (Object.keys(overrides).length === 0) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

/** Demo edits present when the page loaded. */
const overridesAtLoad = readStorage();

/** Published content with this browser's demo edits applied. Read once per page load. */
export const content: ContentBundle = { ...defaultContent, ...overridesAtLoad };

/** Whether this browser has any demo edits. */
export const hasDemoEdits = Object.keys(overridesAtLoad).length > 0;

/** Sections with demo edits right now (re-reads storage). */
export function editedSections(): ContentKey[] {
  return Object.keys(readStorage()) as ContentKey[];
}

/** Current value for a section: the demo edit if any, else the published content. */
export function loadSection<K extends ContentKey>(key: K): ContentBundle[K] {
  const overrides = readStorage();
  return (overrides[key] ?? defaultContent[key]) as ContentBundle[K];
}

/**
 * Save a section's demo edit. Throws if the browser's storage is full
 * (localStorage holds roughly 5 MB per site, shared with uploaded photos).
 */
export function saveSection<K extends ContentKey>(key: K, value: ContentBundle[K]): void {
  const overrides = readStorage();
  overrides[key] = value;
  writeStorage(overrides);
}

/** Discard the demo edit for one section, returning it to the published content. */
export function resetSection(key: ContentKey): void {
  const overrides = readStorage();
  delete overrides[key];
  writeStorage(overrides);
}

/** Discard all demo edits. */
export function resetAllDemoEdits(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: nothing to clear
  }
}

/** Approximate size of the stored demo edits, in bytes. */
export function demoStorageBytes(): number {
  try {
    return (localStorage.getItem(STORAGE_KEY)?.length ?? 0) * 2; // UTF-16
  } catch {
    return 0;
  }
}

/** Full content (published + demo edits), e.g. for exporting to a database later. */
export function exportContent(): ContentBundle {
  return { ...defaultContent, ...readStorage() };
}
