import type { PricingCategoryKey, PricingPlan } from '../types';

/**
 * =========================================================================
 * INDIAN TRAVEL PRICING & TARIFF STRUCTURE (ODISHA)
 * =========================================================================
 * NOTE: The rates shown below are standard sample reference tariffs for Odisha
 * and outstation routes. The business owner can update rates, minimum billing
 * distance (e.g. 250 km/day), and driver allowances here.
 */

export const pricingData: PricingPlan[] = [
  {
    id: 'price-dzire-km',
    categoryName: 'Outstation / Per Km Rate',
    categoryKey: 'per-km',
    vehicleCategory: 'Executive Sedan (4-Seater)',
    vehicleModelExample: 'Maruti Suzuki Dzire',
    basePrice: '₹14',
    unit: 'per km',
    additionalCharges: 'Driver Allowance ₹350/day. Minimum outstation billing: 250 km/day.',
    terms: [
      'AC operating throughout the trip',
      'Tolls, parking, and state entry border permits payable on actual receipts',
      'Calculated from garage dispatch to return in Bhubaneswar',
      'Night driving allowance (₹200) applicable for travel between 10:00 PM – 6:00 AM'
    ],
    isDemoData: true
  },
  {
    id: 'price-ertiga-km',
    categoryName: 'Outstation / Per Km Rate',
    categoryKey: 'per-km',
    vehicleCategory: 'Family MPV (6-Seater)',
    vehicleModelExample: 'Maruti Suzuki Ertiga',
    basePrice: '₹16',
    unit: 'per km',
    additionalCharges: 'Driver Allowance ₹350/day. Minimum outstation billing: 250 km/day.',
    terms: [
      'Comfortable 3-row seating with rear AC vents',
      'Highway tolls, parking & state road taxes extra on actual receipts',
      'Ideal for family trips to Puri, Chilika, Gopalpur & Cuttack',
      'Sanitized interior before departure'
    ],
    isDemoData: true
  },
  {
    id: 'price-innova-km',
    categoryName: 'Outstation / Per Km Rate',
    categoryKey: 'per-km',
    vehicleCategory: 'Premium Highway MPV (7-Seater)',
    vehicleModelExample: 'Toyota Innova Crysta (5602 Signature)',
    basePrice: '₹19',
    unit: 'per km',
    additionalCharges: 'Driver Allowance ₹400/day. Minimum outstation billing: 250 km/day.',
    terms: [
      'Captain seat luxury and dual zone high-power AC',
      'Tolls, state taxes & parking extra as per actual receipts',
      'Experienced commercial driver for long-distance highway comfort',
      'Transparent odometer reading verified with customer'
    ],
    isDemoData: true
  },
  {
    id: 'price-tempo-km',
    categoryName: 'Outstation / Per Km Rate',
    categoryKey: 'per-km',
    vehicleCategory: 'Tourist Van (12/17-Seater)',
    vehicleModelExample: 'Force Tempo Traveller',
    basePrice: '₹26',
    unit: 'per km',
    additionalCharges: 'Driver Allowance ₹500/day. Minimum outstation billing: 300 km/day.',
    terms: [
      'Ideal for joint family pilgrimages to Puri, wedding parties & tour groups',
      'Tolls, commercial parking & interstate border taxes as per actuals',
      'Pushback seats and overhead luggage carrier space',
      'Advance booking recommended for holiday weekends'
    ],
    isDemoData: true
  },
  {
    id: 'price-puri-konark-pkg',
    categoryName: 'Puri & Konark Day Excursion (Same-Day Round Trip)',
    categoryKey: 'puri-konark',
    vehicleCategory: 'Sedan Package (Dzire)',
    vehicleModelExample: 'Maruti Suzuki Dzire',
    basePrice: '₹2,600',
    unit: 'fixed package (Bhubaneswar ⇄ Dhauli ⇄ Konark ⇄ Puri)',
    additionalCharges: 'Parking fees & temple guide fees at sites extra as per actuals.',
    terms: [
      'Covers Bhubaneswar pickup → Dhauli → Konark Sun Temple → Chandrabhaga Beach → Puri Sea Beach / Temple → Return',
      'Includes fuel, highway tolls, and driver for up to 12 hours',
      'Doorstep pickup and return drop-off across Bhubaneswar',
      'Upgrade to Ertiga (₹3,200) or Innova Crysta (₹3,800) available'
    ],
    isDemoData: true
  },
  {
    id: 'price-bbsr-local-sedan',
    categoryName: 'Bhubaneswar Local City Rental (8 Hrs / 80 Km)',
    categoryKey: 'bhubaneswar-local',
    vehicleCategory: 'Executive Sedan',
    vehicleModelExample: 'Maruti Suzuki Dzire',
    basePrice: '₹2,000',
    unit: 'for 8 hrs / 80 km',
    additionalCharges: 'Extra km @ ₹14/km. Extra hour @ ₹150/hr.',
    terms: [
      'Includes fuel and driver for 8 continuous hours within Bhubaneswar & Cuttack twin cities',
      'Parking fees at malls, hospitals, or monuments payable as per actuals',
      'Perfect for business meetings, shopping, or hospital visits',
      'Punctual doorstep pickup'
    ],
    isDemoData: true
  },
  {
    id: 'price-airport-transfer-bbi',
    categoryName: 'Biju Patnaik Airport (BBI) Pickup / Drop',
    categoryKey: 'airport',
    vehicleCategory: 'Executive Sedan / MPV',
    vehicleModelExample: 'Maruti Dzire or Ertiga',
    basePrice: '₹850',
    unit: 'one-way transfer (Bhubaneswar City ⇄ BBI Airport)',
    additionalCharges: 'Airport parking fee payable on actual receipt (if applicable).',
    terms: [
      'Punctual pickup synchronized with your flight arrival / departure schedule',
      'Driver assists with luggage loading and unloading',
      'Clean, air-conditioned vehicle waiting at arrival gate',
      'Flight delay buffer included up to 30 minutes'
    ],
    isDemoData: true
  }
];

/** Tabs shown above the tariff cards, in display order. */
export const pricingTabs: { key: PricingCategoryKey; label: string }[] = [
  { key: 'per-km', label: 'Outstation / Per Km' },
  { key: 'puri-konark', label: 'Puri & Konark Day Trip' },
  { key: 'bhubaneswar-local', label: 'Bhubaneswar Local (8h/80km)' },
  { key: 'airport', label: 'BBI Airport Transfers' },
];
