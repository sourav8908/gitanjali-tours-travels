import type { FareRate, FareRatesContent, PricingMode } from '../types';
import { formatCurrency } from './formatters';

export interface FareQuote {
  fare: number;
  /** Plain-language breakdown, e.g. "62 km × ₹14". */
  breakdown: string;
}

/** Customer-facing names for each pricing option. */
export function pricingModeLabel(mode: PricingMode, rate?: FareRate): string {
  switch (mode) {
    case 'perKm':
      return 'Per km';
    case 'perHour':
      return 'Per hour';
    case 'package':
      return rate ? `${rate.packageHours} hr / ${rate.packageKm} km package` : 'Hours + km package';
  }
}

/** Short explanation shown under the pricing option buttons. */
export function pricingModeHint(mode: PricingMode): string {
  switch (mode) {
    case 'perKm':
      return 'Pay for the distance travelled. Best for outstation and one-way trips.';
    case 'perHour':
      return 'Pay for the hours you keep the car (a km allowance is included each hour). Best for city errands and short hops.';
    case 'package':
      return 'A fixed block of hours and km, then a small charge for anything extra. Best for full-day sightseeing.';
  }
}

/**
 * Hours of hire to suggest: drive time plus waiting at each stop, rounded up
 * to a whole hour (minimum 1).
 */
export function suggestedHours(driveMinutes: number, stops: number, stopWaitMinutes: number): number {
  return Math.max(1, Math.ceil((driveMinutes + stops * stopWaitMinutes) / 60));
}

/** Estimated fare for one vehicle under the chosen pricing option. */
export function quoteFare(
  rate: FareRate,
  mode: PricingMode,
  distanceKm: number,
  hours: number,
  config: Pick<FareRatesContent, 'longTripThresholdKm'>
): FareQuote {
  if (mode === 'perHour') {
    const billable = Math.max(hours, rate.minHours);
    // Hourly hire includes kmPerHour km for each billed hour (0 = unlimited)
    const extraKm = rate.kmPerHour > 0 ? Math.max(0, distanceKm - billable * rate.kmPerHour) : 0;
    const parts = [`${billable} hr × ${formatCurrency(rate.ratePerHour)}${billable > hours ? ` (min ${rate.minHours} hr)` : ''}`];
    if (extraKm) parts.push(`${extraKm} extra km × ${formatCurrency(rate.extraKmRate)}`);
    return {
      fare: Math.round(billable * rate.ratePerHour + extraKm * rate.extraKmRate),
      breakdown: parts.join(' + '),
    };
  }

  if (mode === 'package') {
    const extraKm = Math.max(0, distanceKm - rate.packageKm);
    const extraHours = Math.max(0, hours - rate.packageHours);
    const parts = [`${rate.packageHours} hr / ${rate.packageKm} km ${formatCurrency(rate.packagePrice)}`];
    if (extraKm) parts.push(`${extraKm} extra km × ${formatCurrency(rate.extraKmRate)}`);
    if (extraHours) parts.push(`${extraHours} extra hr × ${formatCurrency(rate.extraHourRate)}`);
    return {
      fare: Math.round(rate.packagePrice + extraKm * rate.extraKmRate + extraHours * rate.extraHourRate),
      breakdown: parts.join(' + '),
    };
  }

  const billableKm = Math.max(distanceKm, rate.minBillableKm);
  const allowance = distanceKm > config.longTripThresholdKm ? rate.longTripAllowance : 0;
  return {
    fare: Math.round(billableKm * rate.ratePerKm + allowance),
    breakdown: `${billableKm} km × ${formatCurrency(rate.ratePerKm)}${billableKm > distanceKm ? ` (min ${rate.minBillableKm} km)` : ''}${
      allowance ? ` + driver ${formatCurrency(allowance)}` : ''
    }`,
  };
}
