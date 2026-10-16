// Content is edited in the admin panel (/admin) or directly in src/content/photo-credits.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { PhotoCredit } from '../types';
import content from '../content/photo-credits.json';

/** Attribution for Creative Commons photos (required by their licences). */
export const photoCredits = content as unknown as PhotoCredit[];
