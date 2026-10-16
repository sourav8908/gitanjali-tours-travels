import type { FareRate } from '../types';

/**
 * =========================================================================
 * DISTANCE CALCULATOR — ESTIMATED FARE RATES
 * =========================================================================
 * Rates used to estimate fares on the interactive map. Keep these in step
 * with the per-km plans in `pricing.ts`.
 *
 * Estimated fare = max(distance, minBillableKm) × ratePerKm
 *                  + longTripAllowance (only when distance > LONG_TRIP_THRESHOLD_KM)
 */

export const LONG_TRIP_THRESHOLD_KM = 150;

export const fareRates: FareRate[] = [
  {
    category: 'Sedan',
    vehicleName: 'Executive Sedan',
    modelExample: 'Maruti Suzuki Dzire',
    ratePerKm: 14,
    minBillableKm: 40,
    longTripAllowance: 350
  },
  {
    category: 'MPV',
    vehicleName: 'Family MPV',
    modelExample: 'Maruti Suzuki Ertiga',
    ratePerKm: 16,
    minBillableKm: 50,
    longTripAllowance: 350
  },
  {
    category: 'Premium MPV',
    vehicleName: 'Premium Highway MPV',
    modelExample: 'Toyota Innova Crysta (5602 Signature)',
    ratePerKm: 19,
    minBillableKm: 50,
    longTripAllowance: 400
  },
  {
    category: 'Tourist Van',
    vehicleName: '12/17-Seater Tourist Van',
    modelExample: 'Force Tempo Traveller',
    ratePerKm: 26,
    minBillableKm: 80,
    longTripAllowance: 500
  }
];

/** Fare card highlighted by default in the calculator. */
export const DEFAULT_FARE_CATEGORY = 'Premium MPV';
