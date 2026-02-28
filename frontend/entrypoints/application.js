import "@hotwired/turbo-rails"

// Import app first to ensure jQuery is available
import '../js/app'
import '../js/config'
import '../js/modals'
import '../js/datasheet'

// Import chart JS files so they're available on Turbo navigation
import '../js/pages/chart-apex-line'
import '../js/pages/chart-apex-bar'
import '../js/pages/chart-apex-pie'
import '../js/pages/chart-apex-area'

// Prevent Turbo from driving non-Turbo links is handled globally
// by turbo-rails default.

// Add data-turbo="false" support for links that should bypass Turbo
$(document).on('turbo:click', function (event) {
  if ($(event.target).closest('[data-turbo="false"]').length) {
    event.preventDefault();
  }
});

import '../scss/app.scss'

console.log('Vite ⚡️ Ruby')

document.addEventListener('turbo:load', () => {
  console.log('Turbo:load fired!')
  if (window.lucide) window.lucide.createIcons()
})