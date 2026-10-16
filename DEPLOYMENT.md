# Custom Domain & Hosting Deployment Guide

This guide explains how to deploy the **Gitanjali Tours & Travels** website to a custom domain with free SSL/HTTPS encryption.

---

## 1. Free Static Hosting Options

The website is a pure client-side React + TypeScript application with zero backend requirements. It can be hosted for free with automatic SSL on any of the following platforms:

### Option A: Vercel (Recommended)
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Sign in to [Vercel](https://vercel.com).
3. Click **"Add New Project"** and import your repository `BAYA`.
4. Vercel automatically detects Vite. Click **"Deploy"**.
5. Once deployed, you will receive a free `*.vercel.app` live URL.

### Option B: Netlify
1. Sign in to [Netlify](https://netlify.com).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select your GitHub repository.
4. Set Build command: `npm run build` and Publish directory: `dist`.
5. Click **"Deploy site"**.

### Option C: GitHub Pages
1. In `vite.config.ts`, set `base: './'`.
2. Run `npm run build`.
3. Push the generated `dist` folder to your `gh-pages` branch.

---

## 2. Connecting a Custom Domain (e.g. `gitanjalitravels.in`)

### Step 1: Add Domain in Hosting Dashboard
- **On Vercel:** Go to Project Settings → **Domains** → Enter `yourdomain.com` (and `www.yourdomain.com`).
- **On Netlify:** Go to Site Settings → **Domain management** → **Add custom domain**.

### Step 2: Configure DNS Records at your Domain Registrar (GoDaddy / Namecheap / Hostinger)
Login to your domain provider's DNS management panel and add the following records:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` *(for Vercel)* OR `75.2.60.5` *(for Netlify)* | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` *(for Vercel)* OR `<your-site>.netlify.app` | Automatic / 3600 |

### Step 3: SSL / HTTPS Activation
- Both Vercel and Netlify will automatically provision a free Let's Encrypt SSL certificate within 15–30 minutes after DNS propagation.
- Ensure **"Always use HTTPS"** is enabled in your hosting settings.

---

## 3. Updating Business Information

All content on the website is centralized in plain TypeScript data files in `src/data/`:

- **Phone Numbers, WhatsApp & Address**: `src/data/companyInfo.ts`
- **Vehicles & Fleet Rates**: `src/data/vehicles.ts`
- **Tour Packages & Inclusions**: `src/data/tours.ts`
- **Rental Tariff Tables**: `src/data/pricing.ts`
- **Promotional Offers**: `src/data/offers.ts`

Whenever you edit these files and push to Git, your live custom domain will automatically re-build and update in seconds!
