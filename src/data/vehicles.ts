// Content is edited in the admin panel (/admin) or directly in src/content/vehicles.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { Vehicle } from '../types';
import vehicles from '../content/vehicles.json';

/** Vehicles shown on the site (entries marked hidden are left out). */
export const vehiclesData = (vehicles as unknown as Vehicle[]).filter((v) => !v.hidden);
