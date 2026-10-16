import type { ContentBundle } from '../types';
import settings from './settings.json';
import company from './company.json';
import services from './services.json';
import vehicles from './vehicles.json';
import tours from './tours.json';
import pricing from './pricing.json';
import offers from './offers.json';
import destinations from './destinations.json';
import testimonials from './testimonials.json';
import fareRates from './fare-rates.json';
import locations from './locations.json';
import photoCredits from './photo-credits.json';

/**
 * The published content (the JSON files in this folder). These are checked
 * against schema.ts by `npm run validate` before every build, so the cast is safe.
 */
export const defaultContent = {
  settings,
  company,
  services,
  vehicles,
  tours,
  pricing,
  offers,
  destinations,
  testimonials,
  fareRates,
  locations,
  photoCredits,
} as unknown as ContentBundle;
