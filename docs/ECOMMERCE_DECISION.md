# E-commerce Decision — Maanvik Website

**Decision (July 2026):** The main Maanvik website remains **enquiry-led B2B**. No on-site cart, checkout, or payment gateway for institutional buyers.

## Rationale

Maanvik's primary customers — schools, universities, corporates, and government bodies — do not purchase via "add to cart and pay." The standard sales motion is:

**Browse → Enquire → Discuss quantity / customisation / MOQ → Quote → PO → Offline payment (NEFT / invoice)**

Building cart + Razorpay checkout on this site would add cost and maintenance without matching how institutional buyers actually buy. Prices vary by size, quantity, engraving, and material; orders are made-to-order with MOQ-based production.

## What the website does instead

- Product catalogue with indicative prices and "Price on request" for unconfirmed SKUs
- WhatsApp Enquire with product + SKU + size pre-fill
- Contact form and structured bulk enquiry form
- GA4 conversion tracking on enquiries (not purchases)
- CRM pipeline: Enquiry → Quoted → Confirmed → Delivered

## Explicitly deferred

- Shopping cart
- On-site checkout
- Razorpay / Stripe / payment gateway
- Real-time inventory sync
- Order management on the website

## When to revisit

Consider a **separate** B2C channel only if Maanvik confirms a small-order lane (1–5 pieces, fixed price, no customisation). Options at that point:

1. WhatsApp catalogue + manual payment (simplest for India)
2. Razorpay payment link sent after quote approval (not on-site checkout)
3. Separate lightweight shop (Shopify / WooCommerce) for B2C only — keep the B2B site enquiry-led

Do **not** merge B2B quote workflow and B2C checkout on one site without clear separation.

## Pitch line for Bhagya Raju

> "A professional storefront that brings institutional buyers to WhatsApp and structured enquiry forms — not a shop that takes card payments. Every serious order still goes through quote and PO, which is how your customers already work."
