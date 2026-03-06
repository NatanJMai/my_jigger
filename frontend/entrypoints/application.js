import * as Turbo from "@hotwired/turbo-rails"
window.Turbo = Turbo

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

import '../scss/app.scss'

console.log('Vite ⚡️ Ruby')

document.addEventListener('turbo:load', () => {
  console.log('Turbo:load fired!')
  if (window.lucide) window.lucide.createIcons()
})