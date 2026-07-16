# Maanvik — Premium Redesign

A modern, premium redesign of [maanvikhandicrafts.com](https://maanvikhandicrafts.com) — built as a high-end awards atelier. **Production still serves the legacy site on AWS.** AWS go-live remains **blocked** until Bhagya Raju validates catalogue prices.

**Preview (GitHub Pages):** [sravanskumar.github.io/maanvik-preview](https://sravanskumar.github.io/maanvik-preview/index.html)  
**Status (16 Jul 2026):** P0 B2B enquiry UX live on preview. Infra complete (Workspace, DNS, Formspree, HubSpot, GA4). Tracker: `docs/BHAGYA_RAJU_DISCOVERY.md` · Backlog: `Maanvik_Agile_Backlog.html`

## Release tags (rollback)

| Tag | Snapshot |
|---|---|
| `p0-b2b-enquiry` | Current — quote modal, GST/Udyam, POA mode, real SKUs on homepage |
| `pre-p0-b2b-enquiry` | Before P0 — no quote modal |

```bash
# Preview an older release locally
git checkout pre-p0-b2b-enquiry

# Return to latest
git checkout main
```

## Run locally

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## P0 — test on preview

| Feature | Where to test |
|---|---|
| GST + Udyam trust strip | Topbar + footer on all pages |
| Featured products (real SKUs) | Homepage → Handpicked pieces → **Request Quote** |
| Per-product quote modal | [products.html](https://sravanskumar.github.io/maanvik-preview/products.html) → **Request Quote** on any card |
| WhatsApp Enquire | Catalogue → **Enquire on WhatsApp** (SKU + size pre-filled) |
| POA pricing | All catalogue prices show **Price on request** until BR validates |
| Bulk event form | [index.html#bulk-enquiry](https://sravanskumar.github.io/maanvik-preview/index.html#bulk-enquiry) |
| Contact form | [index.html#contact](https://sravanskumar.github.io/maanvik-preview/index.html#contact) |

## Structure

```
index.html          # homepage + bulk + contact forms
products.html       # 140-SKU catalogue (mock data; POA until BR validates)
css/styles.css      # design system
js/site-config.js   # POA mode flag, GST/Udyam, Formspree endpoint
js/quote-modal.js   # per-product Request Quote modal
js/main.js          # nav, featured products, forms
js/catalog.js       # catalogue UI + dual CTAs
js/data.js          # product data (E-X334…E-X473)
js/ga4.js           # GA4 conversion events
assets/img/         # product & brand photography + logo
```

## B2B lead engine

Enquiry-led — no cart or checkout.

- **Per-product quote** — modal → Formspree (`mnjejnny`) with SKU, size, quantity
- **Catalogue WhatsApp** — pre-filled SKU + size (`js/catalog.js`)
- **Bulk enquiry** — event type, quantity, delivery date (`maqrqnqw`)
- **Contact form** — general enquiries (`mnjejnny`)
- **CRM** — `docs/CRM_PIPELINE_SETUP.md`

## Production wiring

| Service | Value | Where |
|---|---|---|
| Preview | GitHub Pages | `main` branch → `/maanvik-preview/` |
| GA4 | `G-2N8LMEL164` | `index.html` + `products.html`; `js/ga4.js` |
| Formspree contact + product quote | `mnjejnny` | Contact form + quote modal → orders@ |
| Formspree bulk | `maqrqnqw` | `#bulkForm` → orders@ |
| WhatsApp | `919133441188` / `wa.link/tvhqvx` | Catalogue + site CTAs |

Toggle indicative prices after BR sign-off: set `showIndicativePrices: true` in `js/site-config.js`.

## Before AWS go-live (still blocked)

- **Bhagya Raju:** current price list + confirm 140 SKUs still active
- Enable real prices in `site-config.js` after validation
- Compress images to WebP · `sitemap.xml` / `robots.txt` / LocalBusiness schema

## Architecture docs

`docs/architecture/` — TOGAF artefacts · `docs/ECOMMERCE_DECISION.md` — no on-site checkout for B2B
