// Content is edited in the admin panel (/admin) or directly in src/content/services.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import content from '../content/services.json';

/** Services shown in the footer and offered in the contact form. */
export const services: string[] = content;
