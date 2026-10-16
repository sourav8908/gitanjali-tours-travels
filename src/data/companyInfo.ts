// Content is edited in the admin panel (/admin) or directly in src/content/company.json.
// It is checked against src/content/schema.ts by `npm run validate` before
// every build, which is why the casts below are safe.
import type { CompanyInfo } from '../types';
import company from '../content/company.json';

export const companyInfo = company as unknown as CompanyInfo;
