# Gitanjali Tours & Travels — Website

> **Driven by Trust • Powered by 5602**

Single-page, frontend-only website for **Gitanjali Tours & Travels**, Bhubaneswar. Built with React, TypeScript, Vite, Tailwind CSS and Leaflet/OpenStreetMap. There is no backend: every enquiry opens pre-filled in the visitor's WhatsApp, email or phone app.

## Quick start

```bash
npm install
npm run dev       # local site at http://localhost:5173
npm run build     # production build in dist/
npm run preview   # preview the production build
npm run lint
```

## Updating content

All text, prices and photos live in `src/data/`. You don't need to touch any component to change them.

| What to change | File |
| --- | --- |
| Phone, WhatsApp, email, address, hours, social and Google-reviews links | `src/data/companyInfo.ts` |
| Vehicles (name, seats, AC, rate, photo, availability) | `src/data/vehicles.ts` |
| Tour packages | `src/data/tours.ts` |
| Tariff cards and their tabs | `src/data/pricing.ts` |
| Offers | `src/data/offers.ts` |
| Destination gallery and hero slideshow | `src/data/destinations.ts` |
| Customer reviews | `src/data/testimonials.ts` |
| Calculator locations | `src/data/locations.ts` |
| Calculator fare rates (keep in step with `pricing.ts`) | `src/data/fareRates.ts` |
| Menu links | `src/data/navigation.ts` |
| Services list (footer and contact form) | `src/data/services.ts` |
| Photo attributions | `src/data/photoCredits.ts` |

The homepage stats, the fleet/tour filter options and the contact form's vehicle list are all generated from these files, so they update automatically.

### Customer reviews

`src/data/testimonials.ts` ships with **sample** entries (`isDemoData: true`). They appear only in `npm run dev`, labelled "Sample". The reviews section stays hidden on the live site until you add at least one real review with `isDemoData: false`. Only publish genuine reviews that customers have agreed to share (for example from your Google Business profile). Invented reviews are prohibited under India's consumer protection rules.

### Photos

Landmark and vehicle photos come from Wikimedia Commons under Creative Commons licences. The licences require the attribution shown in the footer's **Photo Credits** dialog. If you swap in your own photos (recommended for your actual cars), put them in `public/images/` and remove the matching entry from `photoCredits.ts`. WebP at around 1600px (hero) or 960px (cards) keeps the site fast.

### Owner notes

Hints like "Editable in src/data/…" appear only in `npm run dev`. Customers never see them.

## Project structure

```
src/
  App.tsx                 Page layout: section order and modal state
  data/                   All editable business content (see table above)
  types/                  Shared TypeScript types
  utils/
    enquiry.ts            WhatsApp / email / phone / directions links and message builder
    routing.ts            OSRM road routing with straight-line fallback, fare estimates
    formatters.ts         Currency and duration formatting
  hooks/                  useScrolledPast, useActiveSection (nav highlight)
  components/
    layout/               Navbar, Footer, mobile FloatingBar
    home/                 One component per page section
    modals/               Vehicle, tour, legal and photo-credit dialogs
    ui/                   Reusable pieces: SectionHeader, FilterPills, Notice, Modal,
                          Reveal (scroll animation), CountUp, KonarkWheel, TempleBorder
public/
  images/odisha/          Landmark photos (hero slideshow, destinations, tours)
  images/vehicles/        Vehicle photos
  robots.txt, sitemap.xml, favicon.svg
```

## Distance calculator

Uses the free public OSRM router (no API key). If it's unreachable, the calculator falls back to an approximate straight-line distance, shows a "~" and a note, and draws a dashed line on the map.

## Deployment

**Live site:** https://sourav8908.github.io/gitanjali-tours-travels/

Every push to `main` builds and publishes the site automatically via GitHub Actions (`.github/workflows/deploy.yml`). Check progress in the repo's **Actions** tab. To move to a custom domain, add it under **Settings → Pages**, delete the `BASE_PATH` line in the workflow, and update the domain in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel, Netlify and GitHub Pages, custom domain DNS and HTTPS. Before going live, replace `gitanjalitravels.example.com` in `index.html`, `public/robots.txt` and `public/sitemap.xml` with your real domain, and replace the sample phone number and address in `src/data/companyInfo.ts` and in the JSON-LD block of `index.html`.
