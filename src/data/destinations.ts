// Content is edited in the admin panel (/admin) or directly in src/content/destinations.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { Destination } from '../types';
import content from '../content/destinations.json';

/** Destinations shown in the gallery (entries marked hidden are left out). */
export const destinations = (content as unknown as Destination[]).filter((d) => !d.hidden);

/** Destinations that rotate as the hero background, in gallery order. */
export const heroSlides = destinations.filter((d) => d.inHeroSlideshow);
