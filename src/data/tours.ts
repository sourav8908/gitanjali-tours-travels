// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content } from '../content/store';

/** Tour packages shown on the site (entries marked hidden are left out). */
export const toursData = content.tours.filter((t) => !t.hidden);
