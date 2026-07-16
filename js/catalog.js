/* ============================================================
   Maanvik — full catalog (products.html)
   Depends on the global `productData` array from js/data.js
   ============================================================ */
(function () {
    "use strict";

    const cfg = window.MaanvikConfig || {};
    const WHATSAPP_PHONE = cfg.whatsappPhone || "919133441188";
    const SHOW_PRICES = cfg.showIndicativePrices === true;
    const PAGE_SIZE = 24;

    function getWhatsAppEnquiryURL(productName, sku, selectedSize) {
        const message =
            "Hi Maanvik! I am interested in " + productName +
            " (SKU: " + sku + ", Size: " + selectedSize +
            "). Please share pricing and availability.";
        return "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(message);
    }

    // data.js declares `const productData` (a lexical global, not a window property),
    // so reference it directly rather than via window.
    const source = (typeof productData !== "undefined") ? productData : [];
    const all = Array.isArray(source) ? source.slice() : [];
    let filtered = all.slice();
    let shown = 0;

    const grid = document.getElementById("catalog");
    const countEl = document.getElementById("count");
    const emptyEl = document.getElementById("empty");
    const moreBtn = document.getElementById("loadMore");
    const searchEl = document.getElementById("search");

    function formatPrice(price) {
        if (!SHOW_PRICES || price === "POA" || price === 0 || price === "0") {
            return '<span class="price-poa">Price on request</span>';
        }
        return '<span class="price">₹' + Number(price).toLocaleString("en-IN") + "</span>";
    }

    function assetPath(img) {
        // data.js stores paths like "img/product/prd-1.jpg"
        return img.indexOf("assets/") === 0 ? img : "assets/" + img;
    }

    function cardHTML(item) {
        const first = item.variants[0];
        const sizes = item.variants
            .map(function (v, i) {
                return (
                    '<button class="size' + (i === 0 ? " is-active" : "") + '" data-price="' +
                    v.price + '">' + v.label + "</button>"
                );
            })
            .join("");
        const waUrl = getWhatsAppEnquiryURL(item.name, item.name, first.label);
        const imgPath = assetPath(item.img);
        return (
            '<article class="pcard reveal" data-id="' + item.id + '" data-sku="' + item.name + '">' +
            '<div class="pcard__img"><img loading="lazy" src="' + imgPath +
            '" alt="' + item.name + '"></div>' +
            '<div class="pcard__body">' +
            '<span class="pcard__code">' + item.name + "</span>" +
            '<span class="pcard__price" data-price>' + formatPrice(first.price) + "</span>" +
            '<p class="pcard__moq">Bulk pricing from 26+ pieces · custom engraving available</p>' +
            '<div class="pcard__sizes">' + sizes + "</div>" +
            '<div class="pcard__actions">' +
            '<button type="button" class="btn btn--gold btn--sm btn--block pcard__quote" data-quote-open' +
            ' data-sku="' + item.name + '" data-size="' + first.label + '" data-img="' + imgPath + '">' +
            "Request Quote</button>" +
            '<a class="btn btn--ghost btn--sm btn--block pcard__cta" target="_blank" rel="noopener" href="' +
            waUrl + '">Enquire on WhatsApp</a>' +
            "</div></div></article>"
        );
    }

    function render(reset) {
        if (reset) {
            grid.innerHTML = "";
            shown = 0;
        }
        const next = filtered.slice(shown, shown + PAGE_SIZE);
        const html = next.map(cardHTML).join("");
        grid.insertAdjacentHTML("beforeend", html);
        shown += next.length;

        emptyEl.hidden = filtered.length !== 0;
        countEl.textContent = filtered.length
            ? "Showing " + shown + " of " + filtered.length + " pieces"
            : "";
        moreBtn.style.display = shown < filtered.length ? "" : "none";

        if (window.__revealObserve) window.__revealObserve();
        else grid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }

    /* Size selection updates price and WhatsApp pre-fill */
    function initSizeAndCta() {
        grid.addEventListener("click", function (e) {
            const size = e.target.closest(".size");
            if (!size) return;
            const card = size.closest(".pcard");
            card.querySelectorAll(".size").forEach(function (b) {
                b.classList.toggle("is-active", b === size);
            });
            const priceEl = card.querySelector("[data-price]");
            if (priceEl) priceEl.innerHTML = formatPrice(size.dataset.price);
            const sku = card.dataset.sku || "";
            const sizeLabel = size.textContent.trim();
            const cta = card.querySelector(".pcard__cta");
            if (cta) {
                cta.href = getWhatsAppEnquiryURL(sku, sku, sizeLabel);
            }
            const quoteBtn = card.querySelector(".pcard__quote");
            if (quoteBtn) {
                quoteBtn.dataset.size = sizeLabel;
            }
        });
    }

    /* Debounced search by SKU / name */
    function initSearch() {
        let t = null;
        searchEl.addEventListener("input", function () {
            clearTimeout(t);
            t = setTimeout(function () {
                const q = searchEl.value.trim().toLowerCase();
                filtered = q
                    ? all.filter(function (p) { return p.name.toLowerCase().indexOf(q) !== -1; })
                    : all.slice();
                render(true);
            }, 140);
        });
    }

    function initMore() {
        moreBtn.addEventListener("click", function () { render(false); });
    }

    /* Lightweight reveal observer shared with cards */
    function initReveal() {
        if (!("IntersectionObserver" in window)) {
            window.__revealObserve = function () {
                document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { el.classList.add("in"); });
            };
            return;
        }
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
        window.__revealObserve = function () {
            document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { obs.observe(el); });
        };
    }

    /* Header + nav + year (shared behaviour) */
    function initChrome() {
        const toggle = document.getElementById("navToggle");
        const nav = document.getElementById("nav");
        if (toggle && nav) {
            const close = function () {
                nav.classList.remove("is-open");
                toggle.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                document.body.classList.remove("menu-open");
            };
            toggle.addEventListener("click", function () {
                const open = nav.classList.toggle("is-open");
                toggle.classList.toggle("is-open", open);
                toggle.setAttribute("aria-expanded", String(open));
                document.body.classList.toggle("menu-open", open);
            });
            nav.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", close);
            });
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape") close();
            });
            document.addEventListener("click", function (e) {
                if (nav.classList.contains("is-open") &&
                    !nav.contains(e.target) && !toggle.contains(e.target)) {
                    close();
                }
            });
        }
        const y = document.getElementById("year");
        if (y) y.textContent = String(new Date().getFullYear());
    }

    document.addEventListener("DOMContentLoaded", function () {
        initReveal();
        initChrome();
        if (!all.length) {
            emptyEl.hidden = false;
            emptyEl.textContent = "Catalog failed to load.";
            moreBtn.style.display = "none";
            return;
        }
        initSizeAndCta();
        initSearch();
        initMore();
        render(true);
    });
})();
