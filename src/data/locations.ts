// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content as store } from '../content/store';

const locations = store.locations;

/**
 * Locations offered in the route estimator dropdowns. The first entry is the
 * default pickup point and the third is the default destination.
 */
export const popularLocations = locations.locations;

/** Map centre used before a route is drawn. */
export const MAP_CENTER: [number, number] = [locations.mapCenter.lat, locations.mapCenter.lng];
