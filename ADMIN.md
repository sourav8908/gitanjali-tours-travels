# Admin Panel (Demo)

**Address:** https://sourav8908.github.io/gitanjali-tours-travels/admin/

| Username | Password |
|---|---|
| `admin` | `gitanjali@5602` |

> **Demo mode.** Everything you change is saved **only in the browser you're using** (its local storage). The public website that customers see does not change. Open the website in the same browser to preview your edits. The login is for demonstration only and isn't secure, because anyone can read it in the page code. Real accounts and saving for everyone will come with a database later.

---

## What you can do

| Group | Section | What it controls |
|---|---|---|
| | **Dashboard** | Overview, quick links, storage used, export and reset |
| Business | **Business Details** | Name, hero headline, phone, WhatsApp, email, hours, address, Google reviews and social links |
| | **Page Sections** | Show or hide whole sections. Hidden sections leave the menu too |
| | **Services** | Services listed in the footer and the contact form |
| Catalogue | **Fleet** | Add, edit, delete and reorder cars; price, seats, AC, fuel, photo; **Available** and **Visible** switches |
| | **Tour Packages** | Add, edit, delete and reorder tours |
| | **Destinations** | Destination gallery and which ones rotate in the hero slideshow |
| | **Offers** | Special offers, each with a Visible switch |
| Pricing | **Trip Planner Pricing** | Which pricing options customers can choose (**per km**, **per hour**, **hours + km package**) and each vehicle's rates |
| | **Tariff Cards** | The cards in the Rental Tariffs section and their tabs |
| | **Locations** | Places customers can pick as start, stops and destination |
| Customers | **Reviews** | Customer reviews (genuine ones only) |

### Trip Planner pricing

On the website, customers build a trip (start → any stops → destination, optionally back to start) and choose how to pay:

- **Per km**: distance × rate per km (minimum km applies; long trips add a driver allowance).
- **Per hour**: hours × hourly rate (minimum hours apply). Each hour includes a km allowance; km beyond it are charged at the extra-km rate, so long trips can't be booked cheaply by the hour.
- **Hours + km package**: e.g. 8 hr / 80 km for a fixed price, then extra km and extra hours.

For the hourly options the planner suggests the hours (drive time plus the waiting time per stop you set) and the customer can adjust them. Switch options on or off and set every rate under **Pricing → Trip Planner Pricing**. The rates included now are **samples**; replace them with your real prices.

## How editing works

1. Open a section, change things (use **Edit** on an item, or **Add …** for a new one).
2. Press **Save changes** in the bar that appears at the bottom of the screen. Nothing is kept until you save.
   - If something is missing or wrong, you'll see a red list explaining what to fix.
   - **Discard** undoes everything since your last save.
3. Open **View website** to see the result in the same browser. An amber **"Demo edits active"** badge shows on the site while you have edits.
4. **Reset** (top of each section, once edited) or **Reset all edits** (Dashboard) returns to the original content.

**Photos:** *Upload photo* resizes your picture and keeps it in the browser. *Choose from site* picks one of the website's existing photos. Browser storage holds about 5 MB in total, so a handful of uploaded photos at most.

**Export:** Dashboard → *Export content (JSON)* downloads every section with your edits applied, ready to load into a database later.

## Notes

- Edits live in one browser on one device. Another computer, phone, or a private window won't see them, and clearing browsing data removes them.
- Only add **genuine** reviews customers agreed to share. Invented reviews are illegal in India.
