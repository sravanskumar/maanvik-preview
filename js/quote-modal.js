/* ============================================================
   Maanvik — per-product quote modal (Formspree + GA4)
   ============================================================ */
(function () {
    "use strict";

    const cfg = window.MaanvikConfig || {};
    let active = { sku: "", size: "", img: "", category: "" };

    function modalHTML() {
        return (
            '<div class="quote-modal" id="quoteModal" hidden aria-hidden="true">' +
            '<div class="quote-modal__backdrop" data-quote-close></div>' +
            '<div class="quote-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="quoteModalTitle">' +
            '<button type="button" class="quote-modal__close" data-quote-close aria-label="Close">&times;</button>' +
            '<div class="quote-modal__layout">' +
            '<div class="quote-modal__product" id="quoteModalProduct"></div>' +
            '<div class="quote-modal__form-wrap">' +
            '<span class="overline overline--dark">Product enquiry</span>' +
            '<h2 class="quote-modal__title" id="quoteModalTitle">Request a quote</h2>' +
            '<p class="quote-modal__lede">Share your details — we will confirm pricing and availability for this piece.</p>' +
            '<form class="quote-modal__form bulk-form" id="quoteModalForm" novalidate>' +
            '<input type="hidden" name="enquiry_type" value="product_quote">' +
            '<input type="hidden" name="sku" id="quoteSku" value="">' +
            '<input type="hidden" name="size" id="quoteSize" value="">' +
            '<input type="hidden" name="category" id="quoteCategory" value="">' +
            '<input type="hidden" name="_subject" id="quoteSubject" value="">' +
            '<div class="form-row">' +
            '<div class="field field--half"><label for="quoteName">Your name *</label>' +
            '<input type="text" id="quoteName" name="name" required placeholder="Full name"></div>' +
            '<div class="field field--half"><label for="quoteOrg">Organisation</label>' +
            '<input type="text" id="quoteOrg" name="organisation" placeholder="School, college, company"></div>' +
            '</div>' +
            '<div class="form-row">' +
            '<div class="field field--half"><label for="quotePhone">Phone / WhatsApp *</label>' +
            '<input type="tel" id="quotePhone" name="phone" required placeholder="+91 XXXXX XXXXX"></div>' +
            '<div class="field field--half"><label for="quoteQty">Quantity</label>' +
            '<input type="text" id="quoteQty" name="quantity" placeholder="e.g. 50 pieces"></div>' +
            '</div>' +
            '<div class="field"><label for="quoteEmail">Email</label>' +
            '<input type="email" id="quoteEmail" name="email" placeholder="your@email.com"></div>' +
            '<div class="field"><label for="quoteNotes">Notes</label>' +
            '<textarea id="quoteNotes" name="message" rows="3" placeholder="Engraving, delivery date, or other details"></textarea></div>' +
            '<button type="submit" class="btn btn--gold btn--block">Send quote request</button>' +
            '<p class="form__note" id="quoteModalNote" hidden>Thank you — we will be in touch within 24 hours.</p>' +
            '</form></div></div></div></div>'
        );
    }

    function productPanelHTML(opts) {
        const img = opts.img
            ? '<img src="' + opts.img + '" alt="' + opts.sku + '">'
            : "";
        return (
            '<div class="quote-modal__img">' + img + "</div>" +
            '<p class="quote-modal__sku">' + opts.sku + "</p>" +
            (opts.size ? '<p class="quote-modal__size">Size: ' + opts.size + "</p>" : "") +
            (opts.category ? '<p class="quote-modal__cat">' + opts.category + "</p>" : "") +
            '<p class="quote-modal__poa">Price on request — confirmed when you enquire</p>'
        );
    }

    function openModal(opts) {
        const modal = document.getElementById("quoteModal");
        if (!modal) return;
        active = {
            sku: opts.sku || "",
            size: opts.size || "",
            img: opts.img || "",
            category: opts.category || "",
        };
        document.getElementById("quoteSku").value = active.sku;
        document.getElementById("quoteSize").value = active.size;
        document.getElementById("quoteCategory").value = active.category;
        document.getElementById("quoteSubject").value = "Product quote: " + active.sku;
        document.getElementById("quoteModalProduct").innerHTML = productPanelHTML(active);
        document.getElementById("quoteModalNote").hidden = true;
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("quote-open");
        document.getElementById("quoteName").focus();
        if (typeof gtag === "function") {
            gtag("event", "product_quote_open", {
                event_category: "conversion",
                event_label: active.sku,
                product_name: active.sku,
            });
        }
    }

    function closeModal() {
        const modal = document.getElementById("quoteModal");
        if (!modal) return;
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("quote-open");
    }

    function submitForm(form) {
        const action = cfg.formspreeProductQuote || "";
        const note = document.getElementById("quoteModalNote");
        const btn = form.querySelector('button[type="submit"]');
        if (!action || action.indexOf("[FORMSPREE") !== -1) {
            if (note) {
                note.textContent = "Form is not yet connected — replace the Formspree ID.";
                note.hidden = false;
            }
            return Promise.reject(new Error("Formspree placeholder"));
        }
        if (btn) btn.disabled = true;
        return fetch(action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
        }).then(function (res) {
            if (!res.ok) throw new Error("Form submission failed");
            if (note) note.hidden = false;
            form.reset();
            document.getElementById("quoteSku").value = active.sku;
            document.getElementById("quoteSize").value = active.size;
            document.getElementById("quoteCategory").value = active.category;
            document.getElementById("quoteSubject").value = "Product quote: " + active.sku;
            if (typeof gtag === "function") {
                gtag("event", "product_quote_submit", {
                    event_category: "conversion",
                    event_label: active.sku,
                    product_name: active.sku,
                });
            }
        }).finally(function () {
            if (btn) btn.disabled = false;
        });
    }

    function initDelegation() {
        document.addEventListener("click", function (e) {
            const openBtn = e.target.closest("[data-quote-open]");
            if (openBtn) {
                e.preventDefault();
                openModal({
                    sku: openBtn.dataset.sku || "",
                    size: openBtn.dataset.size || "",
                    img: openBtn.dataset.img || "",
                    category: openBtn.dataset.category || "",
                });
                return;
            }
            if (e.target.closest("[data-quote-close]")) {
                closeModal();
            }
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeModal();
        });
    }

    function initForm() {
        const form = document.getElementById("quoteModalForm");
        if (!form) return;
        form.setAttribute("action", cfg.formspreeProductQuote || "");
        form.setAttribute("method", "POST");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            submitForm(form).catch(function () {});
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.body.insertAdjacentHTML("beforeend", modalHTML());
        initDelegation();
        initForm();
    });

    window.MaanvikQuote = { open: openModal, close: closeModal };
})();
