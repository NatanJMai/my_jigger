// To see this message, follow the instructions for your Ruby framework.
//
// When using a plain API, perhaps it's better to generate an HTML entrypoint
// and link to the scripts and stylesheets, and let Vite transform it.
console.log('Vite ⚡️ Ruby')

import '../scss/app.scss'

import { Turbo } from "@hotwired/turbo-rails"
Turbo.session.drive = false
import '../js/config'