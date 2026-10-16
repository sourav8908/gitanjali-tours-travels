// Content comes from src/content/ (published JSON) plus any demo edits made
// in the admin panel in this browser (see src/content/store.ts).
import { content as store } from '../content/store';

const content = store.pricing;

/** Tariff cards shown on the site (entries marked hidden are left out). */
export const pricingData = content.plans.filter((p) => !p.hidden);

/** Tabs above the tariff cards, in display order; tabs with no visible cards are dropped. */
export const pricingTabs = content.tabs.filter((tab) => pricingData.some((p) => p.categoryKey === tab.key));
