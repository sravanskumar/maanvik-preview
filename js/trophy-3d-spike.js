/* Maanvik — standalone 3D illustration (no catalogue SKU) */
(function () {
    "use strict";

    var showcase = (window.MaanvikConfig && window.MaanvikConfig.showcase3d) || {};
    var viewer = document.getElementById("showcaseModel");
    var titleEl = document.getElementById("showcaseTitle");
    var licenseEl = document.getElementById("showcaseLicense");

    if (!viewer) {
        return;
    }

    if (showcase.glb) {
        viewer.setAttribute("src", showcase.glb);
    }
    if (showcase.poster) {
        viewer.setAttribute("poster", showcase.poster);
    }
    if (showcase.title && titleEl) {
        titleEl.textContent = showcase.title;
    }
    if (showcase.licenseNote && licenseEl) {
        licenseEl.textContent = showcase.licenseNote;
    }

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyMotion() {
        if (reducedMotion.matches) {
            viewer.removeAttribute("auto-rotate");
        } else {
            viewer.setAttribute("auto-rotate", "");
        }
    }
    applyMotion();
    if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener("change", applyMotion);
    }

    viewer.addEventListener("load", function () {
        if (window.gtag) {
            gtag("event", "showcase_3d_load", { page: "trophy-3d-spike" });
        }
    });
})();
