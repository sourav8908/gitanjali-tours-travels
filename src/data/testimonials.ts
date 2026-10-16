// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content } from '../content/store';

/**
 * Only publish genuine reviews, with the customer's permission. Publishing
 * invented reviews is prohibited under India's consumer protection rules.
 * Entries marked as samples (isDemoData) show only while developing.
 */
export const testimonials = content.testimonials;

/** Reviews to display: genuine ones on the live site, samples too while developing. */
export const visibleTestimonials = testimonials.filter((t) => import.meta.env.DEV || !t.isDemoData);
