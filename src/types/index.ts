export interface CompanyInfo {
  name: string;
  tagline: string;
  supportingText: string;
  brandSignature: string;
  vehicleNumber: string;
  hubLocation: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: {
    area: string;
    city: string;
    state: string;
    pincode: string;
    full: string;
    landmark?: string;
  };
  businessHours: string;
  googleMapsEmbedUrl?: string;
  /** Link to your Google Business reviews page, shown in the reviews section. */
  googleReviewsUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export type VehicleCategory =
  | 'Sedan'
  | 'SUV'
  | 'MPV'
  | 'Hatchback / Compact'
  | 'Tourist Van';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  fullName: string;
  category: VehicleCategory;
  seatingCapacity: number;
  isAc: boolean;
  fuelType?: string;
  luggageCapacity: string;
  rentalStartingPrice: string;
  pricingUnit: string;
  isAvailable: boolean;
  isSignature5602?: boolean;
  isDemoData: boolean;
  image: string;
  description: string;
  bestFor: string;
  features: string[];
}

export type TourCategory =
  | 'Odisha Golden Triangle'
  | 'Coastal & Nature'
  | 'Heritage & Temples'
  | 'Outstation Travel'
  | 'Custom';

export interface TourPackage {
  id: string;
  title: string;
  route: string;
  region: 'Odisha' | 'Outstation';
  category: TourCategory;
  duration: string;
  startingPrice: string;
  priceNote: string;
  description: string;
  inclusions: string[];
  image: string;
  isDemoData: boolean;
  highlights: string[];
}

export type PricingCategoryKey = 'per-km' | 'bhubaneswar-local' | 'puri-konark' | 'airport';

export interface PricingPlan {
  id: string;
  categoryName: string;
  categoryKey: PricingCategoryKey;
  vehicleCategory: string;
  vehicleModelExample: string;
  basePrice: string;
  unit: string;
  additionalCharges: string;
  terms: string[];
  isDemoData: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  discount: string;
  description: string;
  validity: string;
  terms: string;
  isDemoData: boolean;
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

export interface RouteCoordinate {
  lat: number;
  lng: number;
  name: string;
  category?: 'Odisha Core' | 'Coastal' | 'Heritage' | 'Outstation';
}

/** Per-km tariff used by the distance calculator to estimate a fare. */
export interface FareRate {
  category: string;
  vehicleName: string;
  modelExample: string;
  ratePerKm: number;
  /** Trips shorter than this are billed as this many km. */
  minBillableKm: number;
  /** Driver allowance added when a trip exceeds LONG_TRIP_THRESHOLD_KM. */
  longTripAllowance: number;
}

export interface FareEstimate {
  category: string;
  vehicleName: string;
  modelExample: string;
  estimatedFare: number;
  ratePerKm: number;
  baseKm: number;
}

export interface RouteResult {
  from: string;
  to: string;
  distanceKm: number;
  durationMinutes: number;
  routeCoordinates: [number, number][];
  estimatedFares: FareEstimate[];
  /** True when the live router was unavailable and a straight-line estimate was used. */
  isApproximate: boolean;
}

export interface Destination {
  id: string;
  name: string;
  /** Short line shown under the name, e.g. "UNESCO World Heritage Site". */
  tagline: string;
  description: string;
  image: string;
  /** Optional different (wider / higher-resolution) photo for the hero slideshow. */
  heroImage?: string;
  /** Approximate road distance from Bhubaneswar, for display. */
  distanceFromHub: string;
  /** Include in the rotating hero background. */
  inHeroSlideshow: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  /** 1 to 5 */
  rating: number;
  trip: string;
  quote: string;
  /**
   * Sample entries are shown only in development. Set to false only for a
   * genuine review you have the customer's permission to publish.
   */
  isDemoData: boolean;
}

export interface PhotoCredit {
  image: string;
  subject: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}
