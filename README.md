# Maanvik — Premium Redesign

A modern, premium redesign of [maanvikhandicrafts.com](https://maanvikhandicrafts.com) — built as a high-end awards atelier. **Production still serves the legacy site on AWS.** AWS go-live remains **blocked** until Bhagya Raju validates catalogue prices.

**Preview (GitHub Pages):** [sravanskumar.github.io/maanvik-preview](https://sravanskumar.github.io/maanvik-preview/index.html)  
**Status (17 Jul 2026):** P0 B2B enquiry UX live on preview. GA4 conversion + engagement events in `js/ga4.js`. Infra complete (Workspace, DNS, Formspree, HubSpot). Tracker: `docs/BHAGYA_RAJU_DISCOVERY.md` · Backlog: `Maanvik_Agile_Backlog.html` v2.0

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
js/ga4.js           # GA4 conversion + engagement events
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
| GA4 | `G-2N8LMEL164` | `index.html` + `products.html`; `js/ga4.js` — see events below |

### GA4 events (`js/ga4.js`, `js/main.js`, `js/quote-modal.js`)

| Type | Event | Where fired |
|---|---|---|
| Conversion | `whatsapp_click` | All WA links (labels: hero_cta, contact_section, footer, floating_button, header_whatsapp) |
| Conversion | `phone_click` | tel: links (header_phone, contact_phone) |
| Conversion | `form_submit` | Contact form success (`main.js`) |
| Conversion | `bulk_enquiry_submit` | Bulk form success (`main.js`) |
| Conversion | `product_enquiry` | Catalogue WhatsApp CTA |
| Conversion | `product_quote_open` / `product_quote_submit` | Request Quote modal (`quote-modal.js`) |
| Engagement | `section_view` | Each `section[id]` when ≥35% visible |
| Engagement | `scroll_depth` | 25 / 50 / 75 / 90% scroll thresholds |
| Engagement | `nav_click` | Internal `#anchor` links and `products.html` nav |
| Engagement | `catalog_search` | Catalogue search input (debounced) |
| Engagement | `catalog_load_more` | Load more button on catalogue |

**Pending (GA4 Admin):** mark conversion events, add BR as Viewer, internal traffic filter — see backlog T-1.5.9–10 and `GA4_Implementation_Lab.md`.
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
