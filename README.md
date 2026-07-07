# Maanvik — Premium Redesign (Pitch Concept)

A modern, premium concept redesign of [maanvikhandicrafts.com](https://maanvikhandicrafts.com) — built to
demonstrate how the brand could look and feel as a high-end awards atelier.

## Run it locally

No build step. Any static server works. From this folder:

```bash
python3 -m http.server 8080
```

Then open **http://localhost:8080** in a browser.

## What changed vs. the current site

**Design direction**
- Palette moved from budget orange (`#FB5B21`) to a restrained **charcoal + ivory + champagne-gold** system.
- Typography moved from the novelty *Emblema One* to an elegant **Cormorant Garamond** serif paired with **Inter**.
- Removed template gimmicks (spinning circle, half-circle sections, fade-everything) for calm, confident motion.
- A real **gold monogram logo** replaces the plain text wordmark.
- Generous whitespace, a constrained content width, and consistent image framing.

**Content & structure (same real business info)**
- Real branches, testimonials, CEO, email, phone and social links are preserved.
- Institutional clients (ANGRAU, ANU, SSV International School, SIMS) shown as a trust strip.
- Filterable featured collection, franchise call-to-action, and a working-looking enquiry form.

**Fixes baked in**
- Meta description + Open Graph tags, semantic headings, lazy-loaded images.
- Real, single WhatsApp CTA (`wa.link/tvhqvx`) instead of the broken checkout button.
- A functional contact form (opens a pre-filled email; wire to Formspree/a backend for production).

## Before production
- Replace the placeholder phone number with the correct 10-digit mobile.
- Compress images to WebP (some originals are 200–530 KB).
- Wire the contact form to a real backend or form service.
- Add `sitemap.xml` / `robots.txt` and LocalBusiness structured data.

## Structure

```
index.html          # single-page premium site
css/styles.css      # design system
js/main.js          # nav, scroll reveal, product filter, form
assets/img/         # real product & brand photography + generated logo
```
