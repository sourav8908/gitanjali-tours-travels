// Content is edited in the admin panel (/admin) or directly in src/content/locations.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { LocationsContent } from '../types';
import content from '../content/locations.json';

const locations = content as unknown as LocationsContent;

/**
 * Locations offered in the route estimator dropdowns. The first entry is the
 * default pickup point and the third is the default destination.
 */
export const popularLocations = locations.locations;

/** Map centre used before a route is drawn. */
export const MAP_CENTER: [number, number] = [locations.mapCenter.lat, locations.mapCenter.lng];
