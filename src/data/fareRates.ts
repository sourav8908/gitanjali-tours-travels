// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content } from '../content/store';

const fares = content.fareRates;

/**
 * Estimated fare = max(distance, minBillableKm) × ratePerKm
 *                  + longTripAllowance (only when distance > LONG_TRIP_THRESHOLD_KM)
 */
export const fareRates = fares.rates;
export const LONG_TRIP_THRESHOLD_KM = fares.longTripThresholdKm;

/** Fare card highlighted by default in the calculator. */
export const DEFAULT_FARE_CATEGORY = fares.defaultCategory;
