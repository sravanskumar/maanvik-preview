/* ============================================================
   Maanvik — GA4 conversion events (shared across pages)
   ============================================================ */
(function () {
    "use strict";

    document.addEventListener("click", function (e) {
        if (typeof gtag !== "function") return;
        const link = e.target.closest("a");
        if (!link || !link.href) return;

        const href = link.href;
        if (href.indexOf("tel:") === 0) {
            let label = "phone_click";
            if (link.closest(".topbar")) label = "header_phone";
            else if (link.closest("#contact")) label = "contact_phone";
            gtag("event", "phone_click", { event_category: "conversion", event_label: label });
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
                gtag("event", "product_enquiry", {
                    event_category: "conversion",
                    event_label: card ? card.dataset.sku || "unknown" : "unknown",
                    product_name: card ? card.dataset.sku || "" : "",
                    enquiry_channel: "whatsapp",
                });
                return;
            }
            gtag("event", "whatsapp_click", { event_category: "conversion", event_label: label });
        }
    });
})();
