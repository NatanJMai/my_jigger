import "@hotwired/turbo-rails"

import '../scss/app.scss'
import '../js/config'
import '../js/modals'

console.log('Vite ⚡️ Ruby')

document.addEventListener('turbo:load', () => {
  console.log('Turbo:load fired!')
  if (window.lucide) window.lucide.createIcons()
})