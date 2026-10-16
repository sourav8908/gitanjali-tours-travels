// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import type { SectionKey } from '../types';
import { content } from '../content/store';

export const settings = content.settings;

/** Whether the page section with this id is switched on. Unknown ids (hero, contact…) are always on. */
export function isSectionOn(id: string): boolean {
  return !(id in settings.sections) || settings.sections[id as SectionKey];
}

/** Target for the hero's "Explore Our Services" button: the first enabled showcase section. */
export const servicesHref = `#${['destinations', 'vehicles', 'tours'].find(isSectionOn) ?? 'contact'}`;
