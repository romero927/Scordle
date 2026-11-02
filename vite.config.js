import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Split the bundle so each piece is cached on its own: game code changes often,
// React and the word lists rarely do, so returning players only re-download what changed.
function chunkName(id) {
  if (id.includes('/node_modules/react') || id.includes('/node_modules/scheduler')) return 'react'
  if (id.includes('/src/words/')) return 'words'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks: chunkName },
    },
  },
})
