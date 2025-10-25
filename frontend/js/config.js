/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Config
 */

(function () {
    const html = document.documentElement;
    const storageKey = "__UBOLD_CONFIG__";
    const savedConfig = sessionStorage.getItem(storageKey);

    // Default config
    const defaultConfig = {
        skin: "default",                // Theme skin: classic, two, three, four, five, six
        monochrome: false,              // Enable monochrome mode
        theme: "light",                 // App theme: light or dark
        layout: {
            position: "fixed",          // Layout position: fixed or scrollable
        },
        topbar: {
            color: "dark",              // Topbar color: light, dark, or gray
        },
        menu: {
            color: "light",             // Menu color: light, dark, or gray
        },
        sidenav: {
            size: "default",            // Sidebar size: default, collapse, or offcanvas
            user: false,                // Show user info in sidebar: true or false
        },
    };

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    }

    // Build config from HTML attributes
    const htmlConfig = {
        skin: html.getAttribute("data-skin") || defaultConfig.skin,
        monochrome: html.classList.contains("monochrome") || defaultConfig.monochrome,
        theme: html.getAttribute("data-bs-theme") === 'system'
            ? getSystemTheme()
            : html.getAttribute("data-bs-theme") || (defaultConfig.theme === 'system' ? getSystemTheme() : defaultConfig.theme),
        layout: {
            position: html.getAttribute("data-layout-position") || defaultConfig.layout.position,
        },
        topbar: {
            color: html.getAttribute("data-topbar-color") || defaultConfig.topbar.color,
        },
        menu: {
            color: html.getAttribute("data-menu-color") || defaultConfig.menu.color,
        },
        sidenav: {
            size: html.getAttribute("data-sidenav-size") || defaultConfig.sidenav.size,
            user: html.hasAttribute("data-sidenav-user") || defaultConfig.sidenav.user,
        },
    };

    // Save merged config as defaults globally
    window.defaultConfig = structuredClone(htmlConfig);

    // Load from session if exists
    let config = savedConfig ? JSON.parse(savedConfig) : htmlConfig;
    window.config = config;

    // Apply layout attributes immediately
    html.setAttribute("data-skin", config.skin);
    html.setAttribute("data-bs-theme", config.theme === 'system' ? getSystemTheme() : config.theme);
    html.setAttribute("data-menu-color", config.menu.color);
    html.setAttribute("data-topbar-color", config.topbar.color);
    html.setAttribute("data-layout-position", config.layout.position);
    html.classList.toggle("monochrome", config.monochrome);

    if (config.sidenav.size) {
        let size = config.sidenav.size;

        if (window.innerWidth <= 767) {
            size = "offcanvas";
        } else if (window.innerWidth <= 1140 && !["offcanvas"].includes(size)) {
            size = "condensed";
        }

        html.setAttribute("data-sidenav-size", size);

        if (config.sidenav.user === true) {
            html.setAttribute("data-sidenav-user", "true");
        } else {
            html.removeAttribute("data-sidenav-user");
        }
    }
})();
