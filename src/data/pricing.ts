// Content is edited in the admin panel (/admin) or directly in src/content/pricing.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { PricingContent } from '../types';
import pricing from '../content/pricing.json';

const content = pricing as unknown as PricingContent;

/** Tariff cards shown on the site (entries marked hidden are left out). */
export const pricingData = content.plans.filter((p) => !p.hidden);

/** Tabs above the tariff cards, in display order; tabs with no visible cards are dropped. */
export const pricingTabs = content.tabs.filter((tab) => pricingData.some((p) => p.categoryKey === tab.key));
