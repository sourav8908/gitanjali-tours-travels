// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content } from '../content/store';

/** Destinations shown in the gallery (entries marked hidden are left out). */
export const destinations = content.destinations.filter((d) => !d.hidden);

/** Destinations that rotate as the hero background, in gallery order. */
export const heroSlides = destinations.filter((d) => d.inHeroSlideshow);
