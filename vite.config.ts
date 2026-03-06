import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import * as path from "node:path";

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend')
    }
  },
  build: { sourcemap: false }
})
