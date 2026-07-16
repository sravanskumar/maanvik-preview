# Bhagya Raju — Discovery Tracker

**Purpose:** Capture answers to CMS, payments, and GA4 discovery questions before choosing tools.  
**Sent to Bhagya Raju:** 15 July 2026 (WhatsApp)  
**Status:** 🟡 Partial — 6/7 questions answered; artefacts + Q4 pending  
**Owner:** Sravan Kumar Sindhe  
**Last updated:** 16 July 2026 (P0 on GitHub Pages preview)

---

## Discovery answers (received)

| # | Question | Answer | Notes |
|---|---|---|---|
| 1 | Who will update prices — you or office staff? | **Bhagya Raju** | Founder-owned catalogue updates |
| 2 | Comfortable with Excel/Google Sheets? (1–5) | **3 / 5** | Moderate — needs simple template + short guide |
| 3 | How often do prices change? | **2–3× per year** | Infrequent — no heavy CMS needed |
| 4 | How many products have a **fixed price** vs **price on request**? | _pending_ | Follow up — blocks checkout SKU selection |
| 5 | How do you track enquiries today? | **WhatsApp** | Primary channel; forms + CRM supplement WA |
| 6 | Budget for monthly digital tools? | **~₹1,000/month** | Workspace is main cost; rest free tier |
| 7 | Razorpay business account — started KYC? | **Not started** — **Sravan** to set up on behalf of BR after AWS/console live | BR must provide PAN, GST, bank docs |
| 8 | Price list + 10–20 fixed-price online SKUs | _pending_ | Artefacts still needed |

---

## Preliminary recommendation (15 Jul 2026)

| Area | Decision | Rationale |
|---|---|---|
| **CMS Phase 1** | **Google Sheets → data.js** | BR updates prices himself; changes 2–3×/year; Sheets comfort 3/5 — simple sheet + 30-min guide beats Decap for now |
| **CMS Phase 2** | Decap CMS only if Sheets proves painful | Not first choice given moderate Sheets comfort |
| **Airtable** | Defer | ₹1,000 budget tight once Workspace is live; infrequent updates don't justify ~₹850/mo |
| **Enquiry tracking** | **WhatsApp primary** + HubSpot Free for pipeline | Log WA + form enquiries in HubSpot; US-2.4 WhatsApp Business stays important |
| **Payments** | **Razorpay** — Sravan initiates KYC after infra | Blocked on AWS + orders@ + BR business documents; checkout SKUs still needed |
| **Checkout (EPIC-05)** | **Defer** until price list + SKU list + Q4 answer | Cannot mark checkoutEligible without fixed-price list |

**Still need from Bhagya Raju:** Q4 (fixed vs POA split) · price list · 10–20 checkout SKUs · Razorpay KYC documents (PAN, GST/shop proof, bank details)

## Architecture (TOGAF)

**Repository:** [docs/architecture/README.md](./architecture/README.md)  
**Business summary (PDF):** [Maanvik_Enterprise_Architecture.html](../Maanvik_Enterprise_Architecture.html) — for Bhagya Raju  
**Vendor handover:** [docs/architecture/Maanvik_Zachman_Matrix.html](./architecture/Maanvik_Zachman_Matrix.html)  
**ADM mapping:** Epics trace to TOGAF phases in `Maanvik_Agile_Backlog.html` → panel *TOGAF ADM*.

---

| Tool | Account email | Story | Status |
|---|---|---|---|
| Google Workspace Admin | bhagyaraju@ (login) · bhagyaraju.gurram@ (public) | US-2.2, US-2.7, US-2.8 T-2.8.1 | ✅ Done |
| Google Analytics 4 | bhagyaraju@ · `G-2N8LMEL164` | US-1.5, US-2.8 T-2.8.2 | 🟡 In HTML — test Realtime |
| Google Search Console | bhagyaraju.gurram@ | US-1.5, US-2.8 T-2.8.3 | ⬜ Queued |
| Google My Business | bhagyaraju.gurram@ | US-2.1, US-2.8 T-2.8.4 | ⬜ Queued |
| HubSpot CRM | bhagyaraju@ (Gmail connected) | US-4.2, US-2.8 T-2.8.5 | ✅ Done — disconnect unused integrations |
| Formspree | bhagyaraju@ (account) → orders@ (notifications) | US-1.4, US-2.3, US-2.8 T-2.8.7 | ✅ Wired — test E2E |
| Razorpay | orders@ | US-5.3, US-2.8 T-2.8.6 | 🟡 Sravan — after BR docs |

**Forms on site (no new forms to build):** `#contactForm` (general enquiry) + `#bulkForm` (event/bulk quote) in index.html. Formspree delivers submissions to orders@.

**Evaluated — not using:** Google Forms (off-brand; custom forms already built) · PayPal forms/checkout (Razorpay for India; B2B is quote/PO workflow)

**Supporting:** AWS (hosting) · GitHub Pages (preview) · WhatsApp Business (primary enquiry channel)

**Preview URL:** [sravanskumar.github.io/maanvik-preview](https://sravanskumar.github.io/maanvik-preview/index.html)  
**Release tags:** `p0-b2b-enquiry` (current) · `pre-p0-b2b-enquiry` (rollback)

---

## Email allocation — agreed strategy (US-2.7)

**Domain:** `maanvikhandicrafts.com`  
**One inbox:** All addresses below deliver to **Bhagya Raju Gurram**’s Gmail (same mailbox).

### Address roles (15 Jul 2026 — live)

| Address | Type | Role | Use for |
|---|---|---|---|
| **`bhagyaraju@maanvikhandicrafts.com`** | Workspace **primary** | Login + **tool account signups** | Formspree account, Gmail sign-in, transactional verification emails. **Prefer this for SaaS registration** — aliases can miss verification mail. |
| **`bhagyaraju.gurram@maanvikhandicrafts.com`** | Alias | **Professional B2B identity** | Email signature, business cards, HubSpot owner, GMB, WhatsApp Business, GA4/GSC account, public-facing founder contact. Receives inbound mail fine. |
| **`bhagya@maanvikhandicrafts.com`** | Alias | Short founder alias | Casual / shorthand; same inbox. |
| **`orders@maanvikhandicrafts.com`** | Alias (**not** a Google Group) | **Operational hub** | Website form notifications (Formspree), Razorpay, enquiry routing. User alias chosen over Group — external mail + Formspree verify work reliably. |

**Optional later (add as aliases on same user):** `sales@`, `info@`, `contact@` → same inbox as `orders@`.

### Rules (from setup)

1. **SaaS signup / verification** → `bhagyaraju@` (primary), not `.gurram` alias.
2. **Form submission notifications** → `orders@`.
3. **Public / professional display** → `bhagyaraju.gurram@`.
4. **`orders@`** = user alias on founder account — **do not** recreate as Google Group (blocks external + Formspree).
5. **Sravan (admin)** — uses BR credentials or Admin console; no separate mailbox unless a license is added later.

### Tool → email matrix

| Tool / channel | Account / owner email | Notifications / delivery | Backlog |
|---|---|---|---|
| Google Workspace admin | bhagyaraju@ (login) | — | T-2.7.2 |
| Formspree | bhagyaraju@ | Form submissions → **orders@** | T-2.7.8, T-2.8.7 |
| HubSpot CRM | bhagyaraju.gurram@ | — | T-2.7.7 |
| Razorpay | orders@ | Payment alerts → orders@ | T-2.7.9 |
| Website contact + bulk forms | — | → orders@ via Formspree | T-2.7.8 |
| WhatsApp Business profile | bhagyaraju.gurram@ | — | T-2.7.10 |
| Google My Business | bhagyaraju.gurram@ | — | T-2.7.11 |
| Instagram / Facebook | bhagyaraju.gurram@ | — | T-2.7.12 |
| GA4 property owner | bhagyaraju.gurram@ | — | T-2.7.13 |
| Google Search Console | bhagyaraju.gurram@ | — | T-2.8.3 |
| AWS root recovery | maanvikhandicrafts@gmail.com (business) + Sravan phone | — | T-6.1.0b (deferred) |

---

## Sravan — infrastructure work (in progress)

**Live tracker:** `Maanvik_Agile_Backlog.html` → panel *In progress — Sravan*

| # | Work item | Epic / Story | Status | Unblocks |
|---|---|---|---|---|
| S1 | AWS MFA + secure console access | US-6.1 (T-6.1.0) | ✅ Done (15 Jul) | Route 53, deploy, cutover |
| S1b | AWS root recovery contacts (email + phone) | US-6.1 (T-6.1.0b) | ⬜ Deferred — not blocking | MFA loss recovery; business email + Sravan phone |
| S2 | Google Workspace — domain setup | US-2.2 (T-2.2.2) | ✅ Done (15 Jul) | All domain email |
| S3 | Founder + orders@ mailboxes (US-2.7) | US-2.2, US-2.7 (T-2.7.2–4) | ✅ Done — aliases incl. orders@ on user | Formspree, HubSpot, Razorpay |
| S4 | Route 53 TXT — Workspace verify, SPF, HubSpot | US-2.2, US-4.2, US-6.3 | ✅ Verify + SPF done (15 Jul) | HubSpot DNS later |
| S5 | Route 53 MX — Google mail | US-2.2 (T-2.2.5) | ✅ Done (15 Jul) | Gmail active |
| S6 | Route 53 — DKIM, SPF, HubSpot | US-2.2, US-4.2, US-6.3 | ✅ Email DNS complete | Formspree next |
| S7 | HubSpot Free — bhagyaraju@ | US-2.7 (T-2.7.7), US-4.2 | ✅ Onboarding done | Remove accidental tool connects |
| S8 | Connect existing forms → orders@ (Formspree) | US-2.7 (T-2.7.8), US-1.4, US-2.3 | ✅ Tested E2E (contact + bulk) | mnjejnny · maqrqnqw |
| S8b | P0 B2B enquiry UX on GitHub Pages preview | US-1.2, US-1.3 | ✅ Done (16 Jul) | Quote modal, GST/Udyam, POA, real SKUs — tag `p0-b2b-enquiry` |
| S9 | Deploy redesign to AWS (replace old site) | US-6.2 | 🔴 **Blocked — catalogue prices** | Preview live; AWS cutover pending BR price list |
| S10 | DNS cutover — live domain → new site | US-6.3 | 🔴 **Blocked — catalogue** | Public go-live |
| S11 | GA4 under bhagyaraju@ | US-2.7 (T-2.7.13), US-1.5 | 🟡 Tag live — mark conversions + Realtime test | G-2N8LMEL164 |
| S12 | Email allocation per tool (matrix) | US-2.7 | ✅ Documented | See Email allocation section |
| S13 | Razorpay KYC on behalf of BR | US-5.3, T-2.8.6 | 🟡 GST + Udyam received — bank pending | Resume Razorpay upload |

**Recommended sequence:** S1–S5 ✅ → S6 (DKIM propagating) → **S8 Formspree** → S7 HubSpot → ~~S9 deploy → S10 cutover~~ **blocked on catalogue** → S11 GA4 (after S9) → S13

---

## 🔴 Go-live blocker — product catalogue (15 Jul 2026)

**Decision:** Redesign **must not** replace the live site until products are validated.

### What is not real today

| Location | Issue | Severity |
|---|---|---|
| **`index.html` featured grid** (`js/main.js`) | ~~Fabricated names~~ → **fixed (P0):** real E-X SKUs; Request Quote opens product modal | ✅ Fixed on preview |
| **`js/data.js` prices** | ₹ values in data file unverified; **display forced to POA** via `js/site-config.js` until BR signs off | 🟡 Hidden on site — still need BR price list to enable |
| **`products.html` catalogue** | SKU codes (E-X334…) + photos match **current live site** `data.js`, but prices/sizes not BR-signed-off | 🟡 Same data as production — still needs validation |

### What BR must provide before S9/S10

1. **Current price list** (any format) — replaces placeholder/POA values in `js/data.js`
2. **Confirm catalogue accuracy** — are all 140 E-X SKUs still sold? Any to hide?
3. **Q4 answer** — fixed price vs price-on-request split
4. *(Optional)* Top 12 products to feature on homepage — or approve auto-pick from validated list

### Go-live options (pick one with BR)

| Option | What ships | Catalogue |
|---|---|---|
| **A — Full hold** | Nothing until price list + sign-off | Keep live old site |
| **B — Brand shell only** | New homepage (no fake products), forms, GA4 — **no** `products.html` or link defers to current live catalogue | Partial |
| **C — Validated catalogue** | Full redesign after BR updates `data.js` via Google Sheet | Full |

**Sravan can continue:** infra (GA4 tag ready), Formspree, HubSpot — none blocked. **S9/S10 paused.**

---

## Udyam (MSME) — received 16 Jul 2026

| Field | Value |
|---|---|
| Udyam Registration No. | **UDYAM-AP-04-0033053** |
| Enterprise name | MAANVIK HANDICRAFTS |
| Major activity | Manufacturing (Micro) |
| Proprietor category | SC |
| Date of incorporation / business start | **14/07/2017** |
| Udyam registration date | 21/12/2022 |
| Registered address | 7-113, Tenali Road, Mangalagiri, Guntur, AP **522503** |
| Mobile on certificate | 7842440026 |
| Email on certificate | bhagya.gurram@gmail.com *(legacy — use domain email for Razorpay)* |
| NIC | 16299 — wood products manufacturing |
| Artefact | `udyam-certificate-maanvik.png` (original photo) · **`udyam-certificate-maanvik-print.pdf`** (enhanced for upload) |

**Note:** GST principal address (Model Industrial Park, Krishna 521111) differs from Udyam (Mangalagiri) — likely different branch/unit. Razorpay may accept; be consistent with address you declare.

**Razorpay:** Upload as **MSME (Udyam)**. Prefer also downloading official PDF from [udyamregistration.gov.in](https://udyamregistration.gov.in) (PAN + OTP) — cleaner than WhatsApp photo.

---

| Area | Questions sent | Answers received | Blocker cleared? |
|---|---|---|---|
| Product CMS (Sheets vs Decap) | 7 | **6 / 7** | **Partial** — Q4 pending; Sheets path chosen |
| Razorpay / online checkout | 1 | **1 / 1** | **Partial** — owner = Sravan; needs BR docs + SKUs |
| Artefacts (price list, checkout SKUs) | 2 | **0 / 2** | No |
| GA4 (follow-up) | — | — | Separate ask |

---

## Artefacts requested

| Item | Requested | Received | Location / notes |
|---|---|---|---|
| Current price list (any format) | ✅ Yes | ⬜ No | Save to `docs/artefacts/` when received |
| 10–20 products safe for fixed online price | ✅ Yes | ⬜ No | `docs/artefacts/checkout-skus.md` |
| Razorpay KYC documents (PAN, GST, bank) | ✅ Needed | 🟡 GST + Udyam received — bank pending | GST + Udyam in `docs/artefacts/` |

---

## Follow-up still needed

| # | Question | Why |
|---|---|---|
| Q4 | Fixed price vs POA — rough % or count | Drives checkout eligibility + sheet columns |
| F3 | WhatsApp enquiries per week (baseline) | GA4 comparison after go-live |

---

## Follow-up questions (optional — not yet sent)

| # | Question | Answer |
|---|---|---|
| F1 | Google account email for GA4 property owner? | bhagyaraju.gurram@ (via Workspace) |
| F2 | Official website URL for analytics? | maanvikhandicrafts.com (after cutover) |
| F3 | Roughly how many WhatsApp enquiries per week today? | _pending_ |
| F4 | Who photographs new products — in-house or external? | _pending_ |
| F5 | AWS hosting — who has login / can share current setup details? | Sravan — MFA done; Workspace + DNS complete |

---

## Action log

| Date | Action | By |
|---|---|---|
| 2026-07-15 | Discovery questions sent via WhatsApp | Sravan |
| 2026-07-15 | Backlog v1.4 — US-2.7 email allocation story | Sravan |
| 2026-07-15 | Backlog v1.5.1 — forms wording clarified | Sravan |
| 2026-07-15 | Discovery answers received (6/7) — Sheets CMS + Razorpay owner confirmed | Sravan |
| 2026-07-15 | TOGAF Enterprise Architecture HTML + Zachman Matrix HTML for BR/vendor handover | Sravan |
| 2026-07-15 | HubSpot onboarding complete — pipeline + properties; dashboard failed (create later) | Sravan |
| 2026-07-15 | Google Workspace live — MX, SPF, DKIM, aliases (orders@ user alias) | Sravan |
| 2026-07-15 | Formspree wired — mnjejnny + maqrqnqw → orders@; E2E tested | Sravan |
| 2026-07-15 | GA4 property G-2N8LMEL164 + tag/events in HTML (js/ga4.js) | Sravan |
| 2026-07-15 | GST registration certificate received — confirms Sole Proprietorship for Razorpay | BR → Sravan |
| 2026-07-16 | Udyam certificate received (photo) — UDYAM-AP-04-0033053 · saved to artefacts | BR → Sravan |
| 2026-07-16 | P0 B2B enquiry UX — quote modal, GST/Udyam strip, POA mode, dual catalogue CTAs | Sravan |
| 2026-07-16 | Git tags `p0-b2b-enquiry` + `pre-p0-b2b-enquiry`; pushed to GitHub Pages preview | Sravan |

---

## When answers arrive — checklist

- [x] Copy answers into table above
- [ ] Save price list to `docs/artefacts/` (or note Drive link)
- [ ] List 10–20 checkout SKUs in `docs/artefacts/checkout-skus.md`
- [x] Record CMS decision → **Google Sheets → data.js** (Phase 1)
- [x] Update `Maanvik_Agile_Backlog.html` — discovery partial complete
- [x] Update backlog v1.9 — infra progress + catalogue go-live blocker (15 Jul evening)
- [ ] Unblock Razorpay when BR provides KYC documents
- [ ] Follow up Q4 (fixed vs POA) with Bhagya Raju
- [ ] Brief Bhagya Raju on chosen path (1-page summary)

---

## Backlog mapping (epic → story → what unblocks)

| Item | Epic | Story | Backlog task(s) | Status |
|---|---|---|---|---|
| Branch phones + WhatsApp number | EPIC-01 | US-1.1, US-1.3 | T-1.1.1–3 | ⬜ Awaiting BR |
| Current price list | EPIC-01, EPIC-03 | US-1.2, US-3.3 | T-1.2.2, T-3.3.2 | ⬜ Awaiting BR |
| Q4 fixed vs POA | EPIC-03, EPIC-05 | US-3.3, US-5.1 | T-3.3.2 | ⬜ Follow-up |
| 10–20 checkout SKUs | EPIC-05 | US-5.1, US-5.3 | T-5.1.1 | ⬜ Awaiting BR |
| Razorpay KYC docs | EPIC-05 | US-5.3 | T-5.3.1, T-2.8.6 | 🟡 Sravan + BR docs |
| CMS discovery Q1–7 | EPIC-03 | US-3.3 | T-3.3.1 | ✅ 6/7 done |
| Connect forms (Formspree) | EPIC-01, EPIC-02 | US-1.4, US-2.3 | T-2.7.8 | ✅ Done — mnjejnny · maqrqnqw |
| AWS + Workspace | EPIC-02, EPIC-06 | US-2.2, US-6.1 | T-6.1.0, T-2.2.2 | ✅ Done — MFA + DNS |
| GA4 property + tag | EPIC-01 | US-1.5 | T-1.5.1–4, T-2.7.13 | 🟡 G-2N8LMEL164 in HTML |
| Catalogue go-live | EPIC-01, EPIC-06 | US-1.2, US-6.2, US-6.3 | T-1.2.2, T-1.2.6, S9/S10 | 🔴 Blocked — BR price list |
| WA Business + catalogue | EPIC-02 | US-2.4 | T-2.4.1–3 | ⬜ Awaiting BR |

**Live backlog:** `Maanvik_Agile_Backlog.html` → panels *Pending action items — Bhagya Raju* and *In progress — Sravan*

---

## Backlog mapping (outcome → tasks)

| Discovery outcome | Unlocks |
|---|---|
| Sheets 3/5 + BR updates + 2–3×/year | US-3.3 T-3.3.3–4 (Google Sheets master + sync) |
| Enquiries via WhatsApp | US-2.4 priority; HubSpot logs WA + form sources |
| Budget ₹1,000 | Free tiers: HubSpot, Formspree, GA4, GMB; Workspace primary spend |
| Razorpay → Sravan | T-5.3.1, T-2.8.6 after AWS + BR PAN/GST/bank |
| Price list received | US-1.2 T-1.2.2, US-3.3 T-3.3.2 |
| SKU list + Q4 answered | US-5.1, EPIC-05 checkout path |
