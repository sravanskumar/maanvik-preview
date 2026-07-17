# GA4 Measurement Lab
## Maanvik & Casa Craft Decor — Implement, See, Experience, Capture Failure Modes
### Sravan Kumar Sindhe | July 2026

---

## WHAT THIS LAB IS

A practical implementation guide that teaches measurement by doing — not by reading.
Each step has:
- The exact code to write
- What success looks like
- What failure looks like
- What the data means and what it does NOT mean

---

## PHASE 1 — SETUP (Do this today)

### Step 1.1 — Create GA4 Properties

**Go to:** https://analytics.google.com
**Sign in with:** Google account (use the business email once maanvik.com is set up — for now personal is fine)

**For Maanvik:**
1. Click Admin (bottom left gear icon)
2. Click Create Property
3. Property name: Maanvik Awards Website
4. Time zone: India Standard Time (UTC+5:30)
5. Currency: Indian Rupee (INR)
6. Click Next → Business size: Small → Business objective: Get baseline reports
7. Click Create
8. Choose Web → enter URL: sravanskumar.github.io/maanvik-preview
9. Stream name: Maanvik Web
10. **COPY THE MEASUREMENT ID — it looks like G-XXXXXXXXXX**

**For Casa Craft Decor:**
Repeat — separate property, separate Measurement ID.

---

### Step 1.2 — Add GA4 Tracking Code to Maanvik

**File to edit:** `index.html` in the Maanvik GitHub repo

**Find this line in index.html:**
```html
<head>
```

**Add immediately after `<head>`:**
```html
<!-- Google Analytics 4 — Maanvik -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_title': document.title,
    'page_location': window.location.href
  });
</script>
```

Replace G-XXXXXXXXXX with the real Measurement ID from Step 1.1.

**Also add to products.html** — same code, same Measurement ID (it is the same property, same website).

---

### Step 1.3 — Add Event Tracking for the Three Conversion Actions

#### WhatsApp Button Tracking

The Maanvik site has WhatsApp links in four places:
- Hero section: `Talk on WhatsApp` button
- Contact section: `Message us instantly` link
- Footer: WhatsApp link
- Floating WhatsApp button (bottom right)

**Find each WhatsApp link in index.html — they all use `https://wa.link/tvhqvx`**

**Replace each one with the tracked version:**

```html
<!-- BEFORE -->
<a href="https://wa.link/tvhqvx">Talk on WhatsApp</a>

<!-- AFTER — add onclick to each WhatsApp link -->
<a href="https://wa.link/tvhqvx" 
   target="_blank"
   onclick="gtag('event', 'whatsapp_click', {
     'event_category': 'conversion',
     'event_label': 'hero_cta',
     'value': 1
   })">Talk on WhatsApp</a>
```

**Use a different event_label for each location so you know which button people click most:**
- Hero button: `'event_label': 'hero_cta'`
- Contact section: `'event_label': 'contact_section'`
- Footer: `'event_label': 'footer'`
- Floating button: `'event_label': 'floating_button'`

#### Phone Number Click Tracking

**Find the phone number link in index.html:**
```html
<!-- BEFORE -->
<a href="tel:+913344 1188">+91 33 44 11 88</a>

<!-- AFTER -->
<a href="tel:+913344 1188"
   onclick="gtag('event', 'phone_click', {
     'event_category': 'conversion',
     'event_label': 'header_phone',
     'value': 1
   })">+91 33 44 11 88</a>
```

#### Contact Form Submission Tracking

**Find the form submit button in index.html:**
```html
<!-- BEFORE -->
<button type="submit">Send enquiry</button>

<!-- AFTER -->
<button type="submit" 
   onclick="gtag('event', 'form_submit', {
     'event_category': 'conversion',
     'event_label': 'contact_form',
     'value': 1
   })">Send enquiry</button>
```

#### Product Enquire Button Tracking (products.html)

**In catalog.js — find the Enquire button generation code**

Add the tracking event alongside the WhatsApp URL generation:
```javascript
// Add inside the enquire button onclick handler
gtag('event', 'product_enquiry', {
  'event_category': 'conversion',
  'event_label': productName,
  'product_sku': sku,
  'value': 1
});
```

---

### Step 1.3b — Engagement events (implemented in `js/ga4.js`)

Conversion events use delegated click handlers in `js/ga4.js` (not inline `onclick`). Engagement events were added 17 Jul 2026:

| Event | Trigger | Params |
|---|---|---|
| `section_view` | `IntersectionObserver` on each `section[id]` when ≥35% visible (once per section) | `event_label` = section id |
| `scroll_depth` | Scroll listener at 25, 50, 75, 90% (once per threshold per page) | `percent_scrolled` |
| `nav_click` | Click on `href="#…"` or `products.html` links | `event_label`, `link_text` |
| `catalog_search` | `#search` input on products.html (800ms debounce, min 2 chars) | `search_term` |
| `catalog_load_more` | `#loadMore` button click | `event_label: load_more` |

**Homepage sections tracked:** hero, trust, about, categories, collection, why, testimonials, franchise, locations, bulk-enquiry, contact.

**Catalogue sections tracked:** page-hero, catalog.

No GA4 Admin action required for engagement events — they appear automatically in Realtime and Explorations.

---

### Step 1.4 — Mark Events as Conversions in GA4

**In GA4 Admin:**
1. Go to Admin → Events
2. Wait 24 hours after deploying — events need to appear first
3. Find each event: whatsapp_click, phone_click, form_submit, bulk_enquiry_submit, product_enquiry, product_quote_submit
4. Toggle "Mark as conversion" for each one
5. They now appear in the Conversions report separately

---

### Step 1.5 — Verify It Is Working (Do This Immediately After Deploying)

**The real-time verification test:**

1. Open GA4 → Reports → Realtime
2. Open the Maanvik website on your mobile phone
3. Click the floating WhatsApp button
4. Watch GA4 Realtime — you should see:
   - 1 active user
   - Event: whatsapp_click
   - Within 30 seconds

**Engagement verification (preview):**

6. Scroll homepage past halfway → Realtime should show `scroll_depth` (50) and multiple `section_view` events
7. Click nav link to `#about` → `nav_click` with label `about`
8. On products.html, search `E-X334` → `catalog_search` with search_term
9. Click Load more → `catalog_load_more`

**✅ SUCCESS looks like:** The event appears in Realtime within 30 seconds of clicking.

**❌ FAILURE looks like:** Nothing appears in Realtime after 60 seconds.

---

## PHASE 2 — FAILURE MODES (What Can Go Wrong)

This is the most important section. Every failure mode here is real — encountered in enterprise implementations at scale.

---

### Failure Mode 1 — The Tracking Code Is On The Page But Not Firing

**Symptom:** Realtime shows page views but no events when you click WhatsApp.

**Causes:**
- The onclick attribute was added but the gtag function is not available yet (script loading order issue)
- The gtag script is in the wrong place — it must be in `<head>` before any onclick events
- A typo in the Measurement ID — G-XXXXXXXXXX must match exactly

**How to diagnose:**
Open browser DevTools (F12) → Console tab → click the WhatsApp button → look for errors.

If you see: `gtag is not defined` — the script is not loading before the button is clicked.

**Fix:** Move the GA4 script higher in `<head>` — it must be the very first script tag.

**Enterprise parallel:** In AEP, the same failure occurs when Adobe Launch fires before the data layer is initialised. The tag fires but the data it needs does not exist yet. Load order is the most common cause of silent tracking failures in any platform.

---

### Failure Mode 2 — Self-Visits Inflating the Data

**Symptom:** GA4 shows 50 visitors and 20 WhatsApp clicks. But you know you have been testing the site yourself 15 times.

**Cause:** GA4 is tracking you — the developer and tester — alongside real visitors. Your test clicks are counted as conversions.

**How to fix:**
In Chrome → install the GA Debugger extension → enable it → your sessions are excluded from reports.

OR — filter by IP address in GA4 Admin → Data Streams → More tagging settings → Define internal traffic → add your home IP address → Admin → Data Filters → create Internal Traffic filter.

**What bad data looks like:** Conversion rate of 40% in week 1 when the site has had no promotion. That is self-visits. Real visitor conversion rates for a new website are typically 1–5%.

**What success looks like:** After filtering your own visits — conversion rate drops to a realistic number. The drop is not failure — it is accuracy.

**Enterprise parallel:** At NN Group, the first AJO journey metrics showed 85% email open rates. It was because the QA team was opening every test email and the test traffic was not filtered. Real open rates were 23%. Unfiltered internal traffic is one of the most common causes of inflated metrics in enterprise MarTech.

---

### Failure Mode 3 — Events Fire But Conversions Are Not Recording

**Symptom:** You can see whatsapp_click events in GA4 Explore but nothing appears in the Conversions report.

**Cause:** You did not toggle "Mark as conversion" for the events in GA4 Admin.

**How to fix:** Admin → Events → toggle the conversion switch for each event.

**Note:** Conversions only record from the moment you mark them. Historical events before the toggle are not retroactively counted as conversions.

**What success looks like:** The Conversions report shows conversion events with counts matching the Events report.

---

### Failure Mode 4 — Double Counting WhatsApp Clicks

**Symptom:** GA4 shows 50 WhatsApp clicks but you only had 30 real enquiries on WhatsApp.

**Cause:** Some users click the WhatsApp button multiple times — once on mobile, once on desktop, once after refreshing. Each click fires a separate event. GA4 counts events not unique users clicking.

**How to diagnose:** In GA4 Explore — build a report showing whatsapp_click events by user. If the average events per user is above 2 — double clicking is happening.

**How to interpret correctly:** WhatsApp click events ≠ WhatsApp conversations started. A click means intent. A conversation means action. Always compare GA4 WhatsApp click count to the actual WhatsApp conversation count in WhatsApp Business. The ratio tells you how many clicks convert to conversations.

**What good looks like:** 100 WhatsApp clicks → 60 conversations started = 60% click-to-conversation rate. That is a real number to optimise.

**Enterprise parallel:** In AJO, email sends ≠ email opens ≠ email clicks ≠ conversions. Each step is a funnel with drop-off. Treating click events as conversions is the single most common measurement error in enterprise email marketing.

---

### Failure Mode 5 — Form Submit Fires Before the Form Actually Submits

**Symptom:** GA4 shows 20 form submissions but Bhagya Raju only received 8 emails from the form.

**Cause:** The onclick on the submit button fires when the button is clicked — before the form validates and submits. If the user clicks Submit but the form fails validation (missing required field, wrong email format) — the GA4 event fires but the form does not submit.

**How to fix:** Move the tracking event from onclick to the form's submit event handler — this fires only after successful validation:

```javascript
document.querySelector('form').addEventListener('submit', function(e) {
  gtag('event', 'form_submit', {
    'event_category': 'conversion',
    'event_label': 'contact_form',
    'value': 1
  });
});
```

**What success looks like:** GA4 form submit count closely matches the number of emails received by Bhagya Raju (within 10–15% — some difference is normal due to tracking blockers).

**Enterprise parallel:** This is why AJO journey entry counts rarely match AEP segment sizes exactly. The segment is evaluated at one point. The journey entry condition is evaluated at another. Events fire at the trigger point, not the completion point.

---

### Failure Mode 6 — No Data for 24–48 Hours After Installation

**Symptom:** You installed GA4 today. You check tomorrow morning. No data.

**Cause:** This is NOT a failure. GA4 standard reports have a 24–48 hour data processing delay. Only the Realtime report shows immediate data.

**What to check:** Reports → Realtime — this is the only place you see data in the first 48 hours.

**After 48 hours:** Reports → Acquisition → Traffic Acquisition — you will see where visitors came from. Reports → Engagement → Events — you will see all events including conversions.

**What failure actually looks like after 48 hours:** Zero sessions. This means the tracking code is not on the page or is not firing.

---

### Failure Mode 7 — High Traffic, Zero Conversions

**Symptom:** After 2 weeks GA4 shows 500 visitors but 0 WhatsApp clicks and 0 form submissions.

**This is not a tracking failure. This is a website failure.**

It means people are arriving but not taking action. Possible causes:
- The WhatsApp button is not visible on mobile
- The phone number is wrong (the current +91 33 44 11 88 issue)
- The form does not work (the current Formspree issue)
- Visitors are not the right audience — traffic is irrelevant

**What success looks like:** After fixing EPIC-01 issues — conversion rate improves. The before/after comparison is your proof that the fixes worked.

**This is the most valuable measurement insight you can show Bhagya Raju** — here is what the website was doing before we fixed it, here is what it does now.

---

### Failure Mode 8 — Tracking Blocked by Ad Blockers

**Symptom:** You know 100 people visited (from WhatsApp shares) but GA4 shows 60 sessions.

**Cause:** 30–40% of users — especially tech-savvy users — use ad blockers or privacy browsers that block GA4 tracking. This is normal and expected. It means GA4 always undercounts real traffic.

**Rule of thumb:** GA4 data represents approximately 60–70% of actual traffic for a typical website. For a B2B audience (who tend to be more technical) it may be 50–60%.

**What this means in practice:** Never say "we had exactly 500 visitors." Say "GA4 recorded 500 sessions — actual traffic is likely 700–800." This is intellectually honest and signals measurement sophistication.

**Enterprise parallel:** In enterprise analytics, this is called measurement loss. AEP faces the same problem — not every customer event is captured, not every device is identified. The measurement system captures a representative sample, not the complete universe. Understanding this prevents overconfident conclusions from the data.

---

## PHASE 3 — WHAT SUCCESS LOOKS LIKE (After 30 Days)

### The numbers that matter for Maanvik after 30 days:

| Metric | What to measure | Healthy range for a new B2B site |
|--------|----------------|----------------------------------|
| Sessions | Total visits | Any number — baseline only |
| Users | Unique visitors | Any number — baseline only |
| WhatsApp conversion rate | WhatsApp clicks ÷ sessions | 2–8% |
| Form conversion rate | Form submits ÷ sessions | 0.5–3% |
| Phone conversion rate | Phone clicks ÷ sessions | 0.5–2% |
| Total conversion rate | Any conversion ÷ sessions | 3–10% |
| Top traffic source | Where visitors come from | Direct and WhatsApp referral initially |
| Top landing page | Where visitors enter | Home page initially |
| Mobile vs desktop | Device split | 70–80% mobile for India B2B |

### The question that matters most after 30 days:

**Of every 100 people who visit the Maanvik website, how many take an action that could lead to a sale?**

If the answer is 0–2% — the website is not converting. Fix the EPIC-01 issues first.
If the answer is 3–5% — the website is working. Focus on getting more of the right traffic.
If the answer is above 5% — the website is working well. Start Google My Business and WhatsApp Business.

---

## THE MEASUREMENT JOURNAL — CAPTURE AS YOU GO

After each week, record:

**Week 1:**
- Sessions: ___
- WhatsApp clicks: ___
- Form submissions: ___
- Biggest surprise in the data: ___
- Failure mode encountered: ___
- What I fixed: ___

**Week 2:**
- Sessions: ___
- WhatsApp clicks: ___
- Form submissions: ___
- Change from week 1: ___
- Hypothesis for why it changed: ___

This journal becomes your evidence base — and the story you tell Bhagya Raju about what the data revealed and what you did about it.

---

## HOW TO CONTINUE IN A NEW CHAT

Say: "Search my past conversations for the GA4 Measurement Lab and help me interpret the data I am seeing" or "help me diagnose [specific issue] in GA4."

*Lab started: July 2026 | Both websites: Maanvik and Casa Craft Decor*
