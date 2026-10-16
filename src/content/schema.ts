import { z } from 'zod';

/**
 * Shape of every piece of editable content.
 *
 * This is the single source of truth:
 *  - the TypeScript types in src/types are inferred from these schemas,
 *  - `npm run validate` checks the JSON files in src/content/ against them
 *    before every build and deploy,
 *  - the admin panel (src/admin) validates edits with them before saving.
 *
 * If you add a field here, add it to the admin form in src/admin/sections.tsx too.
 */

const text = z.string().trim().min(1, 'Required');
const optionalText = z.string().trim().optional();
/**
 * A photo: a file in public/ (e.g. "/images/vehicles/innova-crysta.webp"), or,
 * for demo edits made in the admin, an uploaded image stored as a data URL.
 */
const imagePath = z.string().regex(
  /^(\/images\/.+\.(webp|jpe?g|png|avif|svg)|data:image\/(webp|jpeg|png);base64,.+)$/i,
  'Choose a photo'
);
const hidden = z.boolean().optional();

// ----------------------------------------------------------------- Settings

export const settingsSchema = z.object({
  sections: z.object({
    about: z.boolean(),
    destinations: z.boolean(),
    vehicles: z.boolean(),
    tours: z.boolean(),
    calculator: z.boolean(),
    pricing: z.boolean(),
    offers: z.boolean(),
    reviews: z.boolean(),
  }),
});

// ------------------------------------------------------------------ Company

export const companySchema = z.object({
  name: text,
  /** Hero headline. Text after the first comma is highlighted in gold. */
  tagline: text,
  supportingText: text,
  brandSignature: text,
  vehicleNumber: text,
  hubLocation: text,
  /** Dialling format, e.g. "+919876543210". */
  phone: z.string().regex(/^\+?\d{10,13}$/, 'Digits only, e.g. +919876543210'),
  phoneDisplay: text,
  /** International format without "+", e.g. "919876543210". */
  whatsapp: z.string().regex(/^\d{10,13}$/, 'Digits only with country code, e.g. 919876543210'),
  whatsappDisplay: text,
  email: z.email(),
  address: z.object({
    area: text,
    city: text,
    state: text,
    pincode: z.string().regex(/^\d{6}$/, '6-digit PIN code'),
    full: text,
    landmark: optionalText,
  }),
  businessHours: text,
  googleReviewsUrl: z.union([z.url(), z.literal('')]).optional(),
  socialLinks: z.object({
    facebook: z.union([z.url(), z.literal('')]).optional(),
    instagram: z.union([z.url(), z.literal('')]).optional(),
    whatsapp: z.union([z.url(), z.literal('')]).optional(),
  }),
});

// ----------------------------------------------------------------- Vehicles

export const vehicleCategories = ['Sedan', 'SUV', 'MPV', 'Hatchback / Compact', 'Tourist Van'] as const;

export const vehicleSchema = z.object({
  id: text,
  brand: text,
  model: text,
  fullName: text,
  category: z.enum(vehicleCategories),
  seatingCapacity: z.number().int().min(1).max(60),
  isAc: z.boolean(),
  fuelType: optionalText,
  luggageCapacity: text,
  /** Display price, e.g. "₹19". The number is also used by the budget filter. */
  rentalStartingPrice: z.string().regex(/\d/, 'Include the amount, e.g. ₹19'),
  pricingUnit: text,
  isAvailable: z.boolean(),
  isSignature5602: z.boolean().optional(),
  hidden,
  image: imagePath,
  description: text,
  bestFor: text,
  features: z.array(text),
});

// -------------------------------------------------------------------- Tours

export const tourCategories = ['Odisha Golden Triangle', 'Coastal & Nature', 'Heritage & Temples', 'Outstation Travel', 'Custom'] as const;

export const tourSchema = z.object({
  id: text,
  title: text,
  route: text,
  region: z.enum(['Odisha', 'Outstation']),
  category: z.enum(tourCategories),
  duration: text,
  startingPrice: text,
  priceNote: text,
  description: text,
  inclusions: z.array(text),
  highlights: z.array(text),
  image: imagePath,
  hidden,
});

// ------------------------------------------------------------------ Pricing

export const pricingCategoryKeys = ['per-km', 'bhubaneswar-local', 'puri-konark', 'airport'] as const;

export const pricingTabSchema = z.object({ key: z.enum(pricingCategoryKeys), label: text });

export const pricingPlanSchema = z.object({
  id: text,
  categoryName: text,
  categoryKey: z.enum(pricingCategoryKeys),
  vehicleCategory: text,
  vehicleModelExample: text,
  basePrice: text,
  unit: text,
  additionalCharges: text,
  terms: z.array(text),
  hidden,
});

export const pricingSchema = z.object({
  tabs: z.array(pricingTabSchema).min(1, 'Add at least one tab'),
  plans: z.array(pricingPlanSchema),
});

// ------------------------------------------------------------------- Offers

export const offerSchema = z.object({
  id: text,
  title: text,
  subtitle: optionalText,
  badge: text,
  discount: text,
  description: text,
  validity: text,
  terms: text,
  hidden,
});

// ------------------------------------------------------------- Destinations

export const destinationSchema = z.object({
  id: text,
  name: text,
  tagline: text,
  description: text,
  image: imagePath,
  heroImage: imagePath.optional(),
  distanceFromHub: text,
  inHeroSlideshow: z.boolean(),
  hidden,
});

// ------------------------------------------------------------- Testimonials

export const testimonialSchema = z.object({
  id: text,
  name: text,
  location: text,
  rating: z.number().int().min(1).max(5),
  trip: text,
  quote: text,
  /** Samples show only while developing; real reviews must be false. */
  isDemoData: z.boolean(),
});

// --------------------------------------------------------------- Calculator

export const fareRateSchema = z.object({
  category: text,
  vehicleName: text,
  modelExample: text,
  ratePerKm: z.number().positive(),
  minBillableKm: z.number().nonnegative(),
  longTripAllowance: z.number().nonnegative(),
});

export const fareRatesSchema = z.object({
  longTripThresholdKm: z.number().positive(),
  defaultCategory: text,
  rates: z.array(fareRateSchema).min(1, 'Add at least one rate'),
});

export const locationCategories = ['Odisha Core', 'Coastal', 'Heritage', 'Outstation'] as const;

export const locationSchema = z.object({
  name: text,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  category: z.enum(locationCategories).optional(),
});

export const locationsSchema = z.object({
  mapCenter: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
  locations: z.array(locationSchema).min(2, 'Add at least two locations'),
});

// --------------------------------------------------------------------- Misc

export const servicesSchema = z.array(text).min(1);

export const photoCreditSchema = z.object({
  image: imagePath,
  subject: text,
  author: text,
  license: text,
  licenseUrl: z.union([z.url(), z.literal('')]),
  sourceUrl: z.url(),
});

/** Every piece of content and the schema it must match. */
export const contentSchemas = {
  settings: settingsSchema,
  company: companySchema,
  services: servicesSchema,
  vehicles: z.array(vehicleSchema),
  tours: z.array(tourSchema),
  pricing: pricingSchema,
  offers: z.array(offerSchema),
  destinations: z.array(destinationSchema),
  testimonials: z.array(testimonialSchema),
  fareRates: fareRatesSchema,
  locations: locationsSchema,
  photoCredits: z.array(photoCreditSchema),
} as const;
