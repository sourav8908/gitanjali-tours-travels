import type { z } from 'zod';
import type {
  companySchema,
  destinationSchema,
  fareRatesSchema,
  locationsSchema,
  offerSchema,
  photoCreditSchema,
  pricingSchema,
  settingsSchema,
  testimonialSchema,
  tourSchema,
  vehicleSchema,
  vehicleCategories,
  tourCategories,
  pricingCategoryKeys,
  contentSchemas,
} from '../content/schema';
import type { pricingModes } from '../content/pricingModes';

// Content types are inferred from src/content/schema.ts (type-only imports,
// so zod is never bundled into the site).

export type SiteSettings = z.infer<typeof settingsSchema>;
export type SectionKey = keyof SiteSettings['sections'];
export type CompanyInfo = z.infer<typeof companySchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleCategory = (typeof vehicleCategories)[number];
export type TourPackage = z.infer<typeof tourSchema>;
export type TourCategory = (typeof tourCategories)[number];
export type PricingContent = z.infer<typeof pricingSchema>;
export type PricingPlan = PricingContent['plans'][number];
export type PricingCategoryKey = (typeof pricingCategoryKeys)[number];
export type SpecialOffer = z.infer<typeof offerSchema>;
export type Destination = z.infer<typeof destinationSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type FareRatesContent = z.infer<typeof fareRatesSchema>;
export type FareRate = FareRatesContent['rates'][number];
export type PricingMode = (typeof pricingModes)[number];
export type LocationsContent = z.infer<typeof locationsSchema>;
export type RouteCoordinate = LocationsContent['locations'][number];
export type PhotoCredit = z.infer<typeof photoCreditSchema>;

/** All editable content, keyed by section (see src/content/schema.ts). */
export type ContentKey = keyof typeof contentSchemas;
export type ContentBundle = { [K in ContentKey]: z.infer<(typeof contentSchemas)[K]> };

// ------------------------------------------------------- App-only types

export interface NavLink {
  label: string;
  href: string;
}

export type LegalDocType = 'privacy' | 'terms';

export interface EnquiryFormState {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  vehicleType: string;
  travelDate: string;
  passengers: string;
  pickupLocation: string;
  destination: string;
  message: string;
}

export interface RouteLeg {
  from: string;
  to: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface RouteResult {
  /** One leg per hop between consecutive trip points. */
  legs: RouteLeg[];
  distanceKm: number;
  durationMinutes: number;
  routeCoordinates: [number, number][];
  /** True when the live router was unavailable and a straight-line estimate was used. */
  isApproximate: boolean;
}
