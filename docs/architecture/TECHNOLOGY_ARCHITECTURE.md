# Technology Architecture — Maanvik

**TOGAF Phase D:** Technology Architecture  
**Last updated:** 15 July 2026

---

## Technology stack (confirmed)

| Layer | Technology | Purpose |
|---|---|---|
| **CDN / hosting (prod)** | AWS S3 + CloudFront + ACM | Static site, HTTPS |
| **DNS** | AWS Route 53 | Domain, MX, TXT, CNAME |
| **Preview** | GitHub Pages | Staging / pitch preview |
| **CI/CD** | GitHub Actions → S3 | Automated deploy (EPIC-06 US-6.4) |
| **Compute (Phase 2b)** | AWS Lambda + API Gateway | Razorpay order API |
| **Secrets** | AWS Secrets Manager | Razorpay keys |
| **Email** | Google Workspace | bhagyaraju.gurram@, orders@ |
| **Forms** | Formspree | Static form delivery |
| **CRM** | HubSpot Free | Pipeline |
| **Analytics** | GA4 + Search Console | Conversion + SEO |
| **Payments** | Razorpay | India domestic |
| **CMS sync** | Google Sheets + script | Product data |

---

## Deployment topology

```
┌──────────────── GitHub repo ────────────────┐
│  index.html · products.html · js/ · css/    │
└────────────────────┬──────────────────────────┘
                     │ push main
                     ▼
            ┌─────────────────┐
            │ GitHub Actions  │ (planned US-6.4)
            └────────┬────────┘
                     ▼
┌────────────────────────────────────────────────────────────┐
│                        AWS (ap-south-1)                     │
│  ┌──────────┐    ┌─────────────┐    ┌──────────────────┐ │
│  │ Route 53 │───▶│ CloudFront  │───▶│ S3 static bucket │ │
│  │ DNS      │    │ CDN + ACM   │    │ maanvik prod     │ │
│  └──────────┘    └─────────────┘    └──────────────────┘ │
│       │ MX/TXT/DKIM → Google Workspace                    │
│       │ CNAME → HubSpot / DKIM                            │
│  ┌──────────┐    ┌─────────────┐                           │
│  │ Lambda   │◀──▶│ API Gateway │  (Phase 2b payments)     │
│  └──────────┘    └─────────────┘                           │
└────────────────────────────────────────────────────────────┘

┌──────────── GitHub Pages (preview) ────────────┐
│  sravanskumar.github.io/maanvik-preview/     │
└──────────────────────────────────────────────┘
```

---

## DNS record plan (Route 53)

| Record type | Purpose | When |
|---|---|---|
| TXT | Google Workspace domain verify | Workspace setup |
| TXT | SPF | Email deliverability |
| MX | Google mail servers | After verify |
| CNAME | DKIM (Google) | After MX |
| CNAME | HubSpot (if required) | HubSpot signup |
| A/ALIAS | CloudFront distribution | Site cutover |
| TXT | Search Console verify | Post-cutover |

**Rule (TP3):** Snapshot all records before changes; email records must survive site cutover.

---

## Environment matrix

| Environment | URL | Hosting | Purpose |
|---|---|---|---|
| Preview | github.io/maanvik-preview | GitHub Pages | Design review, dev test |
| Production | maanvikhandicrafts.com | AWS S3/CloudFront | Live business site |
| Formspree | formspree.io | SaaS | Form processing |
| HubSpot | app.hubspot.com | SaaS | CRM |

---

## Infrastructure work in progress (Sravan)

| Item | TOGAF | Story |
|---|---|---|
| AWS MFA + console access | Phase F/G | US-6.1 T-6.1.0 |
| Workspace + mailboxes | Phase D | US-2.2, US-2.7 |
| Route 53 DNS records | Phase D/F | US-2.2, US-6.3 |
| S3 + CloudFront deploy | Phase F | US-6.2 |
| DNS cutover | Phase F | US-6.3 |
| GitHub → AWS CI/CD | Phase G | US-6.4 |

---

## Non-functional requirements

| NFR | Target |
|---|---|
| Availability | 99.9% (CloudFront + S3 SLA) |
| Performance | Mobile PageSpeed acceptable post-WebP (US-2.5) |
| Security | MFA on AWS; HTTPS only; no secrets in repo |
| Maintainability | Static site — no server patching |
| Cost | ~₹1,000/mo tools budget (Workspace primary) |
