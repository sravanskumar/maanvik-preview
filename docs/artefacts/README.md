# Artefacts from Bhagya Raju

Store files received during discovery here (or note Google Drive links in `BHAGYA_RAJU_DISCOVERY.md`).

| File | Purpose | Status |
|---|---|---|
| `maanvik-awards-catalog.pdf` | Awards catalogue PDF (44 pages, products + prices) | ✅ Imported Sep 2026 |
| `trophy-product-images.zip` | Interim product photos (`product_01`…`44` → AW-001…AW-044) | ✅ In use on preview Sep 2026 |
| `awards-catalog.json` | Extracted SKUs, variants, prices, OCR issues | ✅ Generated — **BR to spot-check** |
| `price-list.*` | Spreadsheet master (if separate from PDF) | Optional |
| `checkout-skus.md` | 10–20 online checkout SKUs | Awaiting |

## Regenerate catalogue from PDF

```bash
PYTHONPATH=.tools/pylibs python3 scripts/extract_awards_pdf.py ~/Downloads/maanvik\ awards.pdf
```

Outputs:
- `assets/img/product/prd-001.jpg` … `prd-044.jpg` — product thumbnails
- `js/data.js` — site catalogue (44 products, SKU `AW-001` … `AW-044`)
- `docs/artefacts/awards-catalog.json` — full extract + `issues` array for manual fixes

**Note:** OCR is ~90% accurate. Known rows manually corrected in `js/data.js` (Sep 2026). Bhagya Raju should spot-check remaining items before AWS go-live.

Do not commit sensitive KYC documents or bank details to git.
