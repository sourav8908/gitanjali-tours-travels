/**
 * Pricing options for the trip calculator, in display order. Kept outside
 * schema.ts so the public site can use the list without loading zod.
 */
export const pricingModes = ['perKm', 'perHour', 'package'] as const;
