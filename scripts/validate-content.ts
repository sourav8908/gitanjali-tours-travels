/**
 * Checks every file in src/content/ before a build.
 * Run: npm run validate  (also runs automatically as part of npm run build)
 *
 * Exits with an error, listing each problem in plain language, if any content
 * is invalid. The deploy then stops and the current live site stays up.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contentSchemas } from '../src/content/schema.ts';
import { contentFileNames, contentRules } from '../src/content/rules.ts';

const root = join(import.meta.dirname, '..');
const contentDir = join(root, 'src', 'content');
const problems: string[] = [];
const data: Record<string, unknown> = {};

const fail = (file: string, where: string, message: string) =>
  problems.push(`  ${file}${where ? ` → ${where}` : ''}: ${message}`);

// 1. Every file parses as JSON and matches its schema
for (const [key, schema] of Object.entries(contentSchemas)) {
  const file = contentFileNames[key as keyof typeof contentFileNames];
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
  // Content rules shared with the admin panel
  for (const problem of contentRules[key as keyof typeof contentFileNames]?.(json) ?? []) fail(file, '', problem);
}

// 2. Every referenced image exists in public/
const checkImages = (file: string, value: unknown, path: string) => {
  if (Array.isArray(value)) value.forEach((v, i) => checkImages(file, v, `${path}${i}.`));
  else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) {
      // Uploaded data: URLs only exist in demo edits, never in these files; check real paths
      if ((key === 'image' || key === 'heroImage') && typeof v === 'string' && v.startsWith('/')) {
        if (!existsSync(join(root, 'public', v))) fail(file, `${path}${key}`, `image not found: public${v}`);
      } else checkImages(file, v, `${path}${key}.`);
    }
  }
};
for (const [file, json] of Object.entries(data)) checkImages(file, json, '');

if (problems.length) {
  console.error(`\nContent check failed: ${problems.length} problem(s)\n\n${problems.join('\n')}\n`);
  process.exit(1);
}
console.log(`Content check passed (${Object.keys(contentSchemas).length} files).`);
