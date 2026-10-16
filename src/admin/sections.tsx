import type { LucideIcon } from 'lucide-react';
import { Building2, Calculator, Car, Landmark, List, Map, MapPin, IndianRupee, MessageSquareQuote, Tag, ToggleRight } from 'lucide-react';
import {
  destinationSchema,
  fareRateSchema,
  locationCategories,
  locationSchema,
  offerSchema,
  pricingPlanSchema,
  pricingTabSchema,
  testimonialSchema,
  tourCategories,
  tourSchema,
  vehicleCategories,
  vehicleSchema,
} from '../content/schema';
import type { ContentKey, PricingCategoryKey } from '../types';
import type { FieldDef } from './paths';
import type { Item, ListConfig } from './ListEditor';

export type Block =
  | { kind: 'fields'; title?: string; description?: string; fields: FieldDef[] }
  | { kind: 'list'; path: string; title?: string; description?: string; config: ListConfig };

export interface SectionDef {
  key: ContentKey;
  label: string;
  icon: LucideIcon;
  description: string;
  blocks: Block[];
}

/** Short unique id for new items, e.g. "vehicle-lq3k9x2a". */
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

const str = (v: unknown) => (typeof v === 'string' ? v : '');

const hiddenBadge = (item: Item) => (item.hidden ? [{ label: 'Hidden', tone: 'slate' as const }] : []);
const visibleToggle = { key: 'hidden', label: 'Visible', invert: true };
const hiddenField: FieldDef = { key: 'hidden', label: 'Hide from website', type: 'boolean', hint: 'Hide this without deleting it.' };

const pricingCategoryOptions: { value: PricingCategoryKey; label: string }[] = [
  { value: 'per-km', label: 'Outstation / per km' },
  { value: 'puri-konark', label: 'Puri & Konark day trip' },
  { value: 'bhubaneswar-local', label: 'Bhubaneswar local' },
  { value: 'airport', label: 'Airport transfer' },
];
const pricingCategoryLabel = (key: unknown) => pricingCategoryOptions.find((o) => o.value === key)?.label ?? str(key);

export const sections: SectionDef[] = [
  // ------------------------------------------------------------------ Company
  {
    key: 'company',
    label: 'Business Details',
    icon: Building2,
    description: 'Contact details, address and the headline at the top of the website.',
    blocks: [
      {
        kind: 'fields',
        title: 'Brand & hero',
        fields: [
          { key: 'name', label: 'Business name', type: 'text' },
          { key: 'brandSignature', label: 'Brand signature', type: 'text' },
          { key: 'tagline', label: 'Hero headline', type: 'text', wide: true, hint: 'Text after the first comma is shown in gold, e.g. "Your Journey, Our Responsibility."' },
          { key: 'supportingText', label: 'Hero sub-text', type: 'textarea' },
          { key: 'vehicleNumber', label: 'Logo badge number', type: 'text', hint: 'Shown in the square logo, e.g. 5602.' },
          { key: 'hubLocation', label: 'Location under the logo', type: 'text' },
        ],
      },
      {
        kind: 'fields',
        title: 'Phone, WhatsApp & email',
        fields: [
          { key: 'phone', label: 'Phone (for dialling)', type: 'tel', hint: 'Country code, digits only, e.g. +919876543210' },
          { key: 'phoneDisplay', label: 'Phone (as shown)', type: 'text', hint: 'e.g. +91 98765 43210' },
          { key: 'whatsapp', label: 'WhatsApp number', type: 'tel', hint: 'Country code + number, no "+", e.g. 919876543210' },
          { key: 'whatsappDisplay', label: 'WhatsApp (as shown)', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'businessHours', label: 'Business hours', type: 'text' },
        ],
      },
      {
        kind: 'fields',
        title: 'Office address',
        fields: [
          { key: 'address.area', label: 'Area', type: 'text' },
          { key: 'address.city', label: 'City', type: 'text' },
          { key: 'address.state', label: 'State', type: 'text' },
          { key: 'address.pincode', label: 'PIN code', type: 'text' },
          { key: 'address.full', label: 'Full address (as shown)', type: 'textarea', hint: 'Also used for the Get Directions button.' },
          { key: 'address.landmark', label: 'Landmark', type: 'text', optional: true },
        ],
      },
      {
        kind: 'fields',
        title: 'Links',
        description: 'Leave empty to hide a button or icon.',
        fields: [
          { key: 'googleReviewsUrl', label: 'Google reviews link', type: 'url', optional: true, wide: true },
          { key: 'socialLinks.facebook', label: 'Facebook page', type: 'url', optional: true },
          { key: 'socialLinks.instagram', label: 'Instagram profile', type: 'url', optional: true },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------- Settings
  {
    key: 'settings',
    label: 'Page Sections',
    icon: ToggleRight,
    description: 'Show or hide whole sections. Hidden sections also disappear from the menu.',
    blocks: [
      {
        kind: 'fields',
        description: 'The hero, trust strip and contact section are always shown.',
        fields: [
          { key: 'sections.about', label: 'About Us', type: 'boolean' },
          { key: 'sections.destinations', label: 'Popular Destinations', type: 'boolean' },
          { key: 'sections.vehicles', label: 'Our Fleet', type: 'boolean' },
          { key: 'sections.tours', label: 'Tour Packages', type: 'boolean' },
          { key: 'sections.calculator', label: 'Distance & Fare Calculator', type: 'boolean' },
          { key: 'sections.pricing', label: 'Rental Tariffs', type: 'boolean' },
          { key: 'sections.offers', label: 'Special Offers', type: 'boolean' },
          { key: 'sections.reviews', label: 'Customer Reviews', type: 'boolean', hint: 'Appears only once a genuine review exists.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------- Fleet
  {
    key: 'vehicles',
    label: 'Fleet',
    icon: Car,
    description: 'Add, remove and reorder cars, and change prices and availability.',
    blocks: [
      {
        kind: 'list',
        path: '',
        config: {
          itemLabel: 'Vehicle',
          itemSchema: vehicleSchema,
          showImage: true,
          toggles: [{ key: 'isAvailable', label: 'Available' }, visibleToggle],
          summary: (v) => ({
            title: str(v.fullName),
            subtitle: `${str(v.rentalStartingPrice)} ${str(v.pricingUnit)} · ${v.seatingCapacity ?? '?'} seats · ${str(v.category)}`,
            image: str(v.image),
            badges: [
              ...hiddenBadge(v),
              v.isAvailable ? { label: 'Available', tone: 'green' as const } : { label: 'On request', tone: 'amber' as const },
              ...(v.isSignature5602 ? [{ label: '5602 Signature', tone: 'gold' as const }] : []),
            ],
          }),
          newItem: () => ({
            id: newId('vehicle'), fullName: '', brand: '', model: '', category: 'Sedan', image: '',
            rentalStartingPrice: '₹', pricingUnit: 'per km', seatingCapacity: 4, isAc: true, fuelType: '',
            luggageCapacity: '', isAvailable: true, isSignature5602: false, description: '', bestFor: '', features: [],
          }),
          fields: [
            { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Toyota Innova Crysta' },
            { key: 'category', label: 'Category', type: 'select', options: [...vehicleCategories] },
            { key: 'brand', label: 'Brand', type: 'text' },
            { key: 'model', label: 'Model (card title)', type: 'text' },
            { key: 'image', label: 'Photo', type: 'image', hint: 'Landscape photos work best.' },
            { key: 'rentalStartingPrice', label: 'Starting price', type: 'text', hint: 'e.g. ₹19 (also used by the budget filter)' },
            { key: 'pricingUnit', label: 'Price unit', type: 'text', placeholder: 'per km' },
            { key: 'seatingCapacity', label: 'Seats', type: 'number', min: 1, max: 60, step: 1 },
            { key: 'fuelType', label: 'Fuel', type: 'text', optional: true, placeholder: 'e.g. Diesel' },
            { key: 'luggageCapacity', label: 'Luggage', type: 'text', wide: true },
            { key: 'isAc', label: 'Air conditioned', type: 'boolean' },
            { key: 'isAvailable', label: 'Available now', type: 'boolean', hint: 'Off shows "On request".' },
            { key: 'isSignature5602', label: '5602 Signature vehicle', type: 'boolean' },
            hiddenField,
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'bestFor', label: 'Best for', type: 'text', wide: true },
            { key: 'features', label: 'Features', type: 'lines', itemLabel: 'feature' },
          ],
        },
      },
    ],
  },

  // ------------------------------------------------------------------- Tours
  {
    key: 'tours',
    label: 'Tour Packages',
    icon: Map,
    description: 'Tour packages shown in the Tours section.',
    blocks: [
      {
        kind: 'list',
        path: '',
        config: {
          itemLabel: 'Tour',
          itemSchema: tourSchema,
          showImage: true,
          toggles: [visibleToggle],
          summary: (t) => ({
            title: str(t.title),
            subtitle: `${str(t.startingPrice)} · ${str(t.duration)}`,
            image: str(t.image),
            badges: [...hiddenBadge(t), { label: str(t.category), tone: 'blue' as const }],
          }),
          newItem: () => ({
            id: newId('tour'), title: '', category: 'Custom', region: 'Odisha', image: '', route: '', duration: '',
            startingPrice: '₹', priceNote: '', description: '', highlights: [], inclusions: [],
          }),
          fields: [
            { key: 'title', label: 'Title', type: 'text', wide: true },
            { key: 'category', label: 'Category', type: 'select', options: [...tourCategories] },
            { key: 'region', label: 'Region', type: 'select', options: ['Odisha', 'Outstation'] },
            { key: 'image', label: 'Photo', type: 'image' },
            { key: 'route', label: 'Route', type: 'text', wide: true, placeholder: 'e.g. Bhubaneswar → Konark → Puri' },
            { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 2 Days / 1 Night' },
            { key: 'startingPrice', label: 'Starting price', type: 'text', placeholder: 'e.g. ₹5,800' },
            { key: 'priceNote', label: 'Price note', type: 'text', wide: true },
            hiddenField,
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'highlights', label: 'Highlights', type: 'lines', itemLabel: 'highlight' },
            { key: 'inclusions', label: 'Inclusions', type: 'lines', itemLabel: 'inclusion' },
          ],
        },
      },
    ],
  },

  // ------------------------------------------------------------------- Rates
  {
    key: 'pricing',
    label: 'Rates',
    icon: IndianRupee,
    description: 'Tariff cards in the Rental Tariffs section and the tabs above them.',
    blocks: [
      {
        kind: 'list',
        path: 'plans',
        title: 'Tariff cards',
        description: 'Each card appears under the tab with the same category.',
        config: {
          itemLabel: 'Tariff card',
          itemSchema: pricingPlanSchema,
          toggles: [visibleToggle],
          summary: (p) => ({
            title: str(p.vehicleCategory),
            subtitle: `${str(p.basePrice)} ${str(p.unit)} · ${str(p.vehicleModelExample)}`,
            badges: [
              ...hiddenBadge(p),
              { label: pricingCategoryLabel(p.categoryKey), tone: 'blue' as const },
            ],
          }),
          newItem: () => ({
            id: newId('price'), categoryKey: 'per-km', categoryName: '', vehicleCategory: '', vehicleModelExample: '',
            basePrice: '₹', unit: 'per km', additionalCharges: '', terms: [],
          }),
          fields: [
            { key: 'categoryKey', label: 'Tab', type: 'select', options: pricingCategoryOptions },
            { key: 'categoryName', label: 'Card heading', type: 'text' },
            { key: 'vehicleCategory', label: 'Vehicle type', type: 'text', placeholder: 'e.g. Executive Sedan (4-Seater)' },
            { key: 'vehicleModelExample', label: 'Example model', type: 'text' },
            { key: 'basePrice', label: 'Price', type: 'text', placeholder: 'e.g. ₹14 or ₹2,600' },
            { key: 'unit', label: 'Price unit', type: 'text', placeholder: 'e.g. per km' },
            hiddenField,
            { key: 'additionalCharges', label: 'Allowances & notes', type: 'textarea' },
            { key: 'terms', label: 'Terms', type: 'lines', itemLabel: 'term' },
          ],
        },
      },
      {
        kind: 'list',
        path: 'tabs',
        title: 'Tabs',
        description: 'The buttons above the tariff cards, in this order.',
        config: {
          itemLabel: 'Tab',
          itemSchema: pricingTabSchema,
          summary: (t) => ({ title: str(t.label), subtitle: pricingCategoryLabel(t.key) }),
          newItem: () => ({ key: 'per-km', label: '' }),
          fields: [
            { key: 'key', label: 'Category', type: 'select', options: pricingCategoryOptions },
            { key: 'label', label: 'Button text', type: 'text' },
          ],
        },
      },
    ],
  },

  // ------------------------------------------------------------------ Offers
  {
    key: 'offers',
    label: 'Offers',
    icon: Tag,
    description: 'Special offers. Keep them honest, with no fake urgency or invented discounts.',
    blocks: [
      {
        kind: 'list',
        path: '',
        config: {
          itemLabel: 'Offer',
          itemSchema: offerSchema,
          toggles: [visibleToggle],
          summary: (o) => ({ title: str(o.title), subtitle: str(o.discount), badges: [...hiddenBadge(o), { label: str(o.badge), tone: 'gold' as const }] }),
          newItem: () => ({ id: newId('offer'), title: '', subtitle: '', badge: '', discount: '', description: '', validity: '', terms: '' }),
          fields: [
            { key: 'title', label: 'Title', type: 'text', wide: true },
            { key: 'subtitle', label: 'Subtitle', type: 'text', optional: true, wide: true },
            { key: 'badge', label: 'Badge', type: 'text', placeholder: 'e.g. Popular Route' },
            { key: 'discount', label: 'Offer', type: 'text', placeholder: 'e.g. 5% OFF base tariff' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'validity', label: 'Validity', type: 'text', wide: true },
            { key: 'terms', label: 'Terms', type: 'textarea' },
            hiddenField,
          ],
        },
      },
    ],
  },

  // ------------------------------------------------------------ Destinations
  {
    key: 'destinations',
    label: 'Destinations',
    icon: Landmark,
    description: 'The destination gallery. The first one is shown large; slideshow ones rotate in the hero.',
    blocks: [
      {
        kind: 'list',
        path: '',
        config: {
          itemLabel: 'Destination',
          itemSchema: destinationSchema,
          showImage: true,
          toggles: [{ key: 'inHeroSlideshow', label: 'In slideshow' }, visibleToggle],
          summary: (d) => ({
            title: str(d.name),
            subtitle: `${str(d.tagline)} · ${str(d.distanceFromHub)}`,
            image: str(d.image),
            badges: [...hiddenBadge(d), ...(d.inHeroSlideshow ? [{ label: 'Hero slideshow', tone: 'gold' as const }] : [])],
          }),
          newItem: () => ({ id: newId('place'), name: '', tagline: '', description: '', image: '', distanceFromHub: '~', inHeroSlideshow: false }),
          fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'distanceFromHub', label: 'Distance from Bhubaneswar', type: 'text', placeholder: 'e.g. ~65 km' },
            { key: 'tagline', label: 'Tagline', type: 'text', wide: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'image', label: 'Photo', type: 'image' },
            { key: 'inHeroSlideshow', label: 'Show in hero slideshow', type: 'boolean' },
            hiddenField,
            { key: 'heroImage', label: 'Hero photo', type: 'image', optional: true, hint: 'A wide, high-resolution photo for the full-screen slideshow. Leave empty to use the main photo.' },
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------------------- Reviews
  {
    key: 'testimonials',
    label: 'Reviews',
    icon: MessageSquareQuote,
    description: 'Only add genuine reviews customers agreed to share. Invented reviews are illegal in India.',
    blocks: [
      {
        kind: 'list',
        path: '',
        config: {
          itemLabel: 'Review',
          itemSchema: testimonialSchema,
          summary: (r) => ({
            title: `${str(r.name)} · ${'★'.repeat(Number(r.rating) || 0)}`,
            subtitle: `${str(r.trip)} · ${str(r.location)}`,
            badges: r.isDemoData ? [{ label: 'Sample: not on live site', tone: 'amber' as const }] : [{ label: 'Genuine', tone: 'green' as const }],
          }),
          newItem: () => ({ id: newId('review'), name: '', location: '', rating: 5, trip: '', quote: '', isDemoData: false }),
          fields: [
            { key: 'name', label: 'Customer name', type: 'text' },
            { key: 'location', label: 'City', type: 'text' },
            { key: 'rating', label: 'Stars (1–5)', type: 'number', min: 1, max: 5, step: 1 },
            { key: 'trip', label: 'Trip', type: 'text', placeholder: 'e.g. Puri & Konark Day Trip' },
            { key: 'quote', label: 'Review text', type: 'textarea' },
            { key: 'isDemoData', label: 'Sample review', type: 'boolean', hint: 'Leave off for real reviews. Samples never appear on the live site.' },
          ],
        },
      },
    ],
  },

  // -------------------------------------------------------------- Calculator
  {
    key: 'fareRates',
    label: 'Fare Rates',
    icon: Calculator,
    description: 'Per-km rates used by the distance calculator. Keep them in step with the per-km cards under Rates.',
    blocks: [
      {
        kind: 'list',
        path: 'rates',
        title: 'Vehicle rates',
        description: 'Estimated fare = max(distance, minimum km) × rate, plus the long-trip allowance on long journeys.',
        config: {
          itemLabel: 'Rate',
          itemSchema: fareRateSchema,
          summary: (r) => ({ title: str(r.modelExample), subtitle: `₹${r.ratePerKm ?? '?'}/km · ${str(r.category)}` }),
          newItem: () => ({ category: '', vehicleName: '', modelExample: '', ratePerKm: 15, minBillableKm: 40, longTripAllowance: 350 }),
          fields: [
            { key: 'category', label: 'Category name', type: 'text' },
            { key: 'vehicleName', label: 'Vehicle type', type: 'text' },
            { key: 'modelExample', label: 'Example model (shown)', type: 'text', wide: true },
            { key: 'ratePerKm', label: 'Rate per km (₹)', type: 'number', min: 1 },
            { key: 'minBillableKm', label: 'Minimum billed km', type: 'number', min: 0, step: 1 },
            { key: 'longTripAllowance', label: 'Long-trip driver allowance (₹)', type: 'number', min: 0, step: 1 },
          ],
        },
      },
      {
        kind: 'fields',
        title: 'Calculator settings',
        fields: [
          { key: 'longTripThresholdKm', label: 'Long trip starts above (km)', type: 'number', min: 1, step: 1 },
          {
            key: 'defaultCategory',
            label: 'Pre-selected rate',
            type: 'select',
            options: (root) => ((root as { rates?: { category: string; modelExample: string }[] })?.rates ?? [])
              .map((r) => ({ value: r.category, label: `${r.modelExample} (${r.category})` })),
          },
        ],
      },
    ],
  },
  {
    key: 'locations',
    label: 'Locations',
    icon: MapPin,
    description: 'Pickup and drop-off points in the distance calculator.',
    blocks: [
      {
        kind: 'list',
        path: 'locations',
        description: 'The 1st location is the default pickup; the 3rd is the default destination. Get coordinates by right-clicking a place in Google Maps.',
        config: {
          itemLabel: 'Location',
          itemSchema: locationSchema,
          summary: (l) => ({ title: str(l.name), subtitle: `${l.lat ?? '?'}, ${l.lng ?? '?'}`, badges: l.category ? [{ label: str(l.category), tone: 'blue' as const }] : [] }),
          newItem: () => ({ name: '', lat: 20.2961, lng: 85.8245 }),
          fields: [
            { key: 'name', label: 'Name', type: 'text', wide: true },
            { key: 'lat', label: 'Latitude', type: 'number', min: -90, max: 90 },
            { key: 'lng', label: 'Longitude', type: 'number', min: -180, max: 180 },
            { key: 'category', label: 'Group', type: 'select', optional: true, options: [...locationCategories] },
          ],
        },
      },
      {
        kind: 'fields',
        title: 'Map centre',
        description: 'Where the map is centred before a route is drawn.',
        fields: [
          { key: 'mapCenter.lat', label: 'Latitude', type: 'number', min: -90, max: 90 },
          { key: 'mapCenter.lng', label: 'Longitude', type: 'number', min: -180, max: 180 },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Services
  {
    key: 'services',
    label: 'Services',
    icon: List,
    description: 'Services listed in the footer and offered in the contact form.',
    blocks: [{ kind: 'fields', fields: [{ key: '', label: 'Services', type: 'lines', itemLabel: 'service' }] }],
  },
];
