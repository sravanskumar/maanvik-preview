/* ============================================================
   Maanvik — interactions
   ============================================================ */
(function () {
    "use strict";

    /* ---- Featured products (mock catalogue — real SKUs from data.js) ---- */
    const PRODUCTS = [
        { sku: "E-X334", img: "prd-1.jpg", cat: "trophies", size: "7.5 inch" },
        { sku: "E-X335", img: "prd-2.jpg", cat: "trophies", size: "8 inch" },
        { sku: "E-X344", img: "prd-11.jpg", cat: "trophies", size: "4 inch" },
        { sku: "E-X347", img: "prd-14.jpg", cat: "trophies", size: "4 inch" },
        { sku: "E-X339", img: "prd-6.jpg", cat: "medals", size: "7.5 inch" },
        { sku: "E-X340", img: "prd-7.jpg", cat: "medals", size: "7.5 inch" },
        { sku: "E-X341", img: "prd-8.jpg", cat: "medals", size: "7.5 inch" },
        { sku: "E-X342", img: "prd-9.jpg", cat: "medals", size: "4 inch" },
        { sku: "E-X336", img: "prd-3.jpg", cat: "mementoes", size: "7.5 inch" },
        { sku: "E-X338", img: "prd-5.jpg", cat: "mementoes", size: "7.5 inch" },
        { sku: "E-X345", img: "prd-12.jpg", cat: "mementoes", size: "4 inch" },
        { sku: "E-X349", img: "prd-16.jpg", cat: "mementoes", size: "4 inch" },
    ];

    const CAT_LABEL = {
        trophies: "Trophy",
        medals: "Medal",
        mementoes: "Memento",
    };

    function renderProducts() {
        const grid = document.getElementById("products");
        if (!grid) return;
        grid.innerHTML = PRODUCTS.map(function (p) {
            const imgPath = "assets/img/product/" + p.img;
            return (
                '<article class="product reveal" data-cat="' + p.cat + '" data-sku="' + p.sku + '">' +
                '<div class="product__img"><img loading="lazy" src="' + imgPath + '" alt="' + p.sku + '"></div>' +
                '<div class="product__body">' +
                '<div><span class="product__cat">' + CAT_LABEL[p.cat] + '</span>' +
                '<span class="product__name">' + p.sku + '</span></div>' +
                '<button type="button" class="product__enquire" data-quote-open data-sku="' + p.sku +
                '" data-size="' + p.size + '" data-img="' + imgPath + '" data-category="' + CAT_LABEL[p.cat] +
                '">Request Quote</button>' +
                '</div></article>'
            );
        }).join("");
        observeReveals();
    }

    /* ---- Filters ---- */
    function initFilters() {
        const bar = document.getElementById("filters");
        if (!bar) return;
        bar.addEventListener("click", function (e) {
            const btn = e.target.closest(".filter");
            if (!btn) return;
            bar.querySelectorAll(".filter").forEach(function (b) {
                b.classList.toggle("is-active", b === btn);
            });
            const filter = btn.dataset.filter;
            document.querySelectorAll("#products .product").forEach(function (card) {
                const show = filter === "all" || card.dataset.cat === filter;
                card.classList.toggle("is-hidden", !show);
            });
        });
    }

    /* ---- Sticky header state ---- */
    function initHeader() {
        const header = document.getElementById("header");
        if (!header) return;
        const onScroll = function () {
            header.classList.toggle("is-scrolled", window.scrollY > 20);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---- Mobile nav ---- */
    function initNav() {
        const toggle = document.getElementById("navToggle");
        const nav = document.getElementById("nav");
        if (!toggle || !nav) return;
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

    /* ---- Scroll reveal ---- */
    let revealObserver = null;
    function observeReveals() {
        const els = document.querySelectorAll(".reveal:not(.in)");
        if (!("IntersectionObserver" in window)) {
            els.forEach(function (el) { el.classList.add("in"); });
            return;
        }
        if (!revealObserver) {
            revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        }
        els.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---- Formspree AJAX submit helper ---- */
    function submitFormspree(form, noteId, onSuccess) {
        const note = document.getElementById(noteId);
        const action = form.getAttribute("action") || "";
        if (!action || action.indexOf("[FORMSPREE") !== -1) {
            if (note) {
                note.textContent = "Form is not yet connected — replace the Formspree ID placeholder.";
                note.hidden = false;
            }
            return Promise.reject(new Error("Formspree placeholder"));
        }
        return fetch(action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
        }).then(function (res) {
            if (!res.ok) throw new Error("Form submission failed");
            if (note) note.hidden = false;
            form.reset();
            if (onSuccess) onSuccess();
        });
    }

    /* ---- Contact form (Formspree) ---- */
    function initForm() {
        const form = document.getElementById("contactForm");
        if (!form) return;
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;
            submitFormspree(form, "formNote", function () {
                if (typeof gtag === "function") {
                    gtag("event", "form_submit", {
                        event_category: "conversion",
                        event_label: "contact_form",
                    });
                }
            }).catch(function () {}).finally(function () {
                if (btn) btn.disabled = false;
            });
        });
    }

    /* ---- Bulk enquiry form (Formspree) ---- */
    function initBulkForm() {
        const form = document.getElementById("bulkForm");
        if (!form) return;
        const deliveryDateInput = document.getElementById("delivery-date");
        if (deliveryDateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            deliveryDateInput.min = tomorrow.toISOString().split("T")[0];
        }
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;
            submitFormspree(form, "bulkFormNote", function () {
                if (typeof gtag === "function") {
                    gtag("event", "bulk_enquiry_submit", {
                        event_category: "conversion",
                        event_label: "bulk_form",
                        event_type: document.getElementById("event-type").value,
                        quantity: document.getElementById("quantity").value,
                    });
                }
            }).catch(function () {}).finally(function () {
                if (btn) btn.disabled = false;
            });
        });
    }

    /* ---- GA4 conversion clicks: js/ga4.js (shared) ---- */

    /* ---- Footer year ---- */
    function initYear() {
        const y = document.getElementById("year");
        if (y) y.textContent = String(new Date().getFullYear());
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderProducts();
        initFilters();
        initHeader();
        initNav();
        initForm();
        initBulkForm();
        initYear();
        observeReveals();
    });
})();
