/* ============================================================
   Maanvik — JSON-LD structured data (Organization, WebSite, ItemList)
   ============================================================ */
window.MaanvikSchema = (function () {
    "use strict";

    function cfg() {
        return window.MaanvikConfig || {};
    }

    function siteBase() {
        const c = cfg();
        if (c.siteBaseUrl) {
            return String(c.siteBaseUrl).replace(/\/$/, "");
        }
        const path = window.location.pathname || "/";
        const slash = path.lastIndexOf("/");
        const dir = slash >= 0 ? path.slice(0, slash + 1) : "/";
        return window.location.origin + dir.replace(/\/$/, "");
    }

    function absUrl(relativePath) {
        const base = siteBase();
        const path = String(relativePath || "").replace(/^\//, "");
        return base + "/" + path;
    }

    function orgId() {
        return siteBase() + "/#organization";
    }

    function websiteId() {
        return siteBase() + "/#website";
    }

    function postalAddress(branch) {
        const addr = {
            "@type": "PostalAddress",
            streetAddress: branch.streetAddress,
            addressLocality: branch.addressLocality,
            addressRegion: branch.addressRegion,
            addressCountry: branch.addressCountry || "IN",
        };
        if (branch.postalCode) {
            addr.postalCode = branch.postalCode;
        }
        return addr;
    }

    function buildOrganization() {
        const c = cfg();
        const biz = c.business || {};
        const branches = Array.isArray(biz.branches) ? biz.branches : [];
        const primary = branches[0] || {};

        const org = {
            "@type": ["Organization", "LocalBusiness"],
            "@id": orgId(),
            name: biz.name || "Maanvik Handicrafts",
            url: siteBase() + "/",
            logo: absUrl(biz.logoPath || "assets/img/logo-mark.png"),
            image: absUrl(biz.logoPath || "assets/img/logo-mark.png"),
            description: biz.description || "",
            email: biz.email,
            telephone: biz.phone,
            taxID: c.gstin,
            identifier: [
                {
                    "@type": "PropertyValue",
                    name: "GSTIN",
                    value: c.gstin,
                },
                {
                    "@type": "PropertyValue",
                    name: "Udyam",
                    value: c.udyam,
                },
            ],
            areaServed: {
                "@type": "Country",
                name: "India",
            },
            priceRange: "₹₹",
            sameAs: biz.sameAs || [],
        };

        if (primary.streetAddress) {
            org.address = postalAddress(primary);
        }

        if (branches.length > 1) {
            org.location = branches.map(function (branch) {
                return {
                    "@type": "Place",
                    name: branch.name,
                    address: postalAddress(branch),
                };
            });
        }

        return org;
    }

    function buildWebSite() {
        return {
            "@type": "WebSite",
            "@id": websiteId(),
            url: siteBase() + "/",
            name: "Maanvik Handicrafts",
            description: (cfg().business || {}).description || "",
            publisher: { "@id": orgId() },
            inLanguage: "en-IN",
        };
    }

    function productImage(img) {
        const path = img.indexOf("assets/") === 0 ? img : "assets/" + img;
        return absUrl(path);
    }

    function productOffers(variants, productUrl) {
        const prices = variants
            .map(function (v) {
                return Number(v.price);
            })
            .filter(function (p) {
                return !isNaN(p) && p > 0;
            });

        if (!prices.length) {
            return {
                "@type": "Offer",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: productUrl,
                description: "Price on request — enquire for a quote",
            };
        }

        return {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: Math.min.apply(null, prices),
            highPrice: Math.max.apply(null, prices),
            offerCount: variants.length,
            availability: "https://schema.org/InStock",
            url: productUrl,
            description: "Indicative prices — final quote on enquiry",
        };
    }

    function buildCollectionPage(products) {
        const collectionUrl = absUrl("products.html");
        const list = (products || []).map(function (item, index) {
            const sku = item.name;
            const productUrl = collectionUrl + "#" + encodeURIComponent(sku);
            return {
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Product",
                    "@id": productUrl,
                    name: "Maanvik " + sku + " Award Trophy",
                    sku: sku,
                    image: productImage(item.img),
                    brand: { "@id": orgId() },
                    category: "Trophies & Awards",
                    offers: productOffers(item.variants || [], productUrl),
                },
            };
        });

        return {
            "@type": "CollectionPage",
            "@id": collectionUrl + "#webpage",
            url: collectionUrl,
            name: "The Maanvik Collection",
            description:
                "Browse the full Maanvik collection of trophies, medals and mementos with indicative pricing.",
            isPartOf: { "@id": websiteId() },
            about: { "@id": orgId() },
            inLanguage: "en-IN",
            mainEntity: {
                "@type": "ItemList",
                numberOfItems: list.length,
                itemListElement: list,
            },
        };
    }

    function inject(graph) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@graph": graph,
        });
        document.head.appendChild(script);
    }

    function init(options) {
        const opts = options || {};
        const graph = [buildOrganization(), buildWebSite()];

        if (opts.page === "collection") {
            const products =
                opts.products ||
                (typeof productData !== "undefined" ? productData : []);
            graph.push(buildCollectionPage(products));
        }

        inject(graph);
    }

    return { init: init };
})();
