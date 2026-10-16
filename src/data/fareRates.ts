// Content is edited in the admin panel (/admin) or directly in src/content/fare-rates.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { FareRatesContent } from '../types';
import content from '../content/fare-rates.json';

const fares = content as unknown as FareRatesContent;

/**
 * Estimated fare = max(distance, minBillableKm) × ratePerKm
 *                  + longTripAllowance (only when distance > LONG_TRIP_THRESHOLD_KM)
 */
export const fareRates = fares.rates;
export const LONG_TRIP_THRESHOLD_KM = fares.longTripThresholdKm;

/** Fare card highlighted by default in the calculator. */
export const DEFAULT_FARE_CATEGORY = fares.defaultCategory;
