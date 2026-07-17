# Information Systems Architecture — Maanvik

**TOGAF Phase C:** Application Architecture + Data Architecture  
**Last updated:** 15 July 2026

---

## Application landscape

| Application | Type | Role | Integration |
|---|---|---|---|
| **Maanvik website** | Static SPA (HTML/CSS/JS) | Brand, catalogue, forms | S3/CloudFront, Formspree, GA4 |
| **Formspree** | SaaS form backend | Delivers form submissions → email | 2 endpoints → orders@ |
| **HubSpot CRM** | SaaS CRM | Enquiry → Delivered pipeline | Gmail sync; Zapier optional |
| **Google Analytics 4** | SaaS analytics | Conversion events | gtag.js on site |
| **Google Search Console** | SaaS SEO | Indexing, sitemap | Same Google account |
| **Google Workspace** | Identity + email | Domain mail, GA4 owner | MX/TXT in Route 53 |
| **Google Sheets** | CMS (Phase 1) | Product master | Sync → data.js |
| **Razorpay** | Payment gateway | UPI/cards (Phase 2) | Payment Links → Lambda (2b) |
| **WhatsApp Business** | Messaging | Primary enquiry channel | wa.me links, catalogue |
| **GitHub Pages** | Static hosting | Preview/staging | Separate from production |

---

## Application architecture (logical)

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation layer                        │
│  index.html · products.html · css/ · js/main.js · catalog.js │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    Client logic layer                        │
│  Navigation · reveal · form AJAX · WA pre-fill · filters    │
│  Cart (Phase 2) · GA4 events                                │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
 ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 │  data.js    │     │  Formspree  │     │  gtag GA4   │
 │  (catalogue)│     │  (forms)    │     │  (analytics)│
 └──────┬──────┘     └──────┬──────┘     └─────────────┘
        │                   │
        ▼                   ▼
 ┌─────────────┐     ┌─────────────┐
 │ Google      │     │  orders@    │
 │ Sheets      │     │  inbox      │
 │ (CMS source)│     └──────┬──────┘
 └─────────────┘            ▼
                      ┌─────────────┐
                      │  HubSpot    │
                      │  CRM        │
                      └─────────────┘
```

---

## Data architecture

### Product data (canonical source → Phase 1)

| Entity | Attributes | Source | Consumer |
|---|---|---|---|
| Product | SKU, name, category, sizes, price/POA, image, checkoutEligible, moq | Google Sheets | `js/data.js` → catalog.js |
| Category | id, label, filter | data.js | products.html filter UI |

**Sync pattern:** Sheet export → build script → `data.js` on deploy (GitHub Action or AWS build step).

### Enquiry data

| Entity | Source | Store |
|---|---|---|
| Contact enquiry | Formspree → orders@ email | HubSpot deal (manual/Zapier) |
| Bulk enquiry | Formspree → orders@ email | HubSpot deal with custom fields |
| WA enquiry | WhatsApp | Manual log in HubSpot |
| Order (Phase 2) | Razorpay webhook | orders@ + HubSpot |

### Reference data (in code today)

- 140 products in `js/data.js`
- POA placeholders applied where price unconfirmed
- Checkout SKUs: pending in `docs/artefacts/checkout-skus.md`

---

## Application interfaces

| From | To | Protocol | Status |
|---|---|---|---|
| Browser | Formspree | HTTPS POST (AJAX) | Placeholder IDs |
| Browser | WhatsApp | wa.me deep link | Placeholder number |
| Browser | GA4 | gtag events | Live on GitHub Pages preview |
| Build | S3 | AWS CLI / GitHub Actions | Queued |
| Sheet | data.js | Node/Python sync script | Not built |
| Razorpay | Lambda webhook | HTTPS POST | Phase 2b |

---

## Security (application layer)

- Form honeypot (`_gotcha`) on both forms
- No API secrets in client-side JS
- Formspree rate limiting (SaaS)
- HTTPS only on production (ACM cert)

---

## CMS decision (Phase C)

**Confirmed:** Google Sheets → data.js  
**Rationale:** Discovery Q1–3, Q6 — see [../BHAGYA_RAJU_DISCOVERY.md](../BHAGYA_RAJU_DISCOVERY.md)
