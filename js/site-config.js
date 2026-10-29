/* ============================================================
   Maanvik — site-wide config (catalog mode, trust, forms)
   ============================================================ */
window.MaanvikConfig = {
    /* Loaded from docs/artefacts/maanvik-awards-catalog.pdf — BR review partial OCR rows in awards-catalog.json */
    showIndicativePrices: true,

    formspreeProductQuote: "https://formspree.io/f/mnjejnny",

    whatsappPhone: "919133441188",
    /* Append public product image URL to catalogue WhatsApp pre-fill (link preview in chat). */
    whatsappIncludeProductImage: true,

    gstin: "37AXPPG4759A1ZC",
    udyam: "UDYAM-AP-04-0033053",

    responsePromise: "We respond within 24 hours",

    /* Canonical site root — leave empty to auto-detect from the current URL (works on GitHub Pages preview). */
    siteBaseUrl: "",

    business: {
        name: "Maanvik Handicrafts",
        description:
            "Premium trophies, medals and bespoke awards for schools, universities, sport and corporate India.",
        email: "bhagyaraju.gurram@maanvikhandicrafts.com",
        phone: "+919133441188",
        logoPath: "assets/img/logo-mark.png",
        branches: [
            {
                name: "Maanvik Handicrafts — Vijayawada",
                streetAddress: "Yamini Handicrafts, 26-3-19/1, Gandhi Nagar, Nageswara Rao Panthulu Road",
                addressLocality: "Vijayawada",
                addressRegion: "Andhra Pradesh",
                postalCode: "520003",
                addressCountry: "IN",
            },
            {
                name: "Maanvik Handicrafts — Mangalagiri",
                streetAddress: "Flat No. 7-318, Trunk Road, Beside Vijay Talkies",
                addressLocality: "Mangalagiri",
                addressRegion: "Andhra Pradesh",
                postalCode: "522503",
                addressCountry: "IN",
            },
            {
                name: "Maanvik Handicrafts — Manufacturing Unit",
                streetAddress: "Model Industrial Park Phase-1, Plot 31/91 & 31/92, Mallavalli",
                addressLocality: "Krishna District",
                addressRegion: "Andhra Pradesh",
                addressCountry: "IN",
            },
        ],
        sameAs: [
            "https://www.instagram.com/maanvikhandicrafts",
            "https://www.facebook.com/share/1DW3tBkJAu/",
            "https://wa.link/tvhqvx",
        ],
    },

    /* 3D illustration spike — not tied to catalogue SKUs (see trophy-3d-spike.html) */
    showcase3d: {
        glb: "assets/3d/showcase-trophy.glb",
        poster: "assets/img/hero1-2.jpg",
        title: "Sample award trophy",
        licenseNote: "Illustration model: Trophy Cup (CC0) via grab3d.com — not a Maanvik catalogue SKU.",
    },
};
