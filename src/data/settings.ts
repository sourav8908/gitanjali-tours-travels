// Content is edited in the admin panel (/admin) or directly in src/content/settings.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { SectionKey, SiteSettings } from '../types';
import content from '../content/settings.json';

export const settings = content as unknown as SiteSettings;

/** Whether the page section with this id is switched on. Unknown ids (hero, contact…) are always on. */
export function isSectionOn(id: string): boolean {
  return !(id in settings.sections) || settings.sections[id as SectionKey];
}

/** Target for the hero's "Explore Our Services" button: the first enabled showcase section. */
export const servicesHref = `#${['destinations', 'vehicles', 'tours'].find(isSectionOn) ?? 'contact'}`;
