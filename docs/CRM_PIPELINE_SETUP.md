# Maanvik CRM Pipeline Setup (US-4.2)

This guide configures lead tracking from website enquiries through to delivery. The recommended tool is **HubSpot Free CRM** (per `Maanvik_Foundation_Document.html`).

## Pipeline stages

| Stage | Meaning | Typical action |
|---|---|---|
| **Enquiry** | New lead from website, WhatsApp, or phone | Log within 24 hours |
| **Quoted** | Bhagya Raju sent designs and pricing | Follow up in 48 hours if no reply |
| **Confirmed** | Customer accepted quote / issued PO | Schedule production |
| **Delivered** | Order shipped and received | Request testimonial |

## Option A — HubSpot Free CRM (recommended)

1. Create a free account at [hubspot.com](https://www.hubspot.com/products/crm).
2. Go to **Settings → Objects → Deals → Pipelines** and create pipeline **Maanvik Sales** with the four stages above.
3. Create custom deal properties:
   - `lead_source` (Website Contact / Bulk Form / Product Quote / WhatsApp / Phone / Referral)
   - `enquiry_type` (product_quote / bulk_event / general)
   - `sku` (from product quote modal)
   - `size` (from product quote modal)
   - `event_type` (from bulk form)
   - `quantity_range` (from bulk form)
   - `delivery_date` (from bulk form)
4. Connect Formspree to HubSpot (Zapier free tier, or manual copy-paste until volume grows):
   - Trigger: new Formspree submission
   - Action: create Contact + Deal in **Enquiry** stage
5. Train Bhagya Raju to move deals through stages after each customer touchpoint.

## Option B — Google Sheet CRM (interim)

Use `docs/crm-pipeline-template.csv` until HubSpot is set up.

Columns: Date, Name, Organisation, Phone, Email, Source, Event Type, Quantity, Delivery Date, Stage, Notes, Quote Amount, PO Number.

Update the **Stage** column manually: Enquiry → Quoted → Confirmed → Delivered.

## Website integration points

| Source | Form / action | CRM field mapping |
|---|---|---|
| Contact form | `index.html#contact` → Formspree `mnjejnny` | General enquiry |
| Product quote modal | `js/quote-modal.js` → Formspree `mnjejnny` | enquiry_type, sku, size, quantity, organisation |
| Bulk form | `index.html#bulk-enquiry` → Formspree `maqrqnqw` | event_type, quantity, delivery_date, customisation |
| Catalog WhatsApp | `js/catalog.js` — Enquire on WhatsApp | Log SKU + size in deal notes; GA4 `product_enquiry` |
| Catalog form | Request Quote button on `products.html` | GA4 `product_quote_open` / `product_quote_submit` |
| Floating WhatsApp | `wa.link/tvhqvx` | Source = WhatsApp |

## GA4 event reference

All events fire via `js/ga4.js` (delegated clicks + engagement observers), `js/main.js` (forms), and `js/quote-modal.js` (quote modal). Property: `G-2N8LMEL164`.

**Conversion:** `whatsapp_click`, `phone_click`, `form_submit`, `bulk_enquiry_submit`, `product_enquiry`, `product_quote_open`, `product_quote_submit`

**Engagement:** `section_view`, `scroll_depth`, `nav_click`, `catalog_search`, `catalog_load_more`

Verify on preview using GA4 Realtime — checklist in `GA4_Implementation_Lab.md` and backlog T-1.5.9.

## Weekly review (15 minutes)

- Count new enquiries by source
- List deals stuck in **Quoted** for more than 7 days
- Move **Confirmed** deals to **Delivered** after dispatch
