import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// Preact runs the React code through its compat layer ('react' imports are aliased),
// at a fraction of React's download size.
//
// Split the bundle so each piece is cached on its own: game code changes often,
// Preact and the word lists rarely do, so returning players only re-download what changed.
function chunkName(id) {
  if (id.includes('/node_modules/preact')) return 'preact'
  if (id.includes('/src/words/')) return 'words'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      output: { manualChunks: chunkName },
    },
  },
})
