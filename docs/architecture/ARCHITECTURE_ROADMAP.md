# Architecture Roadmap — Maanvik

**TOGAF Phase E (Opportunities & Solutions) + Phase F (Migration Planning)**  
**Execution artefact:** [Maanvik_Agile_Backlog.html](../../Maanvik_Agile_Backlog.html)  
**Last updated:** 16 July 2026 (P0 on GitHub Pages preview)

---

## Work packages (TOGAF) → Epics (Agile)

| Work package | TOGAF phase | Epic | Priority | Status |
|---|---|---|---|---|
| WP1 Conversion fixes | C → G | EPIC-01 | P1 | **P0 done on preview** — quote modal, GST/Udyam, POA; AWS deploy blocked on price list |
| WP2 B2B enquiry pipeline | B → G | EPIC-02 | P2 | **Mostly done** — email, forms, HubSpot live |
| WP3 Catalogue CMS | C → G | EPIC-03 | P3 | Discovery done; price list pending |
| WP4 CRM & growth | B → E | EPIC-04 | P4 | HubSpot pipeline live |
| WP5 Hybrid checkout | C → E | EPIC-05 | P2 | Blocked on artefacts |
| WP6 AWS platform | D → F | EPIC-06 | P2 | MFA + DNS done; **deploy blocked** |

---

## Migration roadmap (phased)

### Transition v0 → v1 (current — Q3 2026)

**Objective:** Enquiry-ready production site on AWS with corporate email.

| Step | Deliverable | ADM | Owner | Status |
|---|---|---|---|---|
| 1 | AWS MFA + Route 53 inventory | F | Sravan | ✅ MFA done |
| 2 | Google Workspace + mailboxes | D | Sravan | ✅ Done |
| 3 | DNS: MX, TXT, DKIM | D/F | Sravan | ✅ Done |
| 4 | Wire Formspree (2 forms) | G | Sravan | ✅ Done — mnjejnny · maqrqnqw |
| 5 | HubSpot CRM live | G | Sravan | ✅ Done — 7-stage pipeline |
| 6 | GA4 property + tag + events in HTML | G | Sravan | 🟢 G-2N8LMEL164 — conversion + engagement code on preview |
| 7 | **Validate catalogue** (price list + SKU sign-off) | C | BR + Sravan | 🔴 **Blocker** |
| 8 | Deploy redesign to S3/CloudFront | F | Sravan | 🔴 Blocked — step 7 |
| 9 | DNS cutover to new site | F | Sravan | 🔴 Blocked — step 8 |
| 10 | GA4 Admin (conversions, BR Viewer) + Search Console | G | Sravan | T-1.5.9–11 — Realtime verify on preview now; GSC after step 9 |

### Transition v1 → v2 (Q4 2026 — gated)

**Objective:** Self-service catalogue + selective checkout.

| Step | Deliverable | Gate |
|---|---|---|
| 11 | Google Sheets product master + sync | Price list from BR |
| 12 | Confirmed prices in catalogue | Price list |
| 13 | Razorpay KYC + sandbox | BR PAN/GST/bank + Sravan |
| 14 | Checkout SKUs in data.js | 10–20 SKU list + Q4 |
| 15 | Cart + Payment Links | Steps 13–14 |
| 16 | WhatsApp Business + catalogue | WA number from BR |

### Transition v2 → v3 (2027 — optional)

- Full Razorpay Checkout (Lambda)
- CI/CD automated
- GMB × 3 branches + reviews
- Click-to-WhatsApp ads

---

## Plateau diagram

```
Plateau 0 (today)     Legacy site on AWS · GitHub Pages preview with P0 enquiry UX
        │
        ▼  EPIC-06 AWS deploy BLOCKED on BR price list validation
Plateau 1 (target)    New site on AWS · GA4 live · HubSpot · validated catalogue prices
        │
        ▼  EPIC-03 + EPIC-05 (gated)
Plateau 2 (optional)  Sheets CMS · Razorpay · cart · checkout SKUs
        │
        ▼  EPIC-04 + EPIC-02.6
Plateau 3 (growth)    GMB · ads · franchise kit
```

---

## Dependencies & blockers

| Blocker | Blocks work package | Owner |
|---|---|---|
| **Price list + catalogue sign-off** | **WP6 deploy, WP1 go-live** | **Bhagya Raju** |
| Homepage fake product names | WP6 deploy | Sravan (after BR featured list) |
| Q4 fixed vs POA | WP5 checkout scope | Bhagya Raju |
| Checkout SKU list | WP5 | Bhagya Raju |
| Razorpay KYC docs | WP5 | BR provides / Sravan submits |
| Branch phones + WA # | WP1, WP2 | Bhagya Raju |
| AWS S3/CloudFront inventory | WP6 deploy prep | Sravan |

---

## Architecture vs backlog traceability

All stories in `Maanvik_Agile_Backlog.html` map to work packages above.  
Backlog v1.9 — 15 July 2026.

---

## Related

- [IMPLEMENTATION_GOVERNANCE.md](./IMPLEMENTATION_GOVERNANCE.md)  
- [../BHAGYA_RAJU_DISCOVERY.md](../BHAGYA_RAJU_DISCOVERY.md)
