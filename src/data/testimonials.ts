import type { Testimonial } from '../types';

/**
 * =========================================================================
 * CUSTOMER REVIEWS
 * =========================================================================
 * IMPORTANT: Only publish genuine reviews, with the customer's permission
 * (e.g. copied from your Google Business reviews). Publishing invented
 * reviews is prohibited under India's consumer protection rules.
 *
 * Entries with `isDemoData: true` are samples that show ONLY while developing
 * (npm run dev). The reviews section stays hidden on the live site until at
 * least one entry has `isDemoData: false`.
 */

export const testimonials: Testimonial[] = [
  {
    id: 'sample-1',
    name: 'Sample Customer',
    location: 'Kolkata',
    rating: 5,
    trip: 'Puri & Konark Day Trip',
    quote: 'Sample review, replace with a real customer’s words. For example: the driver arrived on time, the Innova was spotless, and the fare matched the quote exactly.',
    isDemoData: true,
  },
  {
    id: 'sample-2',
    name: 'Sample Customer',
    location: 'Bhubaneswar',
    rating: 5,
    trip: 'BBI Airport Pickup',
    quote: 'Sample review, replace with a real customer’s words. For example: our flight was late but the driver waited and helped with all our luggage.',
    isDemoData: true,
  },
  {
    id: 'sample-3',
    name: 'Sample Customer',
    location: 'Hyderabad',
    rating: 4,
    trip: 'Chilika Lake Excursion',
    quote: 'Sample review, replace with a real customer’s words. For example: a comfortable drive, and a driver who knew the best boat jetty and seafood stops.',
    isDemoData: true,
  },
  {
    id: 'sample-4',
    name: 'Sample Customer',
    location: 'Cuttack',
    rating: 5,
    trip: 'Family Wedding · Tempo Traveller',
    quote: 'Sample review, replace with a real customer’s words. For example: they coordinated three vehicles for our guests without a single delay.',
    isDemoData: true,
  },
];

/** Reviews to display: genuine ones on the live site, samples too while developing. */
export const visibleTestimonials = testimonials.filter((t) => import.meta.env.DEV || !t.isDemoData);
