/**
 * Content rules beyond field shapes (shared by `npm run validate` and the
 * admin panel). Each check returns plain-language problems; empty = OK.
 */

type Rule = (data: unknown) => string[];

/** JSON file in src/content/ for each content key. */
export const contentFileNames = {
  settings: 'settings.json',
  company: 'company.json',
  services: 'services.json',
  vehicles: 'vehicles.json',
  tours: 'tours.json',
  pricing: 'pricing.json',
  offers: 'offers.json',
  destinations: 'destinations.json',
  testimonials: 'testimonials.json',
  fareRates: 'fare-rates.json',
  locations: 'locations.json',
  photoCredits: 'photo-credits.json',
} as const;

const uniqueIds = (label: string, list: unknown): string[] => {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const problems: string[] = [];
  for (const item of list as { id?: string }[]) {
    if (!item?.id) continue;
    if (seen.has(item.id)) problems.push(`${label}: two items share the ID "${item.id}"`);
    seen.add(item.id);
  }
  return problems;
};

export const contentRules: Partial<Record<keyof typeof contentFileNames, Rule>> = {
  vehicles: (d) => uniqueIds('Vehicles', d),
  tours: (d) => uniqueIds('Tours', d),
  offers: (d) => uniqueIds('Offers', d),
  testimonials: (d) => uniqueIds('Reviews', d),

  destinations: (d) => {
    const list = (Array.isArray(d) ? d : []) as { inHeroSlideshow?: boolean; hidden?: boolean }[];
    const problems = uniqueIds('Destinations', d);
    if (!list.some((x) => x.inHeroSlideshow && !x.hidden)) {
      problems.push('At least one visible destination must be in the hero slideshow');
    }
    return problems;
  },

  pricing: (d) => {
    const pricing = d as { tabs?: { key: string; label: string }[]; plans?: { categoryKey: string; vehicleCategory: string }[] };
    const problems = uniqueIds('Tariff cards', pricing?.plans);
    const tabKeys = new Set((pricing?.tabs ?? []).map((t) => t.key));
    for (const plan of pricing?.plans ?? []) {
      if (!tabKeys.has(plan.categoryKey)) {
        problems.push(`Tariff card "${plan.vehicleCategory}" is in a category that has no tab, so it would never be shown`);
      }
    }
    return problems;
  },

  fareRates: (d) => {
    const fares = d as {
      defaultCategory?: string;
      defaultMode?: string;
      modes?: Record<string, boolean>;
      rates?: { category: string }[];
    };
    const problems: string[] = [];
    if (fares?.rates?.length && !fares.rates.some((r) => r.category === fares.defaultCategory)) {
      problems.push(`"Pre-selected vehicle" (${fares.defaultCategory}) doesn't match any rate's category name`);
    }
    if (fares?.modes && !Object.values(fares.modes).some(Boolean)) {
      problems.push('Turn on at least one pricing option for customers');
    } else if (fares?.modes && fares.defaultMode && !fares.modes[fares.defaultMode]) {
      problems.push('The pre-selected pricing option is switched off; choose one that is on');
    }
    return problems;
  },
};
