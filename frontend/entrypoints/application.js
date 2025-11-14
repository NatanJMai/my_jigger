import "@hotwired/turbo-rails"

import '../scss/app.scss'
import '../js/app'
import '../js/config'
import '../js/modals'
import '../js/datasheet'

console.log('Vite ⚡️ Ruby')

document.addEventListener('turbo:load', () => {
  console.log('Turbo:load fired!')
  if (window.lucide) window.lucide.createIcons()
})