// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { pricingModes } from '../content/pricingModes';
import { content } from '../content/store';
import type { PricingMode } from '../types';

/** Calculator settings and per-vehicle rates (see src/utils/fares.ts for the formulas). */
export const fareConfig = content.fareRates;
export const fareRates = fareConfig.rates;

/** Pricing options customers can choose, in display order. */
export const enabledPricingModes: PricingMode[] = pricingModes.filter((m) => fareConfig.modes[m]);

/** Pricing option selected when the calculator opens. */
export const DEFAULT_PRICING_MODE: PricingMode = enabledPricingModes.includes(fareConfig.defaultMode)
  ? fareConfig.defaultMode
  : (enabledPricingModes[0] ?? 'perKm');

/** Vehicle highlighted by default in the calculator. */
export const DEFAULT_FARE_CATEGORY = fareConfig.defaultCategory;
