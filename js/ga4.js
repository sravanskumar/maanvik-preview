/* ============================================================
   Maanvik — GA4 events (conversion + engagement)
   ============================================================ */
(function () {
    "use strict";

    function send(event, params) {
        if (typeof gtag !== "function") return;
        gtag("event", event, params);
    }

    /* ---- Conversion clicks (delegated) ---- */
    document.addEventListener("click", function (e) {
        if (typeof gtag !== "function") return;
        const link = e.target.closest("a");
        if (!link || !link.href) return;

        const href = link.href;
        if (href.indexOf("tel:") === 0) {
            let label = "phone_click";
            if (link.closest(".topbar")) label = "header_phone";
            else if (link.closest("#contact")) label = "contact_phone";
            send("phone_click", { event_category: "conversion", event_label: label });
            return;
        }

        if (href.indexOf("wa.link") !== -1 || href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp.com") !== -1) {
            let label = "whatsapp_click";
            if (link.classList.contains("wa-float")) label = "floating_button";
            else if (link.closest(".hero")) label = "hero_cta";
            else if (link.closest("#contact")) label = "contact_section";
            else if (link.closest(".footer")) label = "footer";
            else if (link.closest(".topbar")) label = "header_whatsapp";
            else if (link.classList.contains("pcard__cta")) {
                const card = link.closest(".pcard");
                send("product_enquiry", {
                    event_category: "conversion",
                    event_label: card ? card.dataset.sku || "unknown" : "unknown",
                    product_name: card ? card.dataset.sku || "" : "",
                    enquiry_channel: "whatsapp",
                });
                return;
            }
            send("whatsapp_click", { event_category: "conversion", event_label: label });
            return;
        }

        const rawHref = link.getAttribute("href") || "";
        if (rawHref.charAt(0) === "#" && rawHref.length > 1) {
            send("nav_click", {
                event_category: "engagement",
                event_label: rawHref.slice(1),
                link_text: (link.textContent || "").trim().slice(0, 80),
            });
            return;
        }

        if (rawHref === "products.html" || rawHref.indexOf("products.html") !== -1) {
            send("nav_click", {
                event_category: "engagement",
                event_label: "products",
                link_text: (link.textContent || "").trim().slice(0, 80),
            });
        }
    });

    document.addEventListener("click", function (e) {
        if (typeof gtag !== "function") return;
        const btn = e.target.closest("#loadMore");
        if (!btn) return;
        send("catalog_load_more", {
            event_category: "engagement",
            event_label: "load_more",
            page_path: location.pathname,
        });
    });

    /* ---- Section visibility (homepage + catalogue) ---- */
    function initSectionViews() {
        const sections = document.querySelectorAll("section[id]");
        if (!sections.length) return;

        const seen = new Set();
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
                const id = entry.target.id;
                if (!id || seen.has(id)) return;
                seen.add(id);
                send("section_view", {
                    event_category: "engagement",
                    event_label: id,
                    page_path: location.pathname,
                });
            });
        }, { threshold: 0.35 });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    /* ---- Scroll depth (once per threshold per page) ---- */
    function initScrollDepth() {
        const marks = [25, 50, 75, 90];
        const fired = new Set();
        let ticking = false;

        function checkDepth() {
            const doc = document.documentElement;
            const scrollTop = window.pageYOffset || doc.scrollTop || 0;
            const height = doc.scrollHeight - doc.clientHeight;
            if (height <= 0) return;

            const pct = Math.round((scrollTop / height) * 100);
            marks.forEach(function (mark) {
                if (pct >= mark && !fired.has(mark)) {
                    fired.add(mark);
                    send("scroll_depth", {
                        event_category: "engagement",
                        event_label: String(mark),
                        percent_scrolled: mark,
                        page_path: location.pathname,
                    });
                }
            });
            ticking = false;
        }

        window.addEventListener("scroll", function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(checkDepth);
        }, { passive: true });

        checkDepth();
    }

    /* ---- Catalogue search (debounced, min 2 chars) ---- */
    function initCatalogSearch() {
        const input = document.getElementById("search");
        if (!input) return;

        let timer = null;
        let lastTerm = "";

        input.addEventListener("input", function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                const term = input.value.trim();
                if (term.length < 2 || term === lastTerm) return;
                lastTerm = term;
                send("catalog_search", {
                    event_category: "engagement",
                    event_label: term,
                    search_term: term,
                    page_path: location.pathname,
                });
            }, 800);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initSectionViews();
        initScrollDepth();
        initCatalogSearch();
    });
})();
