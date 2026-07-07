/* ============================================================
   Maanvik — interactions
   ============================================================ */
(function () {
    "use strict";

    /* ---- Featured products (curated demo set) ---- */
    const PRODUCTS = [
        { img: "prd-1.jpg", name: "Laurel Trophy", cat: "trophies" },
        { img: "prd-2.jpg", name: "Crest Trophy", cat: "trophies" },
        { img: "prd-11.jpg", name: "Summit Award", cat: "trophies" },
        { img: "prd-14.jpg", name: "Pinnacle Cup", cat: "trophies" },
        { img: "prd-6.jpg", name: "Victory Medal", cat: "medals" },
        { img: "prd-7.jpg", name: "Honour Medal", cat: "medals" },
        { img: "prd-8.jpg", name: "Merit Medal", cat: "medals" },
        { img: "prd-9.jpg", name: "Champion Medal", cat: "medals" },
        { img: "prd-3.jpg", name: "Heritage Memento", cat: "mementoes" },
        { img: "prd-5.jpg", name: "Crystal Keepsake", cat: "mementoes" },
        { img: "prd-12.jpg", name: "Felicitation Shield", cat: "mementoes" },
        { img: "prd-16.jpg", name: "Legacy Plaque", cat: "mementoes" },
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
            return (
                '<article class="product reveal" data-cat="' + p.cat + '">' +
                '<div class="product__img"><img loading="lazy" src="assets/img/product/' + p.img + '" alt="' + p.name + '"></div>' +
                '<div class="product__body">' +
                '<div><span class="product__cat">' + CAT_LABEL[p.cat] + '</span>' +
                '<span class="product__name">' + p.name + '</span></div>' +
                '<a class="product__enquire" href="#contact">Enquire</a>' +
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
        };
        toggle.addEventListener("click", function () {
            const open = nav.classList.toggle("is-open");
            toggle.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", String(open));
        });
        nav.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", close);
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

    /* ---- Contact form (demo) ---- */
    function initForm() {
        const form = document.getElementById("contactForm");
        if (!form) return;
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const data = new FormData(form);
            const body =
                "Name: " + (data.get("name") || "") + "%0D%0A" +
                "Phone: " + (data.get("phone") || "") + "%0D%0A%0D%0A" +
                (data.get("message") || "");
            // Opens the user's mail client pre-filled — swap for a backend/Formspree in production.
            window.location.href =
                "mailto:maanvikhandicrafts@gmail.com" +
                "?subject=" + encodeURIComponent("Enquiry from " + (data.get("name") || "website")) +
                "&body=" + body;
            const note = document.getElementById("formNote");
            if (note) note.hidden = false;
            form.reset();
        });
    }

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
        initYear();
        observeReveals();
    });
})();
