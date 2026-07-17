#!/usr/bin/env python3
"""Insert task-test blocks into Maanvik_Agile_Backlog.html for selected tasks."""
import re
from pathlib import Path

TESTS = {
    "T-1.1.4": """
<div class="task-test"><strong>Test steps:</strong><ol><li>On Android phone, open preview → tap header phone number</li><li>On iOS, tap floating WhatsApp button</li><li>Repeat for each branch number in Locations section</li></ol><p class="pass"><strong>Pass:</strong> Dialer opens with correct number; WhatsApp opens chat with BR-confirmed business number.</p><p class="fail"><strong>Fail:</strong> Wrong number, link does nothing, or opens generic wa.me without business account.</p></div>""",
    "T-1.2.2": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Pick 10 random SKUs from BR price list</li><li>Compare each to catalogue card on products.html</li><li>Search data.js for any remaining ₹666</li></ol><p class="pass"><strong>Pass:</strong> All 10 spot-checks match BR list; zero ₹666 placeholders remain.</p><p class="fail"><strong>Fail:</strong> Any mismatch, missing SKU, or placeholder price still visible on site.</p></div>""",
    "T-1.2.5": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Open products.html on desktop (1280px) and mobile (375px)</li><li>Scroll through all 140 cards — check price, image, layout</li><li>Load more until entire catalogue visible</li></ol><p class="pass"><strong>Pass:</strong> No broken images, truncated text, or layout overflow on any card at both breakpoints.</p><p class="fail"><strong>Fail:</strong> Any 404 image, overlapping text, or card breaks grid on mobile.</p></div>""",
    "T-1.2.7": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Homepage → Handpicked pieces → Request Quote on any SKU</li><li>Fill form with test data → submit</li><li>Repeat on products.html catalogue card</li></ol><p class="pass"><strong>Pass:</strong> Modal opens with correct SKU/size; success message shown; email arrives at orders@ with SKU in body.</p><p class="fail"><strong>Fail:</strong> Modal missing SKU, form errors, page reload, or no email within 2 minutes.</p></div>""",
    "T-1.3.3": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Desktop: products.html → Enquire on WhatsApp on E-X334</li><li>Check WhatsApp Web message before sending</li><li>Mobile: repeat — confirm app opens with same pre-fill</li></ol><p class="pass"><strong>Pass:</strong> Message contains product name, SKU, and selected size; editable before send on both platforms.</p><p class="fail"><strong>Fail:</strong> Empty message, missing size, garbled encoding, or wrong WhatsApp number.</p></div>""",
    "T-1.4.3": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Open index.html#contact with valid test data</li><li>Submit form — watch for page navigation</li></ol><p class="pass"><strong>Pass:</strong> Inline success message appears; URL unchanged; form resets or disables.</p><p class="fail"><strong>Fail:</strong> Full page redirect, no success feedback, or form stays editable after submit.</p></div>""",
    "T-1.4.5": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Preview URL → #contact → submit with name, org, phone, email, message</li><li>Check orders@ inbox within 2 minutes</li><li>Confirm GA4 Realtime shows form_submit</li></ol><p class="pass"><strong>Pass:</strong> Success message on site; email in orders@ with all fields; form_submit in Realtime within 30s.</p><p class="fail"><strong>Fail:</strong> No email, Formspree error, success message missing, or GA4 event absent.</p></div>""",
    "T-1.5.2": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Open preview → DevTools → Network → filter "collect"</li><li>Load index.html and products.html</li></ol><p class="pass"><strong>Pass:</strong> google-analytics.com/g/collect requests on both pages; no gtag console errors.</p><p class="fail"><strong>Fail:</strong> No collect requests, 404 on gtag.js, or "gtag is not defined" in console. Full lab: <code>GA4_Implementation_Lab.md</code></p></div>""",
    "T-1.5.3": """
<div class="task-test"><strong>Test steps:</strong><ol><li>GA4 → Reports → Realtime open in second tab</li><li>Click hero WhatsApp, floating button, footer WA, header WA</li><li>products.html → Enquire on WhatsApp on any card</li></ol><p class="pass"><strong>Pass:</strong> whatsapp_click with labels hero_cta, floating_button, footer, header_whatsapp; catalogue fires product_enquiry with SKU — each within 30s.</p><p class="fail"><strong>Fail:</strong> No event after 60s, wrong label, or catalogue fires whatsapp_click instead of product_enquiry.</p></div>""",
    "T-1.5.4": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Click header phone → contact phone</li><li>Submit contact form and bulk form (test data)</li><li>products.html → Request Quote → open modal → submit</li></ol><p class="pass"><strong>Pass:</strong> phone_click, form_submit, bulk_enquiry_submit, product_quote_open, product_quote_submit all appear in Realtime with correct labels.</p><p class="fail"><strong>Fail:</strong> Event fires on button click before Formspree success, or any conversion event missing/wrong label.</p></div>""",
    "T-1.5.5": """
<div class="task-test"><strong>Test steps:</strong><ol><li>GA4 Realtime open</li><li>Scroll homepage slowly through hero → contact</li><li>Load products.html and scroll to catalog section</li></ol><p class="pass"><strong>Pass:</strong> section_view fires once per section id (hero, about, bulk-enquiry, etc.); no duplicate fires on re-scroll.</p><p class="fail"><strong>Fail:</strong> Section never fires, fires multiple times for same id, or missing page-hero/catalog on products page.</p></div>""",
    "T-1.5.6": """
<div class="task-test"><strong>Test steps:</strong><ol><li>GA4 Realtime open on index.html</li><li>Scroll to 25%, 50%, 75%, 90% of page height</li><li>Repeat on products.html</li></ol><p class="pass"><strong>Pass:</strong> scroll_depth fires once at each threshold (25, 50, 75, 90) per page; percent_scrolled param matches.</p><p class="fail"><strong>Fail:</strong> Threshold skipped, fires twice at same %, or no events on products page.</p></div>""",
    "T-1.5.7": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Click nav link to #about</li><li>Click Collection → products.html</li><li>Check Realtime after each click</li></ol><p class="pass"><strong>Pass:</strong> nav_click with event_label about; nav_click with label products and link_text populated.</p><p class="fail"><strong>Fail:</strong> No nav_click, wrong section id, or products link not tracked.</p></div>""",
    "T-1.5.8": """
<div class="task-test"><strong>Test steps:</strong><ol><li>products.html → type E-X334 in search (wait 1s)</li><li>Click Load more button</li></ol><p class="pass"><strong>Pass:</strong> catalog_search with search_term E-X334 after debounce; catalog_load_more on button click — both in Realtime within 30s.</p><p class="fail"><strong>Fail:</strong> Search fires on 1 char, no debounce, or Load more not tracked.</p></div>""",
    "T-1.5.9": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Run full checklist in <code>GA4_Implementation_Lab.md</code> on preview URL</li><li>Test all conversion + engagement events (Steps 1.5 + 1.3b)</li><li>Screenshot Realtime event list for BR</li></ol><p class="pass"><strong>Pass:</strong> All 12+ event types appear in Realtime within 30s of each action; checklist signed off with date.</p><p class="fail"><strong>Fail:</strong> Any event type missing after 60s, or checklist incomplete. See lab doc for failure-mode fixes.</p></div>""",
    "T-1.5.10": """
<div class="task-test"><strong>Test steps:</strong><ol><li>GA4 Admin → Data display → Events → toggle conversions on 6 events</li><li>Admin → Property access → add bhagyaraju.gurram@ as Viewer</li><li>Log in as BR → confirm property visible</li></ol><p class="pass"><strong>Pass:</strong> Six events show as conversions; BR can open Reports → Realtime without Admin access.</p><p class="fail"><strong>Fail:</strong> Events not marked, BR cannot access property, or conversions report empty after 24h.</p></div>""",
    "T-1.5.11": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Search Console → Add property maanvikhandicrafts.com → verify via DNS TXT</li><li>Submit sitemap.xml</li><li>GA4 Admin → Product links → link Search Console</li></ol><p class="pass"><strong>Pass:</strong> Property verified; sitemap status "Success"; GA4 shows linked Search Console property.</p><p class="fail"><strong>Fail:</strong> Verification pending &gt;48h, sitemap errors, or GA4 link missing.</p></div>""",
    "T-2.2.7": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Send email from bhagyaraju.gurram@ to external Gmail address</li><li>Send email to orders@ from external address</li><li>Check spam folder on both sides</li></ol><p class="pass"><strong>Pass:</strong> Both directions deliver to inbox (not spam) within 2 minutes; SPF/DKIM pass in email headers.</p><p class="fail"><strong>Fail:</strong> Bounce, lands in spam, or orders@ alias not receiving external mail.</p></div>""",
    "T-2.3.6": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Preview → #bulk-enquiry → fill all fields (event type, qty, delivery, customisation, contact)</li><li>Submit → check orders@ inbox</li></ol><p class="pass"><strong>Pass:</strong> Confirmation on page; structured email at orders@ with all field labels; bulk_enquiry_submit in GA4 Realtime.</p><p class="fail"><strong>Fail:</strong> Missing fields in email, Formspree error, or no GA4 event on success.</p></div>""",
    "T-2.8.2": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Confirm G-2N8LMEL164 in index.html and products.html source</li><li>Run T-1.5.9 Realtime checklist on preview</li></ol><p class="pass"><strong>Pass:</strong> Tag present on both pages; all coded events verified — Admin tasks T-1.5.10 tracked separately.</p><p class="fail"><strong>Fail:</strong> Wrong measurement ID, events not firing, or code not deployed to preview. See <code>GA4_Implementation_Lab.md</code>.</p></div>""",
    "T-2.8.3": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Search Console → URL inspection on homepage after cutover</li><li>Check Pages → Indexing report after 7 days</li></ol><p class="pass"><strong>Pass:</strong> Homepage indexed; sitemap shows discovered URLs; no coverage errors on index.html and products.html.</p><p class="fail"><strong>Fail:</strong> "URL not on Google" persists &gt;14 days, or sitemap fetch error.</p></div>""",
    "T-2.8.7": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Submit contact form (mnjejnny) with test data</li><li>Submit bulk form (maqrqnqw) with test data</li><li>Check orders@ for both emails</li></ol><p class="pass"><strong>Pass:</strong> Both forms deliver to orders@ within 2 minutes on preview URL; distinct Formspree endpoints confirmed in HTML source.</p><p class="fail"><strong>Fail:</strong> Wrong endpoint ID, email to wrong inbox, or CORS/404 on submit.</p></div>""",
    "T-6.2.2": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Open CloudFront distribution URL in browser — confirm padlock</li><li>Run SSL Labs test on distribution domain</li></ol><p class="pass"><strong>Pass:</strong> HTTPS loads without certificate warning; SSL Labs grade A or A+.</p><p class="fail"><strong>Fail:</strong> Certificate mismatch, mixed content warnings, or grade below B.</p></div>""",
    "T-6.2.3": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Open products.html on CloudFront URL</li><li>DevTools → Network → filter Img — scroll full catalogue</li><li>Confirm zero 404 responses</li></ol><p class="pass"><strong>Pass:</strong> All product images return 200; index.html and products.html load from S3 origin.</p><p class="fail"><strong>Fail:</strong> Any image 404, wrong MIME type, or stale cached old site content.</p></div>""",
    "T-6.2.5": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Production URL: test contact form, bulk form, quote modal, catalogue search</li><li>Click WhatsApp + phone links</li><li>GA4 Realtime on production domain</li></ol><p class="pass"><strong>Pass:</strong> All forms submit to orders@; WA/phone work; GA4 page_view on production within 30s.</p><p class="fail"><strong>Fail:</strong> Any broken link, form failure, or GA4 not receiving production traffic.</p></div>""",
    "T-6.3.2b": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Before cutover: export Route 53 MX/TXT/DKIM records</li><li>After cutover: send test to orders@ and bhagyaraju.gurram@</li><li>Compare MX records — unchanged</li></ol><p class="pass"><strong>Pass:</strong> MX/SPF/DKIM identical pre/post cutover; both test emails deliver within 2 minutes.</p><p class="fail"><strong>Fail:</strong> MX record changed, email bounce, or Workspace mail down after cutover.</p></div>""",
    "T-6.3.5": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Every 12h for 48h: check CloudWatch/S3 access logs for 5xx</li><li>Submit one contact + bulk form per day</li><li>GA4 Realtime daily traffic check</li></ol><p class="pass"><strong>Pass:</strong> Zero 5xx errors; forms deliver; GA4 shows organic traffic; log filed in discovery doc.</p><p class="fail"><strong>Fail:</strong> Any 5xx spike, form delivery failure, or GA4 traffic drop to zero with known visits.</p></div>""",
    "T-6.4.1": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Push trivial change to main branch</li><li>Watch GitHub Actions workflow complete</li><li>Verify change live on production within 10 minutes</li></ol><p class="pass"><strong>Pass:</strong> Workflow green; S3 updated; CloudFront invalidation completes; change visible on live site.</p><p class="fail"><strong>Fail:</strong> Workflow fails, stale cache persists &gt;15 min, or deploy requires manual intervention.</p></div>""",
    "T-5.4.2": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Add test SKU to cart → checkout</li><li>Trigger Razorpay Checkout.js modal in sandbox mode</li><li>Complete test UPI payment</li></ol><p class="pass"><strong>Pass:</strong> Modal opens with correct amount; sandbox payment succeeds; redirect to success page.</p><p class="fail"><strong>Fail:</strong> Modal fails to load, wrong amount, or payment error without user-friendly message.</p></div>""",
    "T-5.4.4": """
<div class="task-test"><strong>Test steps:</strong><ol><li>Complete sandbox checkout</li><li>Land on success page</li><li>Check GA4 Realtime for purchase event</li></ol><p class="pass"><strong>Pass:</strong> Success page shows order reference; purchase event in Realtime with transaction value matching order.</p><p class="fail"><strong>Fail:</strong> No purchase event, wrong value, or failure page shown after successful payment.</p></div>""",
    "T-6.5.1": """
<div class="task-test"><strong>Test steps:</strong><ol><li>POST /api/create-order with test cart payload (sandbox)</li><li>Inspect Lambda CloudWatch logs</li><li>Confirm no Razorpay secret in response body</li></ol><p class="pass"><strong>Pass:</strong> Returns valid order_id; logs show success; response contains only order_id and public key.</p><p class="fail"><strong>Fail:</strong> 500 error, secret exposed in response/logs, or invalid order_id format.</p></div>""",
}

path = Path("Maanvik_Agile_Backlog.html")
content = path.read_text(encoding="utf-8")

# CSS
css_old = "  .task-ac li { margin-bottom: 2px; }\n  .task-tags"
css_new = """  .task-ac li { margin-bottom: 2px; }
  .task-test { margin: 6px 0 2px; font-size: 11.5px; color: #444; background: #faf7f0; border-left: 2px solid #d4c4a0; padding: 6px 10px; border-radius: 0 4px 4px 0; }
  .task-test strong { font-size: 10px; font-weight: 700; color: #5a3a18; text-transform: uppercase; letter-spacing: 0.3px; }
  .task-test ol { margin: 3px 0 4px; padding-left: 18px; }
  .task-test li { margin-bottom: 2px; }
  .task-test p { margin: 4px 0 0; font-size: 11px; }
  .task-test .pass { color: #155724; }
  .task-test .fail { color: #721c24; }
  .task-tags"""
if css_new not in content:
    content = content.replace(css_old, css_new)

# Intro
intro_old = "Each task includes <strong>acceptance criteria (AC)</strong> — testable conditions that define done for that atomic step."
intro_new = "Each task includes <strong>acceptance criteria (AC)</strong> — testable conditions that define done for that atomic step. Verification-heavy tasks also include <strong>test steps</strong> with explicit <strong>pass / fail</strong> outcomes."
if intro_new not in content:
    content = content.replace(intro_old, intro_new)

inserted = 0
skipped = 0
for tid, test_html in TESTS.items():
    if f'task-num">{tid}</div>' not in content:
        print(f"WARN: {tid} not found")
        continue
    if f'task-num">{tid}</div>' in content and test_html.strip() in content:
        skipped += 1
        continue
    pattern = (
        rf'(<div class="task-num">{re.escape(tid)}</div><div class="task-desc">'
        rf'.*?<div class="task-ac">.*?</div>)'
        rf'(<div class="task-tags">)'
    )
    def repl(m, th=test_html):
        if 'task-test' in m.group(1):
            return m.group(0)
        return m.group(1) + th + m.group(2)
    new_content, n = re.subn(pattern, repl, content, count=1, flags=re.DOTALL)
    if n:
        content = new_content
        inserted += 1
    else:
        print(f"WARN: pattern failed for {tid}")

content = content.replace("Backlog v2.1", "Backlog v2.2")
content = content.replace("Version 2.0 (July 2026)", "Version 2.2 (July 2026)")
content = content.replace(
    "Version 2.0 — GA4 conversion + engagement code complete (17 Jul); GA4 Admin + Search Console pending; S9/S10 blocked on catalogue",
    "Version 2.2 — Per-task AC on all tasks; test steps + pass/fail on verification tasks (17 Jul); S9/S10 blocked on catalogue",
)

path.write_text(content, encoding="utf-8")
print(f"Inserted test blocks: {inserted}, skipped (already present): {skipped}")
