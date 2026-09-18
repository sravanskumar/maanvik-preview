#!/usr/bin/env python3
"""
Extract product images, sizes, and prices from Maanvik awards PDF.
Output: assets/img/product/*.jpg, docs/artefacts/awards-catalog.json, js/data.js

Requires: pymupdf, Pillow, ocrmac (macOS Vision OCR)
  PYTHONPATH=.tools/pylibs python3 scripts/extract_awards_pdf.py [pdf_path]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import fitz  # pymupdf
from ocrmac import ocrmac
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PDF = Path.home() / "Downloads" / "maanvik awards.pdf"
OUT_IMG = ROOT / "assets" / "img" / "product"
OUT_JSON = ROOT / "docs" / "artefacts" / "awards-catalog.json"
OUT_DATA = ROOT / "js" / "data.js"
STRIPS = [(0, 255), (255, 510)]
OCR_MATRIX = 4
THUMB_MATRIX = 3


def ocr_rotated_strip(page: fitz.Page, y0: float, y1: float) -> str:
    clip = fitz.Rect(0, y0, page.rect.width, y1)
    pix = page.get_pixmap(matrix=fitz.Matrix(OCR_MATRIX, OCR_MATRIX), clip=clip)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img = img.rotate(-90, expand=True)
    tmp = ROOT / "docs" / "artefacts" / "pdf-extract" / "_ocr_tmp.png"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    img.save(tmp, format="PNG")
    img = Image.open(tmp)
    img.load()
    parts = []
    for text, conf, _bbox in ocrmac.OCR(str(tmp)).recognize():
        if conf >= 0.35:
            parts.append(text)
    return "\n".join(parts)


def normalize_ocr(text: str) -> str:
    text = text.replace("thes ", "").replace("ches ", "Inches ").replace("hes ", "Inches ")
    text = re.sub(r"(\d)\s+Inches", r"\1 Inches", text)
    text = re.sub(r"Height:\s*(\d)\s*\.\s*(\d)", r"Height: \1.\2", text)
    text = re.sub(r"Height:\s*([\d.]+)\s*Inc\b", r"Height: \1 Inches", text, flags=re.I)
    text = re.sub(r"price:\s*", "Price:", text, flags=re.I)
    text = re.sub(r"Size:\s*Mediu:?", "Size: Medium", text, flags=re.I)
    text = re.sub(r"Size:\s*Smal\b", "Size: Small", text, flags=re.I)
    text = re.sub(r"Size:\s*Mec\b", "Size: Medium", text, flags=re.I)
    text = re.sub(r"Size:\s*Medi\b", "Size: Medium", text, flags=re.I)
    text = re.sub(r"[»»]", "", text)
    return text


def fix_price(value: int, size: str) -> int:
    """Fix OCR dropping trailing zero (55 → 550, 66 → 660)."""
    if value >= 100:
        return value
    if size == "Big" and value >= 28:
        return value * 10
    if size == "Medium" and value >= 20:
        return value * 10
    return value


def detect_size(block: str) -> str | None:
    if re.search(r"Size:\s*Small|\bSmal\b", block, re.I):
        return "Small"
    if re.search(r"Size:\s*Mediu|Size:\s*Medi|Size:\s*Mec|\bMediu", block, re.I):
        return "Medium"
    if re.search(r"Size:\s*Big|\bBig\b|ze:\s*Big", block, re.I):
        return "Big"
    if re.search(r"\bSilver\b", block, re.I):
        return "Silver"
    if re.search(r"\bGold\b", block, re.I):
        return "Gold"
    if re.search(r"\bBronze|\bBrnz\b", block, re.I):
        return "Bronze"
    return None


def sane_height(value: float) -> bool:
    return 4.0 <= value <= 45.0


def extract_heights(block: str) -> list[float]:
    heights: list[float] = []
    for h in re.findall(r"Height:\s*([\d.]+)", block, re.I):
        val = float(h)
        if sane_height(val) and val not in heights:
            heights.append(val)
    for h in re.findall(r"([\d.]+)\s*Inches?", block, re.I):
        val = float(h)
        if sane_height(val) and val not in heights:
            heights.append(val)
    for h in re.findall(r"1:([\d.]+)\s*Inches?", block, re.I):
        val = float(h)
        if sane_height(val) and val not in heights:
            heights.append(val)
    return heights


def extract_prices(block: str) -> list[int]:
    prices: list[int] = []
    for p in re.findall(r"Price:\s*([\d.]+)", block, re.I):
        prices.append(int(float(p)))
    for p in re.findall(r"(?:ice|e):\s*([\d.]+)", block, re.I):
        prices.append(int(float(p)))
    for p in re.findall(r"\b(\d{2,4})/-", block):
        prices.append(int(p))
    for p in re.findall(r":(\d{3,4})/-", block):
        prices.append(int(p))
    return prices


def parse_variants(combined_text: str) -> list[dict]:
    text = normalize_ocr(combined_text)
    blocks = re.split(r"(?=Size:\s*)", text, flags=re.I)
    if re.search(r"\b(Silver|Gold|Bronze)\b", text, re.I):
        blocks = re.split(r"(?=(?:Size:\s*|\b(?:Silver|Gold|Bronze)\b))", text, flags=re.I)
    if not blocks or len(blocks) == 1:
        blocks = [text]

    raw: list[dict] = []
    for block in blocks:
        size = detect_size(block)
        if not size:
            continue
        heights = extract_heights(block)
        prices = extract_prices(block)
        if not prices:
            continue
        height = heights[0] if heights else None
        price = fix_price(prices[-1], size)
        raw.append({"size": size, "heightInches": height, "price": price})

    # If strip-2 block merged Medium+Big, we may get one block with two heights/prices
    if len(raw) < 3:
        extra_blocks = re.split(r"(?:ze:\s*Big|(?:^|\n)\s*Big\b)", text, flags=re.I)
        if len(extra_blocks) > 1:
            for eb in extra_blocks[1:]:
                if any(r["size"] == "Big" for r in raw):
                    break
                heights = extract_heights(eb)
                prices = extract_prices(eb)
                if prices:
                    raw.append(
                        {
                            "size": "Big",
                            "heightInches": heights[0] if heights else None,
                            "price": fix_price(prices[0], "Big"),
                        }
                    )

    # Deduplicate by size; prefer entry with height
    by_size: dict[str, dict] = {}
    for item in raw:
        size = item["size"]
        if size not in by_size or (
            item.get("heightInches") and not by_size[size].get("heightInches")
        ):
            by_size[size] = item

    order = ["Small", "Medium", "Big", "Silver", "Gold", "Bronze"]
    variants: list[dict] = []
    for size in order:
        if size not in by_size:
            continue
        item = by_size[size]
        height = item.get("heightInches")
        if height and not sane_height(height):
            height = None
        if height:
            label = f"{height} inch ({size})"
        else:
            label = size
        variants.append(
            {
                "label": label,
                "size": size,
                "heightInches": height,
                "price": item["price"],
            }
        )

    if variants:
        return variants

    # Fallback: sequential height + price pairs (medal pages, garbled Size labels)
    heights = extract_heights(text)
    prices = extract_prices(text)
    if heights and prices:
        size_names = ["Small", "Medium", "Big", "Silver", "Gold", "Bronze"]
        pairs = list(zip(heights, prices[: len(heights)]))
        if len(prices) >= len(heights):
            # Use sorted prices with sorted heights when counts match tier pattern
            if len(heights) in (2, 3) and len(prices) >= len(heights):
                heights_sorted = sorted(heights)
                prices_sorted = sorted(prices[:3])[: len(heights)]
                pairs = list(zip(heights_sorted, prices_sorted))
        for i, (h, p) in enumerate(pairs):
            size = size_names[i] if i < len(size_names) else f"Option {i + 1}"
            variants.append(
                {
                    "label": f"{h} inch ({size})",
                    "size": size,
                    "heightInches": h,
                    "price": fix_price(p, size),
                }
            )
    return variants


def save_thumbnail(page: fitz.Page, y0: float, y1: float, dest: Path) -> None:
    clip = fitz.Rect(0, y0, page.rect.width, y1)
    pix = page.get_pixmap(matrix=fitz.Matrix(THUMB_MATRIX, THUMB_MATRIX), clip=clip)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img = img.rotate(-90, expand=True)
    # Trophy photo is left ~58% after rotation; trim text panel on the right
    w, h = img.size
    crop = img.crop((0, 0, int(w * 0.58), h))
    # Square-ish center crop for catalog grid
    cw = min(crop.size)
    left = max(0, (crop.width - cw) // 2)
    top = max(0, (crop.height - cw) // 2)
    crop = crop.crop((left, top, left + cw, top + cw))
    crop = crop.convert("RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    crop.save(dest, "JPEG", quality=88, optimize=True)


def build_data_js(products: list[dict]) -> str:
    lines = ["const productData = ["]
    for p in products:
        var_parts = []
        for v in p["variants"]:
            price = v["price"]
            if isinstance(price, str):
                price_js = json.dumps(price)
            else:
                price_js = str(int(price))
            var_parts.append(
                f'{{ label: "{v["label"]}", price: {price_js} }}'
            )
        lines.append(
            f'    {{ id: {p["id"]}, name: "{p["sku"]}", '
            f'img: "img/product/{p["image"]}", '
            f'variants: [{", ".join(var_parts)}] }},'
        )
    if lines[-1].endswith(","):
        lines[-1] = lines[-1][:-1]
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    pdf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PDF
    if not pdf_path.is_file():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 1

    doc = fitz.open(pdf_path)
    products = []
    issues = []

    for page_index in range(doc.page_count):
        page = doc[page_index]
        ocr_parts = [ocr_rotated_strip(page, y0, y1) for y0, y1 in STRIPS]
        combined = "\n".join(ocr_parts)
        variants = parse_variants(combined)

        pid = page_index + 1
        sku = f"AW-{pid:03d}"
        image = f"prd-{pid:03d}.jpg"
        thumb_path = OUT_IMG / image

        save_thumbnail(page, STRIPS[0][0], STRIPS[0][1], thumb_path)

        if not variants:
            variants = [{"label": "Price on request", "size": "Standard", "heightInches": None, "price": "POA"}]
            issues.append({"page": pid, "sku": sku, "ocr": combined, "variants": []})
        elif len(variants) < 2:
            issues.append({"page": pid, "sku": sku, "ocr": combined, "variants": variants, "note": "partial OCR"})

        products.append(
            {
                "id": pid,
                "sku": sku,
                "name": sku,
                "image": image,
                "img": f"img/product/{image}",
                "pdfPage": pid,
                "variants": variants,
                "ocrRaw": combined,
            }
        )
        print(f"Page {pid:2d}: {len(variants)} variants — {variants}")

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": str(pdf_path),
        "pageCount": doc.page_count,
        "productCount": len(products),
        "issues": issues,
        "products": [{k: v for k, v in p.items() if k != "ocrRaw"} for p in products],
    }
    OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # Write data.js (prices always in data; site-config controls display)
    OUT_DATA.write_text(build_data_js(products), encoding="utf-8")

    # Copy source PDF into artefacts for traceability
    artefact_pdf = ROOT / "docs" / "artefacts" / "maanvik-awards-catalog.pdf"
    if pdf_path.resolve() != artefact_pdf.resolve():
        artefact_pdf.write_bytes(pdf_path.read_bytes())

    print(f"\nWrote {len(products)} products")
    print(f"Images: {OUT_IMG}")
    print(f"JSON:   {OUT_JSON}")
    print(f"data.js:{OUT_DATA}")
    if issues:
        print(f"\nWarning: {len(issues)} pages need manual review (see awards-catalog.json issues)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
