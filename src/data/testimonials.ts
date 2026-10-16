// Content is edited in the admin panel (/admin) or directly in src/content/testimonials.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { Testimonial } from '../types';
import content from '../content/testimonials.json';

/**
 * Only publish genuine reviews, with the customer's permission. Publishing
 * invented reviews is prohibited under India's consumer protection rules.
 * Entries marked as samples (isDemoData) show only while developing.
 */
export const testimonials = content as unknown as Testimonial[];

/** Reviews to display: genuine ones on the live site, samples too while developing. */
export const visibleTestimonials = testimonials.filter((t) => import.meta.env.DEV || !t.isDemoData);
