# Admin Panel Guide

Use the admin panel to update the website (cars, prices, tours, offers, photos, contact details) without touching any code.

**Admin address:** https://sourav8908.github.io/gitanjali-tours-travels/admin/

Changes appear on the website **about 1–2 minutes after you press Save**.

---

## 1. Signing in (one-time setup)

The admin uses your GitHub account to control who can make changes. Only people with write access to the `gitanjali-tours-travels` repository can sign in.

1. While signed in to GitHub, open **https://github.com/settings/personal-access-tokens/new**.
2. Fill in:
   - **Token name:** `Gitanjali admin`
   - **Expiration:** 90 days (or a custom date). You'll need a new token when it expires.
   - **Repository access:** *Only select repositories* → choose **gitanjali-tours-travels**.
   - **Permissions → Repository permissions → Contents:** *Read and write*.
3. Click **Generate token** and copy it. It's shown only once.
4. Open the admin address above, click **Sign In Using Access Token**, and paste the token.

The browser remembers you, so next time you go straight in. **Treat the token like a password.** Don't share it or paste it anywhere else. If it leaks, delete it at https://github.com/settings/personal-access-tokens.

### Giving someone else access (for example the agency owner)

1. They create a free GitHub account.
2. In the repository, go to **Settings → Collaborators → Add people** and invite them.
3. After accepting, they follow the steps above with their own account.

---

## 2. Common tasks

| I want to… | Go to |
|---|---|
| Change phone, WhatsApp, email, address, hours | **Site Settings → Business Details** |
| Hide or show a whole section (e.g. Offers) | **Site Settings → Page Sections** |
| Add a car | **Fleet → Vehicles → Add Vehicle** (at the bottom of the list) |
| Remove a car | **Fleet → Vehicles**, open the car, use the item menu (⋮) → *Remove* |
| Hide a car for now without deleting it | open the car → turn on **Hide from website** |
| Mark a car busy | open the car → turn off **Available now** (shows "On request") |
| Change a car's price | open the car → **Starting price** (e.g. `₹19`) |
| Change tariff cards | **Rates → Rental Tariffs** |
| Change calculator fares | **Distance Calculator → Fare Rates** (keep them in step with the per-km cards under Rates) |
| Add or edit a tour | **Tour Packages** |
| Add or end an offer | **Offers** (or turn on **Hide from website**) |
| Add a customer review | **Reviews** (genuine reviews only, see below) |
| Change the hero slideshow | **Destinations** → turn **Show in hero slideshow** on or off |

**Reordering:** in any list, drag items by their handle. The order in the admin is the order on the website.

**Saving:** press **Save** at the top. Nothing goes live until you do.

---

## 3. Photos

- Click a **Photo** field → **Upload** to add a new picture, or pick one already on the site.
- Uploads are automatically resized and converted to a fast-loading format (WebP).
- Landscape photos work best for cars, tours and destinations.
- Use **your own photos** or photos you're licensed to use. Don't use pictures from Google search, news sites, or anything with a watermark.
- If you replace a stock photo with your own, remove its entry under **Photo Credits**.

---

## 4. Reviews: genuine only

Only add real reviews that customers have agreed to share (for example, copied from your Google reviews). Publishing invented reviews is prohibited under India's consumer protection rules.

Leave **Sample review** turned **off** for real reviews. The Reviews section appears on the website as soon as one real review exists.

---

## 5. If something goes wrong

**The change didn't appear.** Wait 2 minutes, then refresh the website (Ctrl+F5). To see progress, open the repository's **Actions** tab: a green tick means published.

**A red ✗ in the Actions tab.** The automatic check found a problem (for example, an empty required field or a price without a number), so the update was **not** published and the website still shows the previous version. Click the failed run → **build** → **Check content** to see a plain-English list of problems. Fix them in the admin and save again.

**Undo a change.** Every save is recorded in the repository history (**Code → Commits**). Ask your developer to revert a commit if you need an older version back.
