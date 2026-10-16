# Gitanjali Tours & Travels — Website

> **Driven by Trust • Powered by 5602**

Single-page, frontend-only website for **Gitanjali Tours & Travels**, Bhubaneswar. Built with React, TypeScript, Vite, Tailwind CSS and Leaflet/OpenStreetMap. There is no backend: every enquiry opens pre-filled in the visitor's WhatsApp, email or phone app.

## Quick start

```bash
npm install
npm run dev       # local site at http://localhost:5173 (admin at /admin/index.html)
npm run validate  # check the content files
npm run build     # validate + type-check + production build in dist/
npm run preview   # preview the production build
npm run lint
```

## Updating content

**Use the admin panel**: https://sourav8908.github.io/gitanjali-tours-travels/admin/. See [ADMIN.md](ADMIN.md) for sign-in and everyday tasks. Each save commits to `main`, and the deploy workflow checks and publishes it in 1–2 minutes.

The admin edits JSON files in `src/content/`, which you can also edit by hand:

| Content | File | Admin section |
| --- | --- | --- |
| Section on/off switches | `settings.json` | Site Settings → Page Sections |
| Phone, WhatsApp, email, address, hours, social/Google links, hero headline | `company.json` | Site Settings → Business Details |
| Services (footer and contact form) | `services.json` | Site Settings → Services List |
| Vehicles | `vehicles.json` | Fleet |
| Tour packages | `tours.json` | Tour Packages |
| Tariff tabs and cards | `pricing.json` | Rates |
| Offers | `offers.json` | Offers |
| Destination gallery and hero slideshow | `destinations.json` | Destinations |
| Customer reviews | `testimonials.json` | Reviews |
| Calculator fare rates and locations | `fare-rates.json`, `locations.json` | Distance Calculator |
| Photo attributions | `photo-credits.json` | Photo Credits |

Vehicles, tours, tariff cards, offers and destinations each have a **Hide from website** switch. The homepage stats, filter options, nav links and the contact form's vehicle list are generated from this content, so they update automatically.

### Content safety check

`src/content/schema.ts` defines the shape of every content file and is the single source of truth: the app's TypeScript types are inferred from it, and `npm run validate` (`scripts/validate-content.ts`) checks the JSON against it, plus image paths, duplicate IDs and cross-file rules. It runs in the deploy workflow before building, so a bad edit stops the deploy and the live site stays on the previous version. When adding a field, update `schema.ts` **and** `public/admin/config.yml`.

### Customer reviews

`testimonials.json` ships with **sample** entries (`isDemoData: true`). They appear only in `npm run dev`, labelled "Sample". The reviews section stays hidden on the live site until at least one real review has `isDemoData: false`. Only publish genuine reviews that customers have agreed to share (for example from your Google Business profile). Invented reviews are prohibited under India's consumer protection rules.

### Photos

Landmark and vehicle photos come from Wikimedia Commons under Creative Commons licences. The licences require the attribution shown in the footer's **Photo Credits** dialog. Photos uploaded through the admin are converted to WebP and stored in `public/images/`. If you replace a stock photo with your own, remove its credit.

### Owner notes

Hints like "Editable in Admin › Fleet" appear only in `npm run dev`. Customers never see them.

## Project structure

```
src/
  App.tsx                 Page layout: section order and modal state
  content/                Editable content (JSON) + schema.ts
  data/                   Typed loaders over content/ (filters hidden items, section settings)
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
public/
  admin/                  Sveltia CMS admin panel (index.html + config.yml)
  images/                 Photos (odisha/, vehicles/, and admin uploads)
  robots.txt, sitemap.xml, favicon.svg
```

## Distance calculator

Uses the free public OSRM router (no API key). If it's unreachable, the calculator falls back to an approximate straight-line distance, shows a "~" and a note, and draws a dashed line on the map.

## Deployment

**Live site:** https://sourav8908.github.io/gitanjali-tours-travels/

Every push to `main` builds and publishes the site automatically via GitHub Actions (`.github/workflows/deploy.yml`). Check progress in the repo's **Actions** tab. To move to a custom domain, add it under **Settings → Pages**, delete the `BASE_PATH` line in the workflow, and update the domain in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel, Netlify and GitHub Pages, custom domain DNS and HTTPS. Before going live, replace `gitanjalitravels.example.com` in `index.html`, `public/robots.txt` and `public/sitemap.xml` with your real domain, and replace the sample phone number and address in `src/data/companyInfo.ts` and in the JSON-LD block of `index.html`.
