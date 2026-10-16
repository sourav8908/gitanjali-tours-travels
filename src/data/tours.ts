// Content is edited in the admin panel (/admin) or directly in src/content/tours.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { TourPackage } from '../types';
import tours from '../content/tours.json';

/** Tour packages shown on the site (entries marked hidden are left out). */
export const toursData = (tours as unknown as TourPackage[]).filter((t) => !t.hidden);
