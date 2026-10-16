# Gitanjali Tours & Travels — Website

> **Driven by Trust • Powered by 5602**

Single-page, frontend-only website for **Gitanjali Tours & Travels**, Bhubaneswar. Built with React, TypeScript, Vite, Tailwind CSS and Leaflet/OpenStreetMap. There is no backend: every enquiry opens pre-filled in the visitor's WhatsApp, email or phone app.

## Quick start

```bash
npm install
npm run dev       # local site at http://localhost:5173 (admin at /admin/)
npm run validate  # check the content files
npm run build     # validate + type-check + production build in dist/
npm run preview   # preview the production build
npm run lint
```

## Updating content

Content lives in JSON files in `src/content/`, which are published with the site:

| Content | File |
| --- | --- |
| Section on/off switches | `settings.json` |
| Phone, WhatsApp, email, address, hours, social/Google links, hero headline | `company.json` |
| Services (footer and contact form) | `services.json` |
| Vehicles | `vehicles.json` |
| Tour packages | `tours.json` |
| Tariff tabs and cards | `pricing.json` |
| Offers | `offers.json` |
| Destination gallery and hero slideshow | `destinations.json` |
| Customer reviews | `testimonials.json` |
| Trip Planner pricing options, per-vehicle rates, and locations | `fare-rates.json`, `locations.json` |
| Photo attributions | `photo-credits.json` |

Vehicles, tours, tariff cards, offers and destinations each have an optional `hidden` flag. The homepage stats, filter options, nav links and the contact form's vehicle list are generated from this content.

### Admin panel (demo)

A built-in admin lives at `/admin/` (`admin/index.html` → `src/admin/`). See [ADMIN.md](ADMIN.md) for login and usage.

**It is a demo with no backend.** Edits are validated against `schema.ts` and saved in the browser's localStorage (`src/content/store.ts`), layered over the published JSON. Only that browser sees them, and the public site is unchanged. The login (`src/admin/auth.ts`) is a client-side placeholder, not security. The admin can export the full content as JSON. To move to a real database later, replace the read/save functions in `src/content/store.ts` with API calls returning the same `ContentBundle` shape, and replace `auth.ts` with real authentication.

### Content safety check

`src/content/schema.ts` (zod) is the single source of truth: the app's types are inferred from it, the admin validates edits with it, and `npm run validate` (`scripts/validate-content.ts`) checks the JSON files against it before every build and deploy, together with the shared rules in `src/content/rules.ts` (duplicate IDs, a hero slide must exist, tariff cards need a tab…). When adding a field, update `schema.ts` **and** the admin form in `src/admin/sections.tsx`. zod is only loaded by the admin page, never by the public site.

### Customer reviews

`testimonials.json` ships with **sample** entries (`isDemoData: true`). They appear only in `npm run dev`, labelled "Sample". The reviews section stays hidden on the live site until at least one real review has `isDemoData: false`. Only publish genuine reviews that customers have agreed to share (for example from your Google Business profile). Invented reviews are prohibited under India's consumer protection rules.

### Photos

Landmark and vehicle photos come from Wikimedia Commons under Creative Commons licences. The licences require the attribution shown in the footer's **Photo Credits** dialog. To publish your own photos, add them to `public/images/` and reference them from the JSON files (photos uploaded in the demo admin stay in that browser only). If you replace a stock photo with your own, remove its credit.

### Owner notes

Hints like "Editable in Admin › Fleet" appear only in `npm run dev`. Customers never see them.

## Project structure

```
src/
  App.tsx                 Page layout: section order and modal state
  content/                Content JSON, schema.ts (zod), rules.ts, store.ts (demo edits layer)
  data/                   Typed loaders over the content store (filter hidden items, section settings)
  admin/                  Demo admin panel (forms, list editor, image upload, sign-in)
  types/                  TypeScript types (content types inferred from content/schema.ts)
  utils/
    enquiry.ts            WhatsApp / email / phone / directions links and message builder
    routing.ts            OSRM road routing with straight-line fallback, fare estimates
    asset.ts              Resolves /images/... paths against the site's base URL
    formatters.ts         Currency and duration formatting
  hooks/                  useScrolledPast, useActiveSection (nav highlight)
  components/
    layout/               Navbar, Footer, mobile FloatingBar
    home/                 One component per page section
    modals/               Vehicle, tour, legal and photo-credit dialogs
    ui/                   Reusable pieces: SectionHeader, FilterPills, Notice, Modal,
                          Reveal (scroll animation), CountUp, KonarkWheel, TempleBorder
scripts/
  validate-content.ts     Content check run before every build/deploy
admin/index.html          Admin page entry (built alongside index.html)
public/
  images/                 Photos (odisha/, vehicles/)
  robots.txt, sitemap.xml, favicon.svg
```

## Trip planner

The `#calculator` section (`src/components/home/DistanceMap.tsx`) lets customers build a route (start, any stops, destination, optional return to start). The whole route goes to the free public OSRM router in one request (no API key) and comes back with per-leg distances. If OSRM is unreachable it falls back to straight-line estimates, marked "~" with a dashed line on the map (`src/utils/routing.ts`).

Fares come from `src/utils/fares.ts` using `fare-rates.json`, with three pricing options the admin can switch on or off: per km, per hour (with a km allowance per hour), and an hours + km package. The enquiry button sends the full itinerary and chosen pricing to WhatsApp.

## Deployment

**Live site:** https://sourav8908.github.io/gitanjali-tours-travels/

Every push to `main` builds and publishes the site automatically via GitHub Actions (`.github/workflows/deploy.yml`). Check progress in the repo's **Actions** tab. To move to a custom domain, add it under **Settings → Pages**, delete the `BASE_PATH` line in the workflow, and update the domain in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel, Netlify and GitHub Pages, custom domain DNS and HTTPS. Before going live, replace `gitanjalitravels.example.com` in `index.html`, `public/robots.txt` and `public/sitemap.xml` with your real domain, and replace the sample phone number and address in `src/data/companyInfo.ts` and in the JSON-LD block of `index.html`.
