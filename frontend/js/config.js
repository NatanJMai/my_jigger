/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Config
 */

function initConfig() {
  const html = document.documentElement;
  const storageKey = "__UBOLD_CONFIG__";
  let savedConfig = null;

  // Safely access sessionStorage
  try {
    savedConfig = sessionStorage.getItem(storageKey);
  } catch (e) {
    console.warn('SessionStorage not available:', e);
  }

  // Default config
  const defaultConfig = {
    skin: "default",
    monochrome: false,
    theme: "light",
    layout: {
      position: "fixed",
    },
    topbar: {
      color: "dark",
    },
    menu: {
      color: "light",
    },
    sidenav: {
      size: "default",
      user: false,
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
}

// Run on initial load
initConfig();

// Re-run on Turbo page loads
document.addEventListener('turbo:load', initConfig);