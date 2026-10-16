// Content is edited in the admin panel (/admin) or directly in src/content/offers.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { SpecialOffer } from '../types';
import offers from '../content/offers.json';

/** Offers shown on the site (entries marked hidden are left out). */
export const offersData = (offers as unknown as SpecialOffer[]).filter((o) => !o.hidden);
