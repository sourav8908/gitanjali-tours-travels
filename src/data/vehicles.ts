// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content } from '../content/store';

/** Vehicles shown on the site (entries marked hidden are left out). */
export const vehiclesData = content.vehicles.filter((v) => !v.hidden);
