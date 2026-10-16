/**
 * Checks every file in src/content/ before a build.
 * Run: npm run validate  (also runs automatically as part of npm run build)
 *
 * Exits with an error, listing each problem in plain language, if any content
 * is invalid. The deploy then stops and the current live site stays up.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contentFiles } from '../src/content/schema.ts';

const root = join(import.meta.dirname, '..');
const contentDir = join(root, 'src', 'content');
const problems: string[] = [];
const data: Record<string, unknown> = {};

const fail = (file: string, where: string, message: string) =>
  problems.push(`  ${file}${where ? ` → ${where}` : ''}: ${message}`);

// 1. Every file parses as JSON and matches its schema
for (const [file, schema] of Object.entries(contentFiles)) {
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(join(contentDir, file), 'utf8'));
  } catch (error) {
    fail(file, '', `cannot be read as JSON (${(error as Error).message})`);
    continue;
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    for (const issue of result.error.issues) fail(file, issue.path.join('.'), issue.message);
  }
  data[file] = json;
}

// 2. Every referenced image exists in public/
const checkImages = (file: string, value: unknown, path: string) => {
  if (Array.isArray(value)) value.forEach((v, i) => checkImages(file, v, `${path}${i}.`));
  else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) {
      if ((key === 'image' || key === 'heroImage') && typeof v === 'string') {
        if (!existsSync(join(root, 'public', v))) fail(file, `${path}${key}`, `image not found: public${v}`);
      } else checkImages(file, v, `${path}${key}.`);
    }
  }
};
for (const [file, json] of Object.entries(data)) checkImages(file, json, '');

// 3. IDs are unique within each list
const checkUniqueIds = (file: string, list: unknown) => {
  if (!Array.isArray(list)) return;
  const seen = new Set<string>();
  for (const item of list as { id?: string }[]) {
    if (!item?.id) continue;
    if (seen.has(item.id)) fail(file, '', `duplicate id "${item.id}"`);
    seen.add(item.id);
  }
};
for (const file of ['vehicles.json', 'tours.json', 'offers.json', 'destinations.json', 'testimonials.json']) {
  checkUniqueIds(file, data[file]);
}
checkUniqueIds('pricing.json', (data['pricing.json'] as { plans?: unknown })?.plans);

// 4. Cross-file rules the page depends on
const pricing = data['pricing.json'] as { tabs?: { key: string }[]; plans?: { categoryKey: string; id: string }[] } | undefined;
if (pricing?.tabs && pricing.plans) {
  const tabKeys = new Set(pricing.tabs.map((t) => t.key));
  for (const plan of pricing.plans) {
    if (!tabKeys.has(plan.categoryKey)) fail('pricing.json', plan.id, `is in "${plan.categoryKey}" but no tab shows that category`);
  }
}

const fares = data['fare-rates.json'] as { defaultCategory?: string; rates?: { category: string }[] } | undefined;
if (fares?.rates && !fares.rates.some((r) => r.category === fares.defaultCategory)) {
  fail('fare-rates.json', 'defaultCategory', `"${fares.defaultCategory}" does not match any rate's category`);
}

const destinations = data['destinations.json'] as { inHeroSlideshow: boolean; hidden?: boolean }[] | undefined;
if (destinations && !destinations.some((d) => d.inHeroSlideshow && !d.hidden)) {
  fail('destinations.json', '', 'at least one visible destination must be in the hero slideshow');
}

if (problems.length) {
  console.error(`\nContent check failed: ${problems.length} problem(s)\n\n${problems.join('\n')}\n`);
  process.exit(1);
}
console.log(`Content check passed (${Object.keys(contentFiles).length} files).`);
